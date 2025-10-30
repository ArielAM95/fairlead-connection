# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**oFair** is a professional services marketplace platform connecting service professionals (plumbers, electricians, contractors, etc.) with potential clients in Israel. This is the public-facing landing page and registration system.

**Technology Stack:**
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI (shadcn/ui components)
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Deployment**: Netlify
- **Payment Processing**: Tranzila (Hosted Fields SDK)
- **External Automation**: Make.com webhooks

**Supabase Project**: `https://erlfsougrkzbgonumhoa.supabase.co`
**Shared with**: `/Users/itzikezra/Documents/repos/pro-ofair-app` (same Supabase instance)

## Common Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:8080
npm install              # Install dependencies

# Build
npm run build            # Production build (output: dist/)
npm run build:dev        # Development build with source maps
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint

# Supabase Edge Functions
supabase functions deploy <function-name>    # Deploy single function
supabase functions deploy                    # Deploy all functions
```

## Key Architecture Patterns

### Registration & Payment Flow

The system implements a **two-step registration process**:

1. **User fills form** → Professional record created in DB + Webhook sent to Make.com (parallel operations)
2. **User pays registration fee** → Payment method (tokenized card) saved to professional record

**Critical: The professional record MUST exist in the database before payment**, as the payment function (`tranzila-registration-payment`) looks up the professional by `phone_number`.

**Flow Diagram:**
```
User Submit Form
    ↓
    ├─→ submitSignupForm() → Supabase.professionals.insert() → DB Record Created
    │                     └─→ send-registration-webhook → Make.com (email/WhatsApp)
    ↓
Payment Dialog Opens
    ↓
    ├─→ tranzila-handshake-public → Get handshake token
    ├─→ Tranzila Hosted Fields SDK → Collect card + Charge 1 ILS (testing) / 413 ILS (production)
    └─→ tranzila-registration-payment → Find professional by phone → Save encrypted token
```

### Tranzila Payment Integration

**Implementation follows**: `/Users/itzikezra/Documents/Ofair/pro-ofair-app/docs/TRANZILA_IMPLEMENTATION_GUIDE.md`

**Key Components:**
- `TranzilaPaymentDialog.tsx` - Payment dialog with Hosted Fields (used in SignupForm)
- `Registration.tsx` - Standalone registration page for testing
- `tranzila-handshake-public` - Public endpoint for handshake token (no auth)
- `tranzila-registration-payment` - Saves encrypted token after payment

**Critical SDK Usage Patterns:**
```typescript
// ✅ CORRECT - Callback pattern (NOT promises)
const chargeResult = await new Promise((resolve, reject) => {
  tranzilaInstance.charge(
    {
      terminal_name: terminalName,     // NOT 'supplier'
      thtk: handshakeToken,             // Handshake token
      amount: '1.00',                   // String with 2 decimals
      currency_code: 'ILS',             // NOT 'currency: 1'
      tran_mode: 'A',                   // Auth + Capture
      tokenize: true                    // NOT 'createtoken: 1'
    },
    (err, response) => {                // Callback, not promise!
      if (err) reject(err);
      else resolve(response);
    }
  );
});

// ✅ Extract from correct response structure
const txnResponse = chargeResult.transaction_response;  // NOT direct properties
const token = txnResponse.token;
const last4 = String(txnResponse.credit_card_last_4_digits).padStart(4, '0').slice(-4);

// ✅ Event listeners
hostedFieldsInstance.onEvent('ready', () => { ... });  // NOT .on()
```

**Current Testing Amount**: 1 ILS (change to 413 ILS before production in 3 files):
- `src/pages/Registration.tsx:18`
- `src/components/cta/TranzilaPaymentDialog.tsx:23`
- Check any hardcoded amounts in SignupForm

**Token Encryption**: Uses AES-256-GCM (compatible with pro-ofair-app encryption)

### Database Insert Pattern

Professional records are created directly from the frontend via Supabase client:

```typescript
// src/services/formSubmission.ts
const { data, error } = await supabase
  .from('professionals')
  .insert({
    name: `${firstName} ${lastName}`,
    phone_number: phone,
    email: email || null,
    profession: mainProfession,
    main_profession: mainProfession,
    sub_specializations: allSpecializations,
    location: city,
    areas: workRegions,
    experience_years: experienceYears,
    company_name: companyName || null,
    business_license_number: businessLicenseNumber || null,
    terms_accepted: acceptTerms,
    marketing_consent: acceptMarketing,
    status: 'pending'
  });
```

**Row Level Security (RLS)** allows public inserts with `status='pending'` and `terms_accepted=true`.

### Profession Selection System

The system supports **56 professions** with **~200 sub-specializations**:

```typescript
interface ProfessionSelection {
  professionId: string;          // e.g., "plumber", "electrician"
  specializations: string[];     // e.g., ["sanitary", "gas"]
  otherText?: string;           // For "other" profession
}

formData.professions: ProfessionSelection[];
```

**Data Files:**
- `src/components/cta/data/professionsAndSpecializations.ts` - Master profession data
- Helper functions: `getProfessionLabel()`, `getSpecializationLabel()`

### Form State Management

Uses a **custom hooks architecture** (not React Hook Form in the main signup):

- `useSignupForm()` - Main orchestrator
  - `useFormState()` - State management
  - `useFormValidation()` - Validation logic
  - `useFieldHandlers()` - Complex field interactions

**Why custom hooks?** Complex multi-select behavior with nested specializations required fine-grained control.

### Supabase Edge Functions

All edge functions use **Deno runtime** and follow this pattern:

```typescript
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Logic here
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

**Available Functions:**
- `send-registration-webhook` - Forwards registration to Make.com
- `tranzila-handshake-public` - Gets Tranzila handshake token (no auth)
- `tranzila-registration-payment` - Saves encrypted payment token

## Critical Patterns & Gotchas

### 1. Hebrew RTL Support

The entire app is RTL (right-to-left). Key considerations:

```tsx
// ✅ Input fields need explicit dir="ltr" for emails/phones
<Input dir="ltr" type="email" />

// ✅ Flexbox reverses in RTL - use rtl: utility
<div className="flex gap-2 rtl:space-x-reverse">
```

### 2. SPA Routing on Netlify

**Required files:**
- `netlify.toml` - Build configuration
- `public/_redirects` - Route all to index.html

```
# public/_redirects
/*    /index.html   200
```

This ensures React Router handles all routes, not Netlify's 404.

### 3. Phone Number Validation

Israeli phone format only:

```typescript
// ✅ CORRECT
const phoneRegex = /^0[2-9]\d{7,8}$/;

// Examples of valid phones:
// 02-1234567   (landline)
// 050-1234567  (mobile)
// 03-12345678  (8-digit landline)
```

### 4. Profession "Other" Handling

When user selects "אחר" (Other):
1. `professionId: "other"` is added to selections
2. `otherProfession` text field appears
3. Validation requires `otherProfession` to be filled
4. Stored as custom text in `profession` field

### 5. Make.com Webhook Role

**What Make.com DOES:**
- Send email notifications (to sales team, to customer)
- Send WhatsApp messages
- Update external CRM/Google Sheets

**What Make.com DOES NOT DO:**
- Create database records (done by our code)
- Handle payments (done by Tranzila functions)

### 6. Shared Supabase Instance

This project shares the same Supabase instance with `pro-ofair-app`. This means:
- ✅ Edge functions deployed from pro-ofair-app are available here
- ✅ Can reuse existing functions (e.g., `tranzila-charge-saved-card`)
- ⚠️ Schema changes affect both projects
- ⚠️ Be careful with migrations

### 7. Path Aliases

Use `@/` for all imports:

```typescript
import { supabase } from '@/integrations/supabase/client';  // ✅
import { SignupForm } from '@/components/cta/SignupForm';  // ✅
import { validateEmail } from '@/utils/formValidation';    // ✅
```

Configured in `vite.config.ts` and `tsconfig.json`.

## Important Database Tables

### `professionals`
Main table for service professionals. Key fields:
- `phone_number` - Unique identifier (used for payment lookup)
- `status` - 'pending' | 'approved' | 'rejected'
- `profession` - Main profession (Hebrew text)
- `sub_specializations` - Array of specialization strings
- `areas` - JSON string of work regions

**RLS Policy**: Public can insert with `status='pending'`

### `payment_methods`
Stores encrypted credit card tokens:
- `professional_id` - FK to professionals
- `token_encrypted` - AES-256-GCM encrypted Tranzila token
- `card_last4` - Last 4 digits for display
- `expiry_month`, `expiry_year` - Card expiry
- `is_default` - Default payment method flag

### `transaction_logs`
Audit trail for all payment operations:
- `professional_id` - FK to professionals (nullable)
- `action` - 'handshake' | 'save_token' | 'tokenize' | 'charge' | 'error'
- `request`, `response` - JSONB logs

## File Structure Highlights

```
src/
├── components/
│   ├── cta/                     # Registration form components
│   │   ├── SignupForm.tsx       # Main signup form (with payment dialog)
│   │   ├── TranzilaPaymentDialog.tsx  # Payment dialog component
│   │   ├── form-sections/       # Form section components
│   │   └── data/                # Profession & work field data
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── useSignupForm.ts         # Main form orchestrator
│   └── form/                    # Form-specific hooks
├── pages/
│   ├── Index.tsx                # Landing page
│   ├── Registration.tsx         # Standalone registration (for testing)
│   ├── CommissionCalculator.tsx # Commission calculator tool
│   └── Terms.tsx                # Terms & privacy
├── services/
│   └── formSubmission.ts        # Form submission logic
└── integrations/supabase/
    ├── client.ts                # Supabase client instance
    └── types.ts                 # Generated DB types

supabase/functions/
├── tranzila-handshake-public/   # Get handshake token (no auth)
├── tranzila-registration-payment/  # Save payment after registration
└── send-registration-webhook/   # Forward to Make.com

docs/
└── system_overview.md           # Comprehensive Hebrew documentation
```

## Testing Checklist

When testing registration + payment flow:

1. ✅ Fill registration form completely
2. ✅ Verify webhook sent to Make.com (check logs)
3. ✅ Verify professional record created in DB (check `professionals` table)
4. ✅ Complete payment with test card
5. ✅ Verify token saved to `payment_methods` table (encrypted)
6. ✅ Verify transaction logged to `transaction_logs` table
7. ✅ Check that professional can be found by phone_number

**Before Production:**
- [ ] Change registration fee from 1 ILS back to 413 ILS in 3 files
- [ ] Test with real Tranzila credentials
- [ ] Verify IP whitelisting with Tranzila
- [ ] Test complete flow end-to-end

## Related Documentation

- **Full System Documentation** (Hebrew): `docs/system_overview.md`
- **Tranzila Implementation Guide**: `/Users/itzikezra/Documents/Ofair/pro-ofair-app/docs/TRANZILA_IMPLEMENTATION_GUIDE.md`
- **Supabase Studio**: https://app.supabase.com/project/erlfsougrkzbgonumhoa

## Git Workflow

**Current Branch**: `tranzila` (for payment integration work)
**Main Branch**: `main`

**Deployment**: Netlify auto-deploys from the `tranzila` branch.
