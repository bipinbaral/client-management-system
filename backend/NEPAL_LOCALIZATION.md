# Nepal Localization Changes 🇳🇵

## ✅ Changes Made

### 1. Phone Number Validation
**Updated to Nepal-specific format:**
- ✅ Exactly **10 digits**
- ✅ Must start with **97** or **98** (Nepal mobile prefixes)
- ✅ No spaces or special characters

**Valid Examples:**
- ✅ `9801234567` (Ncell)
- ✅ `9841234567` (Ncell)
- ✅ `9851234567` (Ncell)
- ✅ `9741234567` (Nepal Telecom)
- ✅ `9761234567` (Nepal Telecom)
- ✅ `9801234567` (Smart Cell)

**Invalid Examples:**
- ❌ `980123456` (only 9 digits)
- ❌ `98012345678` (11 digits)
- ❌ `9601234567` (doesn't start with 97/98)
- ❌ `+977-9801234567` (has country code/special chars)

---

### 2. Email Validation
**Enhanced RFC 5322 compliant:**
- ✅ Standard email format
- ✅ Supports all domains (.com, .np, .edu.np, etc.)

**Valid Examples:**
- ✅ `user@example.com`
- ✅ `name@company.com.np`
- ✅ `info@gmail.com`

---

### 3. Currency Changed to NPR (Rs.)

**Payment Model Updates:**
- Default currency: **NPR** (Nepali Rupees)
- Currency symbol: **Rs.**
- Supported currencies: NPR, USD, EUR, GBP, INR, AUD, CAD

**Before:**
```json
{
  "amount": 100,
  "currency": "USD"  // Default was USD
}
```

**After:**
```json
{
  "amount": 5000,
  "currency": "NPR"  // Default is now NPR
}
```

---

### 4. Country Codes API

**New Endpoint:** `GET /api/countries`

Returns list of 40+ countries with:
- Country name
- Phone code (e.g., +977 for Nepal)
- Currency (e.g., NPR)
- Currency symbol (e.g., Rs.)

**Response Example:**
```json
{
  "success": true,
  "count": 40,
  "data": [
    {
      "country": "Nepal",
      "code": "+977",
      "currency": "NPR",
      "symbol": "Rs."
    },
    {
      "country": "India",
      "code": "+91",
      "currency": "INR",
      "symbol": "₹"
    },
    ...
  ]
}
```

**Get Single Country:**
```
GET /api/countries/code/+977
```

---

## 📱 Nepal Mobile Operators

| Operator | Prefix | Example |
|----------|--------|---------|
| **Ncell** | 980, 981, 982, 984, 985, 986 | 9801234567 |
| **Nepal Telecom (Ntc)** | 974, 975, 976 | 9741234567 |
| **Smart Cell** | 988, 989 | 9881234567 |

---

## 💰 Currency Formatting

**Helper Function Available:**
```javascript
const { formatCurrency } = require('./utils/countryCodes');

formatCurrency(5000, 'NPR');  // Returns: "Rs. 5,000"
formatCurrency(1500, 'NPR');  // Returns: "Rs. 1,500"
```

---

## 🧪 Testing

### Test Phone Validation
```bash
POST /api/clients
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9801234567"  // ✅ Valid Nepal number
}
```

### Test Invalid Phone
```bash
POST /api/clients
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9601234567"  // ❌ Invalid - doesn't start with 97/98
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "Please provide a valid Nepal phone number (10 digits starting with 97 or 98)",
      "value": "9601234567"
    }
  ]
}
```

---

## 📊 Payment Examples with NPR

### Create Payment in Nepali Rupees
```json
POST /api/payments
{
  "client": "client_id_here",
  "amount": 5000,          // Rs. 5,000
  "currency": "NPR",       // Nepali Rupees (default)
  "paymentMethod": "Cash",
  "subscriptionType": "Monthly",
  "dueDate": "2026-03-01",
  "discount": 10           // 10% discount
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "amount": 5000,
    "currency": "NPR",
    "finalAmount": 4500,     // After 10% discount
    "discountAmount": 500,
    "invoiceNumber": "INV-202602-1234"
  }
}
```

---

## 🌍 Available Countries

The API now includes 40+ countries:

**SAARC Countries:**
- 🇳🇵 Nepal (+977, NPR, Rs.)
- 🇮🇳 India (+91, INR, ₹)
- 🇵🇰 Pakistan (+92, PKR, ₨)
- 🇧🇩 Bangladesh (+880, BDT, ৳)
- 🇱🇰 Sri Lanka (+94, LKR, Rs.)

**Other Major Countries:**
- 🇺🇸 United States (+1, USD, $)
- 🇬🇧 United Kingdom (+44, GBP, £)
- 🇨🇳 China (+86, CNY, ¥)
- 🇯🇵 Japan (+81, JPY, ¥)
- 🇦🇺 Australia (+61, AUD, A$)
- And 30+ more...

---

## 🔄 Migration Guide

### For Existing Data

If you have existing clients/payments with USD:
1. Update currency field from 'USD' to 'NPR'
2. Convert amounts (1 USD ≈ 134 NPR as of 2024)
3. All new records will default to NPR

### For Frontend

Update your UI to:
1. Show **Rs.** instead of **$**
2. Use Nepal phone number format (10 digits)
3. Fetch countries from `/api/countries`
4. Add country code dropdown

---

## ✅ Files Modified

1. **validator.js** - Updated phone & email validation
2. **Payment.js** - Changed default currency to NPR
3. **countryCodes.js** - NEW: Country codes utility
4. **countryRoutes.js** - NEW: Country API endpoints
5. **server.js** - Registered country routes

---

## 🚀 New Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/countries` | GET | Get all countries with codes |
| `/api/countries/code/:code` | GET | Get country by phone code |

---

**All changes are backward compatible! Existing data with USD will still work.** 🎉
