import { Injectable } from '@nestjs/common';

interface CartItem {
  id: number;
  name: string;
  price: number; // numeric (without currency)
  image: string;
  quantity: number;
  shopifyVariantId?: string; // required for Shopify checkout
}

@Injectable()
export class ShopifyService {
  private readonly storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN || '';
  private readonly adminAccessToken = process.env.SHOPIFY_ADMIN_TOKEN || '';
  private readonly shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || '';

  constructor() {
    console.log('[Shopify] Environment check:', {
      hasToken: !!this.storefrontAccessToken,
      hasAdminToken: !!this.adminAccessToken,
      hasDomain: !!this.shopDomain,
      domain: this.shopDomain || 'NOT SET',
      tokenLength: this.storefrontAccessToken?.length || 0
    });
  }

  private async storefront<T>(query: string, variables?: Record<string, any>): Promise<T> {
    if (!this.storefrontAccessToken || !this.shopDomain) {
      throw new Error('Shopify credentials are not configured');
    }
    const res = await fetch(`https://${this.shopDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json as T;
  }

  // Fetch all products from Shopify
  async getAllProducts() {
    const query = `
      query GetAllProducts {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.storefront<any>(query);
      const products = data?.data?.products?.edges || [];
      
      return products.map((edge: any, index: number) => {
        const node = edge.node;
        const variant = node.variants?.edges?.[0]?.node;
        const image = node.images?.edges?.[0]?.node;
        
        // Extract numeric ID from Shopify GID format
        const variantId = variant?.id ? variant.id.split('/').pop() : '';
        
        return {
          id: index + 1,
          name: node.title,
          price: variant?.price 
            ? `$${parseFloat(variant.price.amount).toFixed(2)} ${variant.price.currencyCode}`
            : '$0.00 SGD',
          image: image?.url || '',
          shopifyVariantId: variantId,
          description: node.description || '',
          handle: node.handle,
          availableForSale: variant?.availableForSale ?? false,
        };
      });
    } catch (error) {
      console.error('[Shopify] Error fetching products:', error);
      return [];
    }
  }

  // Fetch a product and its variants by product handle
  async getProductVariantsByHandle(handle: string) {
    const query = `
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          images(first: 1) { edges { node { url altText } } }
          variants(first: 100) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price { amount currencyCode }
                image { url altText }
              }
            }
          }
        }
      }
    `;

    const data = await this.storefront<any>(query, { handle });
    const product = data?.data?.product;
    if (!product) return null;
    const variants = (product.variants?.edges || []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      sku: e.node.sku,
      available: e.node.availableForSale,
      price: e.node.price?.amount,
      currency: e.node.price?.currencyCode,
      image: e.node.image?.url,
    }));
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.images?.edges?.[0]?.node?.url || null,
      variants,
    };
  }

  // Create a draft order in Shopify (for PayNow payments)
  async createDraftOrder(items: CartItem[], customerInfo: any) {
    if (!this.adminAccessToken) {
      console.error('[Shopify] Admin API token not configured');
      return null;
    }

    try {
      const lineItems = items.map(item => ({
        variant_id: item.shopifyVariantId,
        quantity: item.quantity,
      }));

      const draftOrder = {
        draft_order: {
          line_items: lineItems,
          customer: {
            email: customerInfo.email || 'customer@example.com',
            first_name: customerInfo.firstName || 'Customer',
            last_name: customerInfo.lastName || '',
          },
          note: `PayNow Payment - Reference: ${customerInfo.reference || 'N/A'}`,
          tags: 'paynow, pending-payment',
          email: customerInfo.email || 'customer@example.com',
        }
      };

      console.log('[Shopify] Creating draft order:', JSON.stringify(draftOrder, null, 2));

      const response = await fetch(
        `https://${this.shopDomain}/admin/api/2024-01/draft_orders.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.adminAccessToken,
          },
          body: JSON.stringify(draftOrder),
        }
      );

      const result = await response.json();
      
      if (response.ok && result.draft_order) {
        console.log('[Shopify] Draft order created:', result.draft_order.id);
        return {
          success: true,
          orderId: result.draft_order.id,
          orderNumber: result.draft_order.name,
          invoiceUrl: result.draft_order.invoice_url,
        };
      } else {
        console.error('[Shopify] Failed to create draft order:', result);
        return { success: false, error: result.errors || 'Unknown error' };
      }
    } catch (error) {
      console.error('[Shopify] Error creating draft order:', error);
      return { success: false, error: error.message };
    }
  }
}
