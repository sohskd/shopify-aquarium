import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller()
export class AppController {
  private products = [
    {
      id: 1,
      name: "Oriental TC - Micranthemum 'Monte Carlo'",
      price: "$10.00 SGD",
      image: "product1.jpg",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 2,
      name: "Oriental TC - Eleocharis acicularis 'Mini'",
      price: "$10.00 SGD",
      image: "product2.jpg",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 3,
      name: "Oriental TC - Staurogyne repens",
      price: "$10.00 SGD",
      image: "product3.jpg",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    },
    {
      id: 4,
      name: "Oriental TC - Bucephalandra Brownie Ghost",
      price: "$10.00 SGD",
      image: "product4.jpg",
      description: "To ensure our TC remains fresh when delivered to you, please allow approximately one week for delivery."
    }
  ];

  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'Aquatic Avenue | Aquarium Shop & Custom Tank Specialist Singapore',
      bestSellers: this.products
    };
  }

  @Get('product/:id')
  @Render('product')
  getProduct(@Param('id') id: string) {
    const product = this.products.find(p => p.id === parseInt(id));
    if (!product) {
      // Return first product as fallback
      return { product: this.products[0] };
    }
    return { product };
  }

  @Get('cart')
  @Render('cart')
  getCart() {
    // Cart is fully managed on the client via localStorage
    return {};
  }
}
