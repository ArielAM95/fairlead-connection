# Tranzila Registration - Quick Testing Guide

## Quick Test Steps

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to Registration
- Go to registration page
- Fill in all required fields:
  - Name (first + last)
  - **Phone number** (CRITICAL - this is used to link payment)
  - Email
  - Business license number
  - Professions
  - Work regions
  - Experience
  - Accept terms ✓

### 3. Submit Form
- Click "הירשמו כעת" (Register Now)
- Should see: "שולח נתונים..." (Sending data...)
- Webhook sends data to Make.com
- Pre-payment dialog should open

### 4. Proceed to Payment
- Click button to proceed to payment
- Payment dialog opens
- Should see: "טוען מערכת תשלום..." (Loading payment system...)

### 5. Wait for Hosted Fields
- **tranzila-handshake** function called automatically
- Hosted Fields SDK loads
- Should see: "✓ מערכת התשלום מוכנה" (Payment system ready)

### 6. Enter Card Details
Enter test card in the iframe fields:
```
Card Number: 4580000000000000 (Visa test card)
Expiry: 12/25 (or any future date)
CVV: 123
```

### 7. Complete Payment
- Click "שלם ₪413" (Pay 413)
- Should see: "מעבד תשלום..." (Processing payment...)
- Tranzila charges 413 ILS + creates token
- Dialog shows: "תשלום בסך ₪413 בוצע בהצלחה!" (Payment successful!)

### 8. Save Payment Method
- Automatically calls **tranzila-registration-payment** function
- Should see: "שומר פרטי תשלום..." (Saving payment details...)
- Function finds user by phone number
- Encrypts token and saves to DB
- Should see: "ההרשמה והתשלום הושלמו בהצלחה!" (Registration and payment completed!)

---

## What to Check in Database

### After Successful Registration:

#### 1. Check `professionals` table:
```sql
SELECT id, name, phone_number, email, created_at
FROM professionals
WHERE phone_number = '0501234567'
ORDER BY created_at DESC
LIMIT 1;
```

#### 2. Check `payment_methods` table:
```sql
SELECT
  id,
  professional_id,
  card_last4,
  expiry_month,
  expiry_year,
  is_default,
  created_at
FROM payment_methods
WHERE professional_id = 'PROFESSIONAL_ID_FROM_ABOVE'
ORDER BY created_at DESC;
```

**Expected:**
- `card_last4`: "0000" (for test card 4580000000000000)
- `expiry_month`: 12
- `expiry_year`: 2025
- `is_default`: true
- `token_encrypted`: Long encrypted string (IV:AuthTag:Ciphertext)

#### 3. Check `transaction_logs` table:
```sql
SELECT
  action,
  request->>'source' as source,
  request->>'phone_number' as phone,
  request->>'amount' as amount,
  response->>'success' as success,
  response->>'confirmation_code' as confirmation,
  created_at
FROM transaction_logs
WHERE professional_id = 'PROFESSIONAL_ID_FROM_ABOVE'
ORDER BY created_at DESC;
```

**Expected:**
- `action`: "tokenize"
- `source`: "registration"
- `amount`: "413"
- `success`: "true"
- `confirmation_code`: (Tranzila confirmation code)

---

## Browser Console Checks

### Expected Console Logs:

```javascript
// 1. Form submission
"Sending webhook for registration:" {formData}
"Webhook sent successfully"

// 2. Handshake
"Getting handshake token..."
"Handshake token received, terminal: fxpofair001tok"
"Tranzila SDK loaded"
"Tranzila Hosted Fields ready"

// 3. Payment
"Charging registration fee via Tranzila..."
"Tranzila charge result:" {chargeResult}
"Payment method saved successfully:" {data}
```

### Check Network Tab:

**1. send-registration-webhook**
- Status: 200
- Response: `{ success: true }`

**2. tranzila-handshake**
- Status: 200
- Response: `{ success: true, handshakeToken: "...", terminal: "..." }`

**3. tranzila-registration-payment**
- Status: 200
- Response: `{ success: true, payment_method_id: "...", message: "כרטיס נשמר בהצלחה" }`

---

## Common Issues & Solutions

### Issue 1: "משתמש לא נמצא" (User not found)
**Cause:** Make.com webhook didn't create the user
**Fix:**
- Check Make.com webhook logs
- Verify phone number matches exactly (no spaces, same format)
- Check professionals table manually

### Issue 2: "שדות התשלום טרם מוכנים" (Payment fields not ready)
**Cause:** Hosted Fields SDK not loaded
**Fix:**
- Check console for SDK load errors
- Verify handshake returned valid token
- Check Tranzila credentials in Supabase env vars

### Issue 3: "Charge failed"
**Cause:** Tranzila declined the charge
**Fix:**
- Use valid test card: 4580000000000000
- Check Tranzila terminal is active
- Verify terminal password is correct
- Check IP is whitelisted with Tranzila

### Issue 4: "שגיאה בשמירת פרטי התשלום" (Error saving payment)
**Cause:** Database error or encryption issue
**Fix:**
- Check transaction_logs for error details
- Verify ENCRYPTION_KEY is set in Supabase
- Check payment_methods table constraints
- Verify professional_id exists

---

## Test Different Scenarios

### Scenario 1: First Card (Should be Default)
- Register new user
- Pay with card
- Verify `is_default = true` in payment_methods

### Scenario 2: Declined Card
- Use invalid card: 4111111111111111
- Should show error message
- Verify NO entry in payment_methods
- Verify error logged in transaction_logs

### Scenario 3: Duplicate Phone Number
- Try registering with same phone twice
- First should succeed
- Second webhook might fail (depending on Make.com logic)

### Scenario 4: Missing Phone Number
- Try to pay without phone in form
- Should get validation error before payment dialog

---

## Verify Function is Deployed

```bash
# Check function is deployed
supabase functions list

# Should show:
# tranzila-registration-payment (deployed)
```

**Or check in Supabase Dashboard:**
https://supabase.com/dashboard/project/erlfsougrkzbgonumhoa/functions

---

## Test Card Numbers

### Valid Test Cards:
```
Visa:       4580000000000000
MasterCard: 5326740000000000
Diners:     36000000000000
Amex:       373000000000006
```

### Use with:
- **Expiry:** Any future date (MM/YY)
- **CVV:** Any 3 digits (4 for Amex)
- **Name:** Any name

---

## Monitoring in Production

### Supabase Function Logs:
1. Go to: https://supabase.com/dashboard/project/erlfsougrkzbgonumhoa/functions
2. Click on `tranzila-registration-payment`
3. View logs for errors

### Database Queries:
```sql
-- Check recent registrations with payments
SELECT
  p.name,
  p.phone_number,
  p.email,
  pm.card_last4,
  pm.created_at as payment_saved,
  tl.response->>'confirmation_code' as confirmation
FROM professionals p
LEFT JOIN payment_methods pm ON pm.professional_id = p.id
LEFT JOIN transaction_logs tl ON tl.professional_id = p.id AND tl.action = 'tokenize'
WHERE p.created_at > NOW() - INTERVAL '1 day'
ORDER BY p.created_at DESC;
```

---

## Success Criteria

✅ User can complete registration form
✅ Webhook creates professional in DB
✅ Payment dialog opens with Hosted Fields
✅ Card charge succeeds (413 ILS)
✅ Token encrypted and saved to payment_methods
✅ Transaction logged with confirmation code
✅ User sees success message
✅ No errors in console or function logs

---

**Ready to test! 🚀**
