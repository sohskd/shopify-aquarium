# Quick Deployment Commands

## 🚀 Push to GitHub (First Time)

```bash
# 1. Initialize git (if not done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: Aquatic Avenue e-commerce platform"

# 4. Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/nestjs-tailwind-app.git
git branch -M main
git push -u origin main
```

## 🔄 Update Existing Repo

```bash
git add .
git commit -m "Your commit message here"
git push origin main
```

## ☁️ Deploy to Vercel

### Option 1: Via Dashboard (Easiest)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Add environment variables:
   - `SHOPIFY_SHOP_DOMAIN` = `real-blue-aquarium.myshopify.com`
   - `SHOPIFY_STOREFRONT_TOKEN` = `your-token`
5. Click "Deploy"

### Option 2: Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables
```

## 🔐 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `SHOPIFY_SHOP_DOMAIN` | `real-blue-aquarium.myshopify.com` |
| `SHOPIFY_STOREFRONT_TOKEN` | Get from Shopify Admin |
| `NODE_ENV` | `production` |

## ✅ Verify Deployment

1. Check build logs in Vercel
2. Visit your deployment URL
3. Test:
   - Homepage loads
   - Products display
   - Product detail pages work
   - Cart functions
   - Checkout redirects to Shopify

## 🐛 Common Issues

**Build fails**: Check Vercel logs, ensure `npm run build` works locally

**No products showing**: Verify environment variables are set in Vercel

**Images not loading**: Check Shopify image URLs and `/public` folder

## 📞 Need Help?

See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
