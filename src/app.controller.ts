import { Controller, Get, Post, Render, Param, Body, Query } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { PayNowService } from './paynow.service';

@Controller()
export class AppController {
  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly payNowService: PayNowService,
  ) {}
  
  // Fallback products in case Shopify is not configured
  private fallbackProducts = [
    {
      id: 1,
      name: "Oriental TC - Micranthemum 'Monte Carlo'",
      price: "$10.00 SGD",
      image: "product1.jpg",
      shopifyVariantId: "",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 2,
      name: "Oriental TC - Eleocharis acicularis 'Mini'",
      price: "$10.00 SGD",
      image: "product2.jpg",
      shopifyVariantId: "",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 3,
      name: "Oriental TC - Staurogyne repens",
      price: "$10.00 SGD",
      image: "product3.jpg",
      shopifyVariantId: "",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 4,
      name: "Oriental TC - Bucephalandra Brownie Ghost",
      price: "$10.00 SGD",
      image: "product4.jpg",
      shopifyVariantId: "",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    }
  ];

  @Get()
  @Render('index')
  async getHome() {
    const products = await this.shopifyService.getAllProducts();
    return {
      title: 'Aquatic Avenue | Aquarium Shop & Custom Tank Specialist Singapore',
      bestSellers: products.length > 0 ? products : this.fallbackProducts
    };
  }

  @Get('product/:id')
  @Render('product')
  async getProduct(@Param('id') id: string) {
    const products = await this.shopifyService.getAllProducts();
    const productList = products.length > 0 ? products : this.fallbackProducts;
    const product = productList.find(p => p.id === parseInt(id));
    if (!product) {
      // Return first product as fallback
      return { product: productList[0] };
    }
    return { product };
  }

  @Get('cart')
  @Render('cart')
  getCart() {
    // Cart is fully managed on the client via localStorage
    return {};
  }

  @Post('api/checkout')
  async createCheckout(@Body() body: { items: any[] }) {
    const checkoutUrl = await this.shopifyService.createCheckout(body.items);
    return { checkoutUrl };
  }

  @Get('checkout/payment')
  @Render('payment-selection')
  getPaymentSelection() {
    return { title: 'Select Payment Method - Aquatic Avenue' };
  }

  @Get('checkout/paynow')
  @Render('paynow-payment')
  async getPayNowPayment(@Query('total') total: string, @Query('ref') ref: string) {
    const amount = parseFloat(total) || 0;
    const reference = ref || this.payNowService.generateOrderReference();
    
    // FOR TESTING: Use a static test QR code
    const qrCode = '/images/paynowqr.jpg'; // Your custom QR code
    
    // Comment out the try-catch block when using static QR
    /*
    try {
      const qrCode = await this.payNowService.generatePayNowQR(amount, reference);
      return {
        title: 'PayNow Payment - Aquatic Avenue',
        qrCode,
        amount: amount.toFixed(2),
        reference,
      };
    } catch (error) {
      return {
        title: 'PayNow Payment - Aquatic Avenue',
        error: 'Failed to generate QR code',
      };
    }
    */
    
    // Return with your custom QR code
    return {
      title: 'PayNow Payment - Aquatic Avenue',
      qrCode,
      amount: amount.toFixed(2),
      reference,
    };
  }

  @Get('payment/success')
  @Render('payment-success')
  getPaymentSuccess(@Query('ref') ref: string) {
    return {
      title: 'Payment Successful - Aquatic Avenue',
      reference: ref || 'N/A',
    };
  }
}
