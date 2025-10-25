# 🌊 Aquarium Website Redesign Plan

## Overview
Transform the existing aquarium e-commerce site into an immersive underwater experience while maintaining all Shopify integration and shopping functionality.

## Design Theme
- **Color Palette**: Deep ocean blues (#0A2540, #1E3A5F), turquoise (#06B6D4, #14B8A6), coral accents (#FF6B6B, #FFA07A), soft neutrals (#F0F9FF, #E0F2FE)
- **Typography**: Modern, clean fonts (Poppins for headings, Inter for body)
- **Atmosphere**: Calm, immersive, fluid with subtle animations

## Pages to Redesign

### 1. Homepage (`views/index.hbs`)
**Hero Section:**
- Full-width underwater background with animated gradient overlay
- Tagline: "Dive Into Wonder at Aquatic Avenue"
- Floating bubble animations (CSS)
- CTAs: "Explore Products", "Plan Your Visit", "Shop Now"

**Navigation:**
- Transparent/glass-morphism nav bar
- Ocean blue on scroll
- Wave-like underline animations

**Product Showcase:**
- Card-based grid with hover effects (lift + glow)
- Underwater-themed product cards
- Category filters with marine icons

**Features Section:**
- Icons with ocean theme (waves, fish, coral)
- Soft blue backgrounds

**Footer:**
- Deep ocean blue background
- Wave SVG divider at top

### 2. Product Detail Page (`views/product.hbs`)
- Immersive product view with soft shadows
- Aqua-themed buttons
- Floating add-to-cart button
- Coral accent colors for CTAs

### 3. Cart Page (`views/cart.hbs`)
- Clean, modern cart with ocean accents
- Checkout button in coral/turquoise
- Subtle wave patterns

## Key Features to Implement

### Animations & Effects:
1. **Floating Bubbles** - CSS keyframe animation
2. **Wave Dividers** - SVG wave shapes between sections
3. **Parallax Scrolling** - Subtle depth effect on hero
4. **Hover Effects** - Lift, glow, and scale on products
5. **Smooth Transitions** - All interactions feel fluid

### Color Usage:
- **Primary**: Ocean Blue (#0EA5E9)
- **Secondary**: Turquoise (#14B8A6)
- **Accent**: Coral (#FF6B6B)
- **Background**: Light Blue (#F0F9FF)
- **Text**: Deep Navy (#0F172A)

### Typography:
```css
Headings: 'Poppins', sans-serif (300, 400, 600)
Body: 'Inter', sans-serif (400, 500)
```

## Implementation Steps

1. ✅ Backup existing files
2. ⏳ Update homepage with new theme
3. ⏳ Redesign product cards
4. ⏳ Update product detail page
5. ⏳ Redesign cart page
6. ⏳ Add animations and transitions
7. ⏳ Test responsiveness
8. ⏳ Deploy to Vercel

## Functionality to Preserve
- ✅ Shopify product fetching
- ✅ Add to cart functionality
- ✅ Cart management (localStorage)
- ✅ Checkout integration
- ✅ Product filtering
- ✅ Responsive design
- ✅ Environment variable configuration

## Files to Modify
- `views/index.hbs` - Homepage
- `views/product.hbs` - Product detail
- `views/cart.hbs` - Shopping cart
- `views/layouts/main.hbs` - Layout (if exists)

## Notes
- All existing routes and controllers remain unchanged
- Shopify integration stays intact
- Only visual/UI changes
- Maintain accessibility standards
