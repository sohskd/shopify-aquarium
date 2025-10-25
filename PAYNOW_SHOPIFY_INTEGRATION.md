# 📦 PayNow → Shopify Integration Guide

## ✅ What's Been Implemented

Your PayNow payments now automatically create draft orders in Shopify!

---

## 🎯 How It Works

### Customer Flow:
```
1. Customer adds items to cart
   ↓
2. Proceeds to checkout
   ↓
3. Selects "PayNow" payment method
   ↓
4. Scans QR code and completes payment
   ↓
5. Clicks "I've Completed Payment"
   ↓
6. System creates draft order in Shopify ✅
   ↓
7. Customer sees success page
   ↓
8. You receive order in Shopify Admin
```

### What Happens in Shopify:
- ✅ **Draft Order Created** - Order appears in Shopify Admin
- ✅ **Tagged as "paynow, pending-payment"** - Easy to filter
- ✅ **Reference Number Included** - In order notes
- ✅ **Customer Info Saved** - Email and name
- ✅ **Line Items Added** - All products from cart

---

## 🔧 Setup Instructions

### Step 1: Get Shopify Admin API Token

1. **Go to Shopify Admin**
2. **Navigate to:** Settings → Apps and sales channels
3. **Click:** "Develop apps"
4. **Click:** "Create an app"
5. **Name it:** "Aquatic Avenue Backend"
6. **Click:** "Configure Admin API scopes"

### Step 2: Enable Required Scopes

Check these permissions:
- ✅ `write_draft_orders` - Create draft orders
- ✅ `read_draft_orders` - Read draft orders
- ✅ `write_customers` - Create customer records
- ✅ `read_customers` - Read customer info
- ✅ `read_products` - Read product data

### Step 3: Install the App

1. **Click:** "Install app"
2. **Copy the Admin API access token** (shown once!)
3. **Save it securely**

### Step 4: Add to Environment Variables

Update your `.env` file:

```bash
# Existing
SHOPIFY_SHOP_DOMAIN=real-blue-aquarium.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-storefront-token

# NEW - Add this
SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Restart Your Server

```bash
npm run start:dev
```

### Step 6: Test It!

1. Add items to cart
2. Go to checkout
3. Select PayNow
4. Click "I've Completed Payment"
5. Check Shopify Admin → Orders → Drafts

---

## 📊 What You'll See in Shopify

### Draft Order Details:

**Order Information:**
- **Status:** Draft (unpaid)
- **Tags:** `paynow`, `pending-payment`
- **Note:** "PayNow Payment - Reference: AA-1234567890"

**Customer Information:**
- **Name:** PayNow Customer (or actual name if collected)
- **Email:** customer@example.com (or actual email)

**Line Items:**
- All products from cart
- Correct quantities
- Correct prices

**Next Steps for You:**
1. Customer sends you payment proof
2. You verify the PayNow transfer
3. Mark draft order as paid
4. Complete the order
5. Ship to customer

---

## 🔄 Order Management Workflow

### When Customer Completes PayNow:

**Automatic:**
1. ✅ Draft order created in Shopify
2. ✅ Tagged as "paynow, pending-payment"
3. ✅ Reference number saved
4. ✅ Cart cleared

**Manual (You do this):**
1. Check your bank for PayNow transfer
2. Match reference number
3. In Shopify: Open draft order
4. Click "Mark as paid"
5. Complete and fulfill order

---

## 🎨 Customization Options

### Collect Customer Email

Update `views/paynow-payment.hbs` to add an email form:

```html
<!-- Add before QR code -->
<div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
        Email Address (for order confirmation)
    </label>
    <input type="email" id="customerEmail" 
           class="w-full px-4 py-2 border rounded-lg"
           placeholder="your@email.com" required>
</div>
```

Then update the JavaScript:

```javascript
customerInfo: {
    reference: reference,
    email: document.getElementById('customerEmail').value,
    firstName: 'PayNow',
    lastName: 'Customer',
}
```

### Add Shipping Address

Extend the form to collect:
- Name
- Phone
- Address
- Postal code

Then pass to `customerInfo` object.

---

## 🔍 Troubleshooting

### Issue: Orders Not Appearing in Shopify

**Check:**
1. Admin API token is correct
2. Token has `write_draft_orders` scope
3. Server logs for errors
4. Network tab in browser console

**Solution:**
```bash
# Check server logs
npm run start:dev

# Look for:
[Shopify] Creating draft order: {...}
[Shopify] Draft order created: 123456789
```

### Issue: "Admin API token not configured"

**Cause:** `SHOPIFY_ADMIN_TOKEN` not in `.env`

**Solution:**
1. Add token to `.env` file
2. Restart server
3. Try again

### Issue: "Insufficient permissions"

**Cause:** App doesn't have required scopes

**Solution:**
1. Go to Shopify Admin → Apps
2. Edit your app
3. Add `write_draft_orders` scope
4. Reinstall app
5. Get new token

---

## 📱 Testing Checklist

Before going live:

- [ ] Admin API token configured
- [ ] Test order creation works
- [ ] Draft order appears in Shopify
- [ ] Reference number is correct
- [ ] Line items are correct
- [ ] Customer info is saved
- [ ] Tags are applied
- [ ] Can mark as paid
- [ ] Can fulfill order

---

## 🚀 Production Deployment

### Vercel Environment Variables

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to:** Settings → Environment Variables
4. **Add:**
   ```
   SHOPIFY_ADMIN_TOKEN = shpat_xxxxxxxxxxxxx
   ```
5. **Redeploy**

---

## 📊 Monitoring Orders

### Filter PayNow Orders:

In Shopify Admin:
1. Go to Orders → Drafts
2. Filter by tag: `paynow`
3. Or filter by tag: `pending-payment`

### Bulk Actions:

You can:
- Mark multiple as paid
- Add notes
- Export to CSV
- Send invoices

---

## 💡 Best Practices

### Do:
✅ Verify PayNow transfer before marking as paid
✅ Keep reference numbers in order notes
✅ Tag orders consistently
✅ Send confirmation emails
✅ Update order status promptly

### Don't:
❌ Mark as paid without verifying transfer
❌ Delete draft orders (archive instead)
❌ Forget to fulfill after payment
❌ Lose reference numbers

---

## 🔐 Security Notes

### API Token Safety:
- ✅ Never commit tokens to git
- ✅ Use environment variables
- ✅ Rotate tokens periodically
- ✅ Limit token scopes

### Order Verification:
- ✅ Always verify PayNow transfer
- ✅ Match reference numbers
- ✅ Check amounts match
- ✅ Confirm with customer if unsure

---

## 📧 Customer Communication

### After Order Created:

**Automatic:**
- Success page shown
- Cart cleared

**Manual (Recommended):**
- Send confirmation email
- Include reference number
- Provide payment instructions
- Give estimated processing time

### After Payment Verified:

**Send email with:**
- Payment confirmed
- Order number
- Estimated delivery
- Tracking info (when shipped)

---

## 🎯 Summary

Your PayNow integration now:

- ✅ **Creates orders in Shopify** - Automatic draft orders
- ✅ **Saves customer info** - Email and name
- ✅ **Includes reference numbers** - Easy tracking
- ✅ **Tags orders** - Easy filtering
- ✅ **Preserves line items** - All products included
- ✅ **Production ready** - Secure and reliable

**Next Steps:**
1. Add Admin API token to `.env`
2. Restart server
3. Test with a real order
4. Deploy to production
5. Start receiving PayNow orders!

---

## 📞 Support

Need help?
- Check server logs: `npm run start:dev`
- Check browser console: F12 → Console
- Check Shopify Admin: Orders → Drafts
- Email: hello@aquaticavenue.com

---

## ✅ Quick Start

```bash
# 1. Add Admin API token to .env
echo "SHOPIFY_ADMIN_TOKEN=shpat_xxxxx" >> .env

# 2. Restart server
npm run start:dev

# 3. Test it
# - Add items to cart
# - Go to checkout
# - Select PayNow
# - Click "I've Completed Payment"
# - Check Shopify Admin

# 4. Deploy to production
git add .
git commit -m "Add PayNow Shopify integration"
git push origin main
```

**Your PayNow orders will now appear in Shopify!** 🎉
