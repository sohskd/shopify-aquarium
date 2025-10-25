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
  private readonly shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || '';

  constructor() {
    console.log('[Shopify] Environment check:', {
      hasToken: !!this.storefrontAccessToken,
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

  async createCheckout(cartItems: CartItem[]): Promise<string> {
    // Fallback if not configured
    if (!this.storefrontAccessToken || !this.shopDomain) {
      console.warn('[Shopify] Missing credentials. Returning cart fallback.');
      return '/cart';
    }

    // Filter only items that have a mapped Shopify variant id
    const lines = (cartItems || [])
      .filter((i) => !!i.shopifyVariantId && i.quantity > 0)
      .map((i) => ({
        merchandiseId: `gid://shopify/ProductVariant/${i.shopifyVariantId}`,
        quantity: i.quantity,
      }));

    if (!lines.length) {
      console.warn('[Shopify] No items with shopifyVariantId found in cart.');
      return '/cart';
    }

    // Use the newer cartCreate mutation (checkoutCreate is deprecated)
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Get the base URL from environment or use localhost for development
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    const variables = { 
      input: { 
        lines: lines,
        buyerIdentity: {
          countryCode: 'SG'
        },
        attributes: [
          {
            key: '_return_url',
            value: `${baseUrl}/payment/success`
          }
        ]
      } 
    };

    try {
      const res = await fetch(`https://${this.shopDomain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();
      
      // Check for errors
      if (json?.data?.cartCreate?.userErrors?.length > 0) {
        console.error('[Shopify] cartCreate userErrors:', json.data.cartCreate.userErrors);
        return '/cart';
      }
      
      const checkoutUrl = json?.data?.cartCreate?.cart?.checkoutUrl;
      if (checkoutUrl) {
        console.log('[Shopify] Cart created successfully, redirecting to:', checkoutUrl);
        return checkoutUrl;
      }

      console.error('[Shopify] cartCreate error:', json?.errors || json);
      return '/cart';
    } catch (err) {
      console.error('[Shopify] Network/API error:', err);
      return '/cart';
    }
  }
}
