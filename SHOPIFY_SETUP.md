# Shopify Integration Setup Guide

## Overview
This app uses Shopify's Storefront API to create checkout sessions. When users click "Checkout", they're redirected to Shopify's hosted checkout page.

## Prerequisites
- A Shopify store (any plan with API access)
- Products created in your Shopify store

## Step 1: Create a Shopify App

1. Go to your Shopify Admin: `https://your-store.myshopify.com/admin`
2. Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app**
4. Name it (e.g., "Aquatic Avenue Storefront")
5. Click **Create app**

## Step 2: Configure API Scopes

1. Click **Configure Storefront API scopes**
2. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
3. Click **Save**

## Step 3: Get Your Credentials

1. Click **API credentials** tab
2. Under **Storefront API access token**, click **Install app** (if not already installed)
3. Copy the **Storefront API access token**
4. Note your shop domain (e.g., `your-store.myshopify.com`)

## Step 4: Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Add your credentials:
   ```
   SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token-here
   ```

## Step 5: Map Products to Shopify Variant IDs

You need to update your products in `src/app.controller.ts` to include Shopify variant IDs:

### How to find Variant IDs:

1. Go to Shopify Admin → **Products**
2. Click on a product
3. Scroll to **Variants** section
4. Click on a variant
5. Look at the URL: `https://your-store.myshopify.com/admin/products/PRODUCT_ID/variants/VARIANT_ID`
6. Copy the `VARIANT_ID`

### Update your products array:

```typescript
private products = [
  {
    id: 1,
    name: "Oriental TC - Micranthemum 'Monte Carlo'",
    price: "$10.00 SGD",
    image: "product1.jpg",
    shopifyVariantId: "12345678901234", // Add this
    description: "..."
  },
  // ... other products
];
```

### Update ShopifyService:

In `src/shopify.service.ts`, update the line:
```typescript
variantId: `gid://shopify/ProductVariant/${item.id}`,
```

To use the actual Shopify variant ID:
```typescript
variantId: `gid://shopify/ProductVariant/${item.shopifyVariantId}`,
```

## Step 6: Test the Integration

1. Restart your server:
   ```bash
   npm run start:dev
   ```

2. Add a product to cart
3. Click "Check out" in the modal
4. You should be redirected to Shopify's checkout page

## Troubleshooting

### "Unable to create checkout"
- Check that your `.env` file has the correct credentials
- Verify the Storefront API token is active in Shopify Admin
- Check server console for error messages

### Products not appearing in checkout
- Ensure products are published to your sales channel
- Verify variant IDs are correct
- Check that products have inventory available

### Checkout URL redirects to cart
- This is the fallback behavior when Shopify credentials are missing
- Check that environment variables are loaded correctly

## Current Behavior (Without Credentials)

If Shopify credentials are not configured, the checkout button will redirect users to the `/cart` page as a fallback. This allows you to test the app without Shopify integration.

## Next Steps

Once integrated, you can:
- Customize the checkout experience in Shopify Admin
- Add discount codes
- Configure shipping rates
- Set up payment gateways (Stripe, PayPal, etc.)
- Track orders in Shopify Admin
- Use Shopify's email notifications

## Additional Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Checkout API Reference](https://shopify.dev/docs/api/storefront/latest/mutations/checkoutCreate)
- [Shopify App Development](https://shopify.dev/docs/apps)
