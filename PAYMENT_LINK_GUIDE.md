# Payment Link Feature - User Guide

## Overview

The payment link feature allows you to send a direct payment link to professionals who registered but haven't completed their payment yet.

## How It Works

### 1. Generate Payment Link

For any professional who didn't pay during registration, create a payment link with their phone number:

```
https://yourdomain.com/registration?phone=0501234567
```

**Example:**
```
https://fairlead-connection.netlify.app/registration?phone=0501234567
```

### 2. Send to User

Send this link via:
- Email
- WhatsApp
- SMS
- Any other communication channel

### 3. User Experience

When the user clicks the link:

1. **Personalized greeting**: "שלום [Name]!" (if name exists in database)
2. **Phone pre-filled**: Their phone number is already set
3. **Phone field hidden**: They can't change it
4. **Payment form shown**: Only credit card fields are visible
5. **Same secure flow**: Uses Tranzila Hosted Fields (PCI-compliant)

### 4. After Payment

- **Success**: Professional's `registration_payment_status` updated to 'completed'
- **Card saved**: If checkbox checked, encrypted token saved to `payment_methods`
- **Invoice generated**: Automatic invoice creation (if Tranzila billing API is enabled)
- **Redirect**: User sent to homepage with success message

## Technical Details

### URL Parameters

| Parameter | Required | Format | Example |
|-----------|----------|--------|---------|
| `phone` | Yes | Israeli phone number | `0501234567` |

### Database Lookup

The system automatically:
1. Looks up the professional by phone number
2. Fetches their name for display
3. Validates they exist before showing payment form

### Security

- ✅ Phone number must exist in `professionals` table
- ✅ Payment is processed by Tranzila (PCI-compliant)
- ✅ Token is encrypted before storage (AES-256-GCM)
- ✅ Same security as normal registration flow

## Usage Examples

### Example 1: WhatsApp Message Template

```
שלום [Name]! 👋

קישור להשלמת תשלום ההרשמה לפלטפורמת oFair:
https://fairlead-connection.netlify.app/registration?phone=0501234567

דמי הרשמה: ₪413 (כולל מע"מ)

בברכה,
צוות oFair
```

### Example 2: Email Template

```
Subject: השלמת הרשמה - oFair

שלום [Name],

נא להשלים את תשלום דמי ההרשמה לפלטפורמת oFair:

🔗 קישור לתשלום:
https://fairlead-connection.netlify.app/registration?phone=0501234567

💰 סכום: ₪413 (כולל מע"מ)

🔒 התשלום מאובטח על ידי Tranzila

בברכה,
צוות oFair
```

## Testing

### Test Payment Link

1. Create a professional in the database (or use existing)
2. Generate link: `http://localhost:8080/registration?phone=0501234567`
3. Open link in browser
4. Verify:
   - Name appears in greeting
   - Phone field is hidden
   - Phone is pre-filled (check form submission)
   - Payment processes correctly
   - Success redirect works

### Test Cases

- ✅ Valid phone number (exists in DB)
- ❌ Invalid phone number (doesn't exist)
- ❌ Malformed phone number
- ✅ Payment with "save card" checked
- ✅ Payment with "save card" unchecked
- ✅ Payment failure handling
- ✅ Already paid (should still allow re-payment)

## Frontend Code

**File**: `src/pages/Registration.tsx`

**Key Features**:
1. Detects `?phone=` URL parameter
2. Sets `isPaymentLink` state to `true`
3. Fetches professional name from database
4. Hides phone input field
5. Shows personalized header
6. Processes payment with pre-filled phone

## Backend Integration

**Edge Function**: `tranzila-registration-payment`

Same function used for both:
- Normal registration payment
- Payment link payment

**Request**:
```json
{
  "phone_number": "0501234567",
  "tranzila_token": "encrypted_token",
  "card_last4": "1234",
  "expiry_month": 12,
  "expiry_year": 2025,
  "confirmation_code": "ABC123",
  "amount": 413
}
```

## Future Enhancements

Possible improvements:
1. **Token-based links** for better security (instead of phone in URL)
2. **Expiration dates** on payment links
3. **One-time use** links (prevent re-use)
4. **Custom redirect** after payment (e.g., to app store)
5. **Payment reminder** automation (send link after X days)

## Production Checklist

Before going live:
- [ ] Change `REGISTRATION_FEE` from 1 to 413 in `Registration.tsx`
- [ ] Update domain in examples above
- [ ] Test with real Tranzila credentials
- [ ] Set up email/WhatsApp templates
- [ ] Create Make.com scenario for auto-sending links
- [ ] Monitor payment completion rates

---

**Created**: November 2, 2025
**Last Updated**: November 2, 2025
**Status**: ✅ Implemented and Ready for Testing
