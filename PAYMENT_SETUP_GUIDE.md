# 💳 Hybrid Payment System - Setup Guide

## 🎯 Overview

Your Aquatic Avenue e-commerce site now supports **two payment methods**:

### 1. Credit/Debit Cards (via Shopify)
- ✅ Secure Shopify Checkout
- ✅ PCI DSS Compliant
- ✅ Visa, Mastercard, Amex
- ✅ Professional checkout experience
- ✅ Automatic order management

### 2. PayNow QR (Singapore)
- ✅ Instant bank transfer
- ✅ All Singapore banks (DBS, OCBC, UOB, etc.)
- ✅ QR code generation
- ✅ Manual order confirmation
- ✅ No transaction fees from payment gateway

---

## 📋 Setup Steps

### Step 1: Install QR Code Library

Run this command in your project directory:

```bash
npm install qrcode @types/qrcode --save
```

### Step 2: Update Your Business UEN

Open `src/paynow.service.ts` and update line 10:

```typescript
private readonly uen = '202012345K'; // Replace with YOUR actual UEN
```

**Where to find your UEN:**
- Check your ACRA business registration
- Found on your business documents
- Format: 9 digits + letter (e.g., 202012345K)

### Step 3: Update Entity Name (Optional)

In the same file, line 11:

```typescript
private readonly entityName = 'AQUATIC AVENUE'; // Your business name
```

This appears on the customer's banking app when they scan the QR code.

### Step 4: Test the Integration

1. **Start your development server:**
   ```bash
   npm run copy:assets
   npm run start:dev
   ```

2. **Test the flow:**
   - Add items to cart
   - Click "Proceed to Payment"
   - Choose payment method:
     - **Credit Card** → Redirects to Shopify
     - **PayNow** → Shows QR code

3. **Test PayNow QR:**
   - Scan with your banking app
   - Verify amount and reference appear correctly
   - Complete test payment (small amount)

---

## 🔄 Payment Flow

### Credit Card Flow (Shopify):
```
Cart → Payment Selection → Shopify Checkout → Payment → Shopify handles everything
```

### PayNow Flow:
```
Cart → Payment Selection → PayNow QR Page → Customer scans & pays → Manual verification → Confirm order
```

---

## 💰 Cost Comparison

| Payment Method | Transaction Fee | Setup Fee | Monthly Fee |
|----------------|----------------|-----------|-------------|
| **Shopify Payments** | 2.9% + $0.30 | $0 | Included in Shopify plan |
| **PayNow (Manual)** | $0 | $0 | $0 |

**Recommendation:** 
- Use Shopify for international customers and those who prefer cards
- Use PayNow for Singapore customers to save on fees

---

## 🔧 Customization

### Change QR Code Size

In `src/paynow.service.ts`, line 23:

```typescript
const qrCodeDataUrl = await QRCode.toDataURL(payNowString, {
  errorCorrectionLevel: 'M',
  type: 'image/png',
  width: 400, // Change this (default: 400px)
  margin: 2,
});
```

### Change Order Reference Format

In `src/paynow.service.ts`, line 103:

```typescript
generateOrderReference(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `AA${timestamp}${random}`; // Customize format here
}
```

### Update Payment Instructions

Edit `views/paynow-payment.hbs` to customize:
- Instructions text
- Help information
- Contact details

---

## 📱 PayNow QR Code Format

The QR code follows **EMVCo specification** and includes:
- ✅ PayNow identifier
- ✅ Your UEN
- ✅ Transaction amount
- ✅ Order reference
- ✅ Business name
- ✅ CRC checksum

When customers scan:
- Banking app opens automatically
- Amount is pre-filled
- Reference number is included
- They just need to confirm

---

## 🔒 Security

### Shopify Checkout:
- ✅ PCI DSS Level 1 compliant
- ✅ 3D Secure authentication
- ✅ Fraud detection
- ✅ SSL encryption

### PayNow:
- ✅ Bank-level security
- ✅ No card details needed
- ✅ Direct bank transfer
- ✅ Reference number tracking

---

## 📊 Order Management

### For Shopify Payments:
- Orders automatically created in Shopify
- Email confirmations sent automatically
- Inventory updated automatically
- Fulfillment tracking built-in

### For PayNow Payments:
You need to **manually verify** and process:

1. **Customer completes PayNow transfer**
2. **Check your bank account** for incoming transfer
3. **Match reference number** with order
4. **Send confirmation email** to customer
5. **Process and ship order**

**Recommended workflow:**
- Check bank account daily
- Keep spreadsheet of PayNow orders
- Send confirmation within 24 hours
- Consider automating with bank API (advanced)

---

## 🎨 Design Features

### Payment Selection Page:
- 🌊 Underwater aquarium theme
- 💳 Side-by-side payment options
- 📱 Mobile responsive
- ✨ Hover animations
- 🎯 Clear CTAs

### PayNow Page:
- 📱 Large, scannable QR code
- 💰 Prominent amount display
- 📋 Step-by-step instructions
- ⚠️ Important notices
- 🔄 Easy navigation

### Success Page:
- ✅ Animated checkmark
- 📧 What's next information
- 🔗 Continue shopping CTA
- 📞 Contact information

---

## 🐛 Troubleshooting

### QR Code Not Generating?

**Error: "Failed to generate PayNow QR code"**

1. Check if `qrcode` package is installed:
   ```bash
   npm list qrcode
   ```

2. Reinstall if needed:
   ```bash
   npm install qrcode @types/qrcode --save
   ```

3. Check UEN format (must be valid Singapore UEN)

### QR Code Scans But Shows Wrong Amount?

- Check `calculateTotal()` function in payment-selection.hbs
- Verify price format in cart items
- Ensure amount is passed correctly to PayNow page

### Shopify Checkout Not Working?

- Verify Shopify credentials in `.env`
- Check `shopify.service.ts` createCheckout method
- Ensure products have valid Shopify variant IDs

---

## 📝 Files Created/Modified

### Created:
- ✅ `src/paynow.service.ts` - PayNow QR generation
- ✅ `views/payment-selection.hbs` - Payment method selection
- ✅ `views/paynow-payment.hbs` - PayNow QR page
- ✅ `views/payment-success.hbs` - Success page

### Modified:
- ✅ `src/app.controller.ts` - Added payment routes
- ✅ `src/app.module.ts` - Added PayNowService
- ✅ `views/cart.hbs` - Updated checkout button

---

## 🚀 Going Live Checklist

Before accepting real payments:

- [ ] Update UEN in `paynow.service.ts`
- [ ] Update business name
- [ ] Test Shopify checkout with real products
- [ ] Test PayNow QR with small amount
- [ ] Verify QR code scans correctly
- [ ] Set up order tracking system
- [ ] Prepare email templates
- [ ] Train staff on PayNow verification
- [ ] Add terms & conditions
- [ ] Add refund policy

---

## 💡 Future Enhancements

### Recommended Additions:

1. **Email Notifications**
   - Order confirmation emails
   - Payment received notifications
   - Shipping updates

2. **Order Database**
   - Store orders in database
   - Track payment status
   - Generate invoices

3. **Admin Dashboard**
   - View pending PayNow payments
   - Mark orders as verified
   - Export order reports

4. **Bank API Integration** (Advanced)
   - Automatic payment verification
   - Real-time status updates
   - Reduce manual work

5. **SMS Notifications**
   - Send order confirmation via SMS
   - Payment reminders
   - Delivery updates

---

## 📞 Support

### PayNow Issues:
- Contact your bank for PayNow support
- Verify UEN is registered for PayNow

### Shopify Issues:
- Shopify Support: https://help.shopify.com/
- Check Shopify API status

### Technical Issues:
- Review server logs in Vercel
- Check browser console for errors
- Test in incognito mode

---

## ✅ Summary

You now have a **hybrid payment system** that offers:
- 🌍 **International payments** via Shopify (cards)
- 🇸🇬 **Local payments** via PayNow (bank transfer)
- 💰 **Cost savings** on Singapore transactions
- 🎨 **Beautiful UI** with underwater theme
- 📱 **Mobile-friendly** checkout experience
- 🔒 **Secure** payment processing

**Ready to accept payments!** 🎉

---

## 📚 Additional Resources

- [PayNow Technical Specifications](https://www.abs.org.sg/docs/library/paynow-specifications)
- [Shopify Checkout API](https://shopify.dev/docs/api/storefront/latest/mutations/checkoutCreate)
- [EMVCo QR Code Specification](https://www.emvco.com/emv-technologies/qrcodes/)
- [Singapore UEN Format](https://www.uen.gov.sg/)

---

**Questions?** Check the troubleshooting section or contact hello@aquaticavenue.com
