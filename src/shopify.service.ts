import { Injectable } from '@nestjs/common';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable()
export class ShopifyService {
  private readonly storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN || '';
  private readonly shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || '';

  async createCheckout(cartItems: CartItem[]): Promise<string> {
    // For now, return a placeholder URL
    // TODO: Replace with actual Shopify Storefront API call once you have credentials
    
    if (!this.storefrontAccessToken || !this.shopDomain) {
      console.warn('Shopify credentials not configured. Using placeholder checkout.');
      return '/cart'; // Fallback to cart page
    }

    try {
      const query = `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
          checkoutCreate(input: $input) {
            checkout {
              id
              webUrl
            }
            checkoutUserErrors {
              code
              field
              message
            }
          }
        }
      `;

      // Map cart items to Shopify line items
      // Note: You'll need to add shopifyVariantId to your products
      const lineItems = cartItems.map(item => ({
        variantId: `gid://shopify/ProductVariant/${item.id}`, // Placeholder - replace with actual Shopify variant IDs
        quantity: item.quantity,
      }));

      const variables = {
        input: {
          lineItems,
        },
      };

      const response = await fetch(
        `https://${this.shopDomain}/api/2024-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
          },
          body: JSON.stringify({ query, variables }),
        }
      );

      const result = await response.json();

      if (result.data?.checkoutCreate?.checkout?.webUrl) {
        return result.data.checkoutCreate.checkout.webUrl;
      }

      throw new Error('Failed to create checkout');
    } catch (error) {
      console.error('Shopify checkout error:', error);
      return '/cart'; // Fallback to cart page on error
    }
  }
}
