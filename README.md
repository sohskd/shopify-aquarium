# Aquatic Avenue - E-commerce Platform

A modern e-commerce platform built with NestJS and integrated with Shopify Storefront API for aquarium products.

## 🚀 Features

- **Dynamic Product Catalog**: Fetches products directly from Shopify
- **Shopping Cart**: Client-side cart with localStorage
- **Shopify Checkout**: Seamless integration with Shopify's checkout system
- **Responsive Design**: Built with TailwindCSS
- **Server-Side Rendering**: Handlebars templates for SEO-friendly pages

## 🛠️ Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Frontend**: Handlebars, TailwindCSS
- **API Integration**: Shopify Storefront API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Shopify store with Storefront API access

## 🔧 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nestjs-tailwind-app.git
cd nestjs-tailwind-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Shopify credentials:
```env
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

### 4. Run the development server
```bash
npm run start:dev
```

Visit `http://localhost:3000`

## 🔐 Shopify Setup

See [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) for detailed instructions on:
- Creating a Shopify custom app
- Configuring Storefront API scopes
- Getting your access token

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions to:
- Push code to GitHub
- Deploy to Vercel
- Configure environment variables securely

## 📁 Project Structure

```
├── public/           # Static assets (images)
├── src/
│   ├── app.controller.ts    # Route handlers
│   ├── app.module.ts        # App configuration
│   ├── shopify.service.ts   # Shopify API integration
│   └── main.ts              # App entry point
├── views/            # Handlebars templates
│   ├── index.hbs     # Homepage
│   ├── product.hbs   # Product detail page
│   └── cart.hbs      # Shopping cart
└── test/             # E2E tests
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Run production build
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🔒 Security

- All sensitive credentials are stored in environment variables
- `.env` file is gitignored
- Shopify API tokens are never exposed to the client

## 📄 License

UNLICENSED - Private project
