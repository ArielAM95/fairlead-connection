# Tranzila Document API Integration Issue

**Date:** November 1, 2025
**Terminal Name:** [Your Terminal Name]
**Issue:** Document API returns HTML error page instead of creating invoices

---

## Summary

We successfully integrated Tranzila payment processing using the CGI endpoint and Hosted Fields SDK. **Payments work perfectly.** However, when attempting to use the Document API (`tranmode: VK`) to generate tax invoices, we receive an HTML error page instead of a proper API response.

---

## What Works ✅

### 1. Payment Processing (Working Perfectly)
**Endpoint:** `https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi`

**Authentication:**
```
supplier: [Terminal Name]
TranzilaPW: [Terminal Password]
```

**Example Request (Successful):**
```http
POST https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi
Content-Type: application/x-www-form-urlencoded

supplier=[TERMINAL_NAME]&
TranzilaPW=[TERMINAL_PASSWORD]&
TranzilaTK=[ENCRYPTED_TOKEN]&
expdate=0431&
sum=1.00&
currency=1&
tranmode=A&
pdesc=Test%20Payment
```

**Response (Successful):**
```
Response=000&ConfirmationCode=1234567&...
```

✅ **This works perfectly - we can charge cards, tokenize, etc.**

---

## What Doesn't Work ❌

### 2. Document/Invoice Generation (Returns HTML Error)
**Endpoint:** `https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi` (same as payment)

**Authentication:**
```
supplier: [Terminal Name]
TranzilaPW: [Terminal Password]
```

**Example Request (Returns Error):**
```http
POST https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi
Content-Type: application/x-www-form-urlencoded

supplier=[TERMINAL_NAME]&
TranzilaPW=[TERMINAL_PASSWORD]&
tranmode=VK&
sum=1.00&
currency=1&
contact=John%20Doe&
email=john@example.com&
phone=0501234567&
city=Tel%20Aviv&
company=Example%20Ltd&
TaxId=515678901&
doctype=1&
remarks=Registration%20Fee&
item_name_1=Registration%20Fee%20-%20oFair&
item_amount_1=0.85&
item_quantity_1=1&
item_vat_1=18
```

**Expected Response:**
```
Response=000&doc_id=ABC123&pdf_url=https://...&doc_number=12345
```

**Actual Response (HTML Error):**
```html
<html>
<head>
  <title>Tranzila Alert</title>
  <meta name="robots" content="...">
</head>
<body>
  <b>Error Message:</b><br>
  ...
</body>
</html>
```

**Parsed Response Stored in Database:**
```json
{
  "cb": "1514945759\" async></script></body></html>",
  "ns": "1",
  "nbsp;</td><td><font size": "4><br><b>Error Message:<br><font color",
  "<html><head><title>Tranzila Alert</title><meta name": "\"robots\" content",
  "nbsp;</td></td></tr></table></tr></td></table><script type": "\"text/javascript\" src"
}
```

❌ **This returns HTML instead of proper key=value response**

---

## Implementation Details

### Our Complete Flow

1. **User completes payment** (using Hosted Fields SDK + `tranmode: A`)
   - ✅ Payment successful
   - ✅ Token saved
   - ✅ Transaction logged

2. **System attempts to create invoice** (immediately after payment)
   - Calls our edge function: `tranzila-create-invoice`
   - Edge function calls Tranzila with `tranmode: VK`
   - ❌ Receives HTML error instead of invoice

3. **Payment completes successfully** (non-blocking)
   - Invoice failure is logged but doesn't affect payment
   - User's payment goes through
   - Failed invoice saved to database for retry

### Parameters We Send for Document Creation

**Based on Tranzila Documentation URL:** https://docs.tranzila.com/docs/invoices/27ffheryfv066-create-document

```javascript
// Authentication
supplier: terminalName,          // Your terminal name
TranzilaPW: terminalPassword,    // Your terminal password

// Transaction
tranmode: 'VK',                  // Create document (as per docs)
sum: '1.00',                     // Total amount (after VAT)
currency: '1',                   // ILS

// Customer Details
contact: 'John Doe',             // Professional name
email: 'john@example.com',       // Email
phone: '0501234567',             // Israeli phone
city: 'Tel Aviv',                // City
company: 'Example Company Ltd',  // Company name
TaxId: '515678901',              // Business license number (9 digits)

// Invoice Details
doctype: '1',                    // Tax Invoice (חשבונית מס)
remarks: 'Registration Fee - oFair',

// Line Items
item_name_1: 'Registration Fee - oFair - John Doe',
item_amount_1: '0.85',          // Amount before VAT
item_quantity_1: '1',
item_vat_1: '18'                // 18% Israeli VAT
```

### Calculation Example (for 1 ILS payment):
```
Total Amount (what customer paid): 1.00 ILS
Amount Before VAT: 1.00 / 1.18 = 0.85 ILS
VAT Amount (18%): 1.00 - 0.85 = 0.15 ILS
```

---

## Questions for Tranzila Support

1. **Is the Document API enabled on our terminal?**
   - Terminal Name: [YOUR_TERMINAL_NAME]
   - We can successfully process payments but document creation returns HTML

2. **Are we using the correct endpoint?**
   - Currently using: `https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi`
   - Should we use a different endpoint for document creation?

3. **Are the parameters correct?**
   - We're using `TranzilaPW` for authentication (works for payments)
   - Should document creation use different authentication?

4. **Are there additional requirements?**
   - Do we need to request specific permissions for document generation?
   - Are there IP whitelisting requirements different from payment API?

5. **Is `tranmode: VK` the correct mode for creating tax invoices?**
   - We want to generate: חשבונית מס (Tax Invoice)
   - Document type: `doctype: 1`

---

## Technical Environment

**Integration Type:** Server-to-Server (Supabase Edge Functions)
**Runtime:** Deno (JavaScript)
**Region:** EU-Central-1 (Frankfurt)
**Payment Integration:** ✅ Working (Hosted Fields + Token Charges)
**Document Integration:** ❌ Not Working (HTML Error)

**Code Reference:**
```typescript
// This works (Payment)
const paymentResponse = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    supplier: terminalName,
    TranzilaPW: terminalPassword,
    TranzilaTK: token,
    sum: '1.00',
    currency: '1',
    tranmode: 'A'
  })
});
// Returns: Response=000&ConfirmationCode=...

// This fails (Document)
const docResponse = await fetch('https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    supplier: terminalName,
    TranzilaPW: terminalPassword,
    tranmode: 'VK',
    sum: '1.00',
    currency: '1',
    doctype: '1',
    contact: 'John Doe',
    TaxId: '515678901',
    // ... other params
  })
});
// Returns: <html><title>Tranzila Alert</title>...
```

---

## What We Need

1. **Confirmation that Document API is enabled** on our terminal
2. **Correct endpoint URL** for document creation (if different from payment endpoint)
3. **Any additional setup required** (permissions, whitelisting, etc.)
4. **Documentation** on the exact parameters and format for `tranmode: VK`

---

## Current Workaround

We've implemented the invoice generation as **non-blocking**:
- Payment processing continues successfully
- Failed invoice attempts are logged for debugging
- We can retry invoice generation manually
- When Document API is enabled, invoices will start working automatically with zero code changes

**Our system is ready** - we just need the Document API feature activated on our terminal.

---

## Contact Information

**Company:** oFair
**Email:** [Your Email]
**Phone:** [Your Phone]
**Terminal:** [Your Terminal Name]

**Technical Contact:** [Your Name]
**Integration Type:** Supabase Edge Functions (Server-to-Server)

---

## Appendix: Full Request Example

### Document Creation Request (URL-encoded)
```
supplier=YOUR_TERMINAL&
TranzilaPW=YOUR_PASSWORD&
tranmode=VK&
sum=1.00&
currency=1&
contact=איציק%20עזרא&
email=itzik%40example.com&
phone=0533332543&
city=תל%20אביב&
company=איציק%20חשמל%20בע%22מ&
TaxId=515678901&
doctype=1&
remarks=דמי%20הרשמה%20-%20oFair%20-%20איציק%20עזרא&
item_name_1=דמי%20הרשמה%20-%20oFair%20-%20איציק%20עזרא&
item_amount_1=0.85&
item_quantity_1=1&
item_vat_1=18
```

### Expected Response Format
```
Response=000&
doc_id=ABC123&
doc_number=INV-2025-001&
pdf_url=https://secure5.tranzila.com/invoices/download?doc_id=ABC123&terminal=YOUR_TERMINAL
```

---

**Thank you for your assistance!**
