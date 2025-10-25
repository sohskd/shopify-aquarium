# Deployment Guide - GitHub & Vercel

## 🔒 Security Checklist

Before pushing to GitHub, verify:
- ✅ `.env` is in `.gitignore` (already done)
- ✅ Never commit API keys or secrets
- ✅ Use environment variables for all sensitive data

---

## 📦 Step 1: Initialize Git & Push to GitHub

### 1.1 Initialize Git Repository (if not already done)
```bash
cd /Users/desmondsoh/CascadeProjects/nestjs-tailwind-app
git init
```

### 1.2 Add All Files
```bash
git add .
```

### 1.3 Create Initial Commit
```bash
git commit -m "Initial commit: NestJS + Shopify integration app"
```

### 1.4 Create GitHub Repository
1. Go to https://github.com/new
2. Name: `nestjs-tailwind-app` (or your preferred name)
3. **DO NOT** initialize with README (you already have code)
4. Click "Create repository"

### 1.5 Link Local Repo to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/nestjs-tailwind-app.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2.2 Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure Project**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variables** (IMPORTANT):
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `SHOPIFY_SHOP_DOMAIN` | `real-blue-aquarium.myshopify.com` |
   | `SHOPIFY_STOREFRONT_TOKEN` | `your-storefront-token-here` |
   | `NODE_ENV` | `production` |

7. **Click "Deploy"**

### 2.3 Deploy via CLI (Alternative)
```bash
vercel
# Follow the prompts
# Add environment variables when prompted
```

---

## 🔐 Step 3: Secure Your Environment Variables

### On Vercel Dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add your secrets:
   - `SHOPIFY_SHOP_DOMAIN`
   - `SHOPIFY_STOREFRONT_TOKEN`
4. Select which environments (Production, Preview, Development)
5. Click **Save**

### Important Notes:
- ✅ Environment variables are encrypted by Vercel
- ✅ They're never exposed in your code or logs
- ✅ Each deployment environment can have different values
- ❌ Never hardcode secrets in your code
- ❌ Never commit `.env` to GitHub

---

## 🔄 Step 4: Continuous Deployment

Once connected, Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Runs your build command
- ✅ Serves your app globally via CDN

### To Update Your App:
```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
# Vercel automatically deploys!
```

---

## 🧪 Step 5: Test Your Deployment

1. **Get your Vercel URL**: `https://your-app.vercel.app`
2. **Test the homepage**: Should show products from Shopify
3. **Test product pages**: `/product/1`
4. **Test cart**: `/cart`
5. **Test checkout**: Should redirect to Shopify checkout

---

## 🐛 Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`

### Environment Variables Not Working
- Double-check variable names match exactly
- Redeploy after adding variables
- Check Vercel logs for errors

### Images Not Loading
- Ensure `/public` directory is included in deployment
- Check image paths are correct
- Verify Shopify images are accessible

### Shopify Integration Not Working
- Verify environment variables are set in Vercel
- Check Shopify Storefront API token is valid
- Ensure your Shopify app has correct scopes

---

## 📝 Additional Tips

### Custom Domain (Optional)
1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### View Deployment Logs
```bash
vercel logs
```

### Rollback to Previous Deployment
1. Go to Vercel dashboard → **Deployments**
2. Find the working deployment
3. Click **⋯** → **Promote to Production**

---

## 🔗 Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **NestJS Deployment**: https://docs.nestjs.com/deployment
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront

---

## ✅ Deployment Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] First deployment successful
- [ ] Shopify integration working
- [ ] All pages loading correctly
- [ ] Images displaying properly
- [ ] Checkout flow tested

---

**Your app is now live! 🎉**
