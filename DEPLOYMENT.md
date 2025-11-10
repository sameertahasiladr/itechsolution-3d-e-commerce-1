# 🚀 Deploying iTechSolution to Production

This guide will help you deploy your iTechSolution website and make it discoverable on Google.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (recommended) or other hosting platform
- Domain name (optional but recommended)

## Step 1: Deploy to Vercel (Recommended)

### Option A: Deploy via Vercel Dashboard

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Import Your Project**
   - Click "Add New Project"
   - Select your iTechSolution repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   TURSO_DATABASE_URL=your_database_url
   TURSO_AUTH_TOKEN=your_auth_token
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `your-project.vercel.app`

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 2: Connect Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `itechsolution.com`)
4. Update your domain's DNS settings:
   - Add A record: `76.76.19.19`
   - Add CNAME record: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)

## Step 3: Update Environment Variable

Once deployed, update your `.env` file locally and in Vercel:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Then redeploy to apply changes.

## Step 4: Submit to Google Search Console

### Register Your Website

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Enter your website URL: `https://yourdomain.com`
4. Choose verification method:
   
   **Method 1: HTML Tag (Easiest)**
   - Copy the verification meta tag
   - Add it to your `.env` file:
     ```env
     NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
     ```
   - Redeploy your site
   - Click "Verify" in Google Search Console

   **Method 2: Domain DNS**
   - Add TXT record to your domain DNS
   - Wait for DNS propagation
   - Click "Verify"

### Submit Sitemap

1. In Google Search Console, go to "Sitemaps"
2. Enter: `https://yourdomain.com/sitemap.xml`
3. Click "Submit"
4. Google will start crawling your site within 24-48 hours

## Step 5: Submit to Bing Webmaster Tools (Optional)

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with Microsoft account
3. Add your site
4. Verify ownership (similar to Google)
5. Submit sitemap: `https://yourdomain.com/sitemap.xml`

## Step 6: Optimize for Google Discovery

### Create Google My Business (Optional)

If you have a physical store:
1. Go to [Google Business Profile](https://business.google.com)
2. Add your business details
3. Verify your business
4. Add photos, hours, and contact info

### Build Backlinks

- Share your website on social media
- List on business directories
- Create blog content and share on platforms
- Get featured in tech forums or review sites

### Monitor Performance

1. **Google Search Console**
   - Check indexing status
   - Monitor search performance
   - Fix any crawl errors

2. **Google Analytics** (Optional)
   - Sign up at [analytics.google.com](https://analytics.google.com)
   - Add tracking code to your site
   - Monitor traffic and user behavior

## Alternative Hosting Platforms

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically

### AWS Amplify

1. Go to AWS Amplify Console
2. Connect repository
3. Configure build settings
4. Deploy

## Build Optimization

Before deploying, ensure optimal build:

```bash
# Test production build locally
bun run build
bun run start

# Check build output
# Should complete without errors
```

## Post-Deployment Checklist

- [ ] Website loads correctly at production URL
- [ ] All images and assets load properly
- [ ] Database connection works
- [ ] Forms submit successfully
- [ ] WhatsApp links work (+91 9545690700)
- [ ] Mobile responsive design works
- [ ] SSL certificate is active (HTTPS)
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Google
- [ ] All pages indexed by Google (check after 2-3 days)

## SEO Best Practices

1. **Content Quality**
   - Add detailed product descriptions
   - Create blog posts about tech topics
   - Keep content fresh and updated

2. **Performance**
   - Optimize images (already using Next.js Image)
   - Enable caching
   - Monitor Core Web Vitals

3. **Mobile-First**
   - Test on multiple devices
   - Ensure touch targets are adequate
   - Optimize mobile loading speed

4. **Social Sharing**
   - Share new products on WhatsApp status
   - Post on Facebook/Instagram
   - Create YouTube videos about products

## Monitoring & Maintenance

### Weekly Tasks
- Check Google Search Console for errors
- Review new orders
- Update product inventory

### Monthly Tasks
- Analyze Google Analytics data
- Update SEO keywords based on search trends
- Add new products
- Create blog content

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Google Search Console Help**: [support.google.com](https://support.google.com/webmasters)

## Quick Reference

**Your Website URLs:**
- Homepage: `https://yourdomain.com`
- Products: `https://yourdomain.com/products`
- Sitemap: `https://yourdomain.com/sitemap.xml`
- Robots: `https://yourdomain.com/robots.txt`

**Important Links:**
- Vercel Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Google Search Console: [search.google.com/search-console](https://search.google.com/search-console)
- Google Analytics: [analytics.google.com](https://analytics.google.com)

---

🎉 **Congratulations!** Your iTechSolution website is now live and ready to be discovered on Google!

For support, contact: +91 9545690700 (WhatsApp)
