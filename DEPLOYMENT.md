# Deployment Guide - Netlify

This guide will help you deploy PwedMin to Netlify successfully.

## Prerequisites

Before deploying, make sure you have:
- ✅ A Supabase project set up (see `SUPABASE_SETUP.md`)
- ✅ Your Supabase URL and anon key
- ✅ A Netlify account (free tier works fine)
- ✅ Your code committed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Make sure these files are committed:
- `.nvmrc` - Ensures correct Node version
- `netlify.toml` - Netlify configuration
- `package.json` and `package-lock.json` - Dependencies
- All source files

**DO NOT commit:**
- `.env.local` - This should stay in `.gitignore`
- `node_modules/` - This should stay in `.gitignore`

## Step 2: Connect to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Netlify will auto-detect Next.js settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Framework:** Next.js

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts to connect your repository
```

## Step 3: Configure Environment Variables

This is the **MOST CRITICAL STEP**. Without these, your build will fail.

### In Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add these **two** variables:

**Variable 1:**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://your-project-id.supabase.co` (your actual Supabase project URL)

**Variable 2:**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual Supabase anon/public key)

**Where to find these values:**
1. Open your Supabase project
2. Go to **Settings** → **API**
3. Copy **Project URL** and **anon/public key**

### Via Netlify CLI:

```bash
# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key-here"
```

## Step 4: Update Supabase URLs

After your site is deployed, you'll get a Netlify URL (e.g., `https://your-app.netlify.app`).

Update Supabase to allow this URL:

1. Go to your Supabase project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Netlify URL to:
   - **Site URL:** `https://your-app.netlify.app`
   - **Redirect URLs:** Add `https://your-app.netlify.app/auth/callback`

## Step 5: Deploy!

### If using Netlify Dashboard:
1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://random-name.netlify.app`

### If using Netlify CLI:
```bash
# Deploy
netlify deploy --prod

# Or just
netlify deploy
```

## Step 6: Custom Domain (Optional)

To use your own domain:

1. In Netlify, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions
4. Update Supabase URL configuration with your custom domain

## Troubleshooting

### Build fails with "Module not found" or "Cannot find package"

**Cause:** Dependencies not installed or package.json corrupted

**Fix:**
```bash
# Locally, clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Commit the new package-lock.json
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

Then trigger a new deploy in Netlify.

### Build fails with "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Cause:** Environment variables not set in Netlify

**Fix:**
1. Go to Netlify dashboard → **Site settings** → **Environment variables**
2. Add the two required variables (see Step 3 above)
3. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Build succeeds but login doesn't work

**Cause:** Netlify URL not added to Supabase allowed URLs

**Fix:**
1. Get your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Go to Supabase → **Authentication** → **URL Configuration**
3. Add the Netlify URL to Site URL and Redirect URLs
4. Add the callback URL: `https://your-app.netlify.app/auth/callback`

### "Edge Runtime" warnings

**Status:** These are just warnings, not errors. They don't affect functionality.

**Explanation:** Supabase uses some Node.js APIs that aren't available in Edge Runtime, but Next.js handles this correctly. The app will still work.

### Build is slow or times out

**Cause:** Large dependencies or insufficient Netlify build time

**Fix:**
1. Ensure you're not accidentally including `node_modules` in git
2. Check `.gitignore` includes `node_modules/`
3. On free tier, builds timeout after 15 minutes (should be plenty)
4. Try clearing build cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Functions not working

**Cause:** Next.js API routes need special handling on Netlify

**Fix:** The `@netlify/plugin-nextjs` package (already installed) handles this. Make sure `netlify.toml` is committed.

## Post-Deployment Checklist

After successful deployment:

- [ ] Can you access the site at the Netlify URL?
- [ ] Does the login page load?
- [ ] Can you sign up for a new account?
- [ ] Do you receive the verification email?
- [ ] After verifying, can you log in?
- [ ] Does the Budget Tracker work?
- [ ] Can you add/delete budget items?
- [ ] Does data persist after logout/login?

## Production Best Practices

### 1. Enable Email Confirmations in Supabase
In **Authentication** → **Settings**, make sure:
- ✅ "Enable email confirmations" is ON
- ✅ "Enable email invites" is ON (if you want invite functionality)

### 2. Set Up Custom Domain
- Use a custom domain instead of `*.netlify.app`
- Enables proper HTTPS and better SEO
- Update Supabase URLs after domain is configured

### 3. Monitor Your Site
Netlify provides:
- Build logs
- Function logs
- Analytics (paid feature)
- Form submissions (if you add forms)

### 4. Set Up Continuous Deployment
By default, Netlify will:
- Auto-deploy when you push to your main branch
- Create deploy previews for pull requests
- Roll back to previous deploys if needed

### 5. Database Backups
In Supabase:
- Go to **Database** → **Backups**
- Daily backups are enabled by default on paid plans
- Free tier: manual backups only

## Environment Variables Reference

Required variables for production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- These are **public** variables (safe to expose in client-side code)
- Never use `service_role` key in frontend code
- The `anon` key is safe to use in browser (protected by RLS policies)

## Costs

### Netlify Free Tier Includes:
- ✅ 300 build minutes/month
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Deploy previews
- ✅ Forms (100 submissions/month)

This is plenty for a wedding planner app!

### Supabase Free Tier Includes:
- ✅ 500 MB database space
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 5 GB file storage
- ✅ Social OAuth providers

Perfect for personal wedding planning!

## Getting Help

If you encounter issues:

1. **Check Netlify Deploy Logs:**
   - Go to **Deploys** → Click on the failed deploy
   - Scroll through the log to find the error
   - Look for lines starting with "Error:" or "Failed"

2. **Check Supabase Logs:**
   - Go to **Logs** → **API Logs**
   - Filter by errors
   - Check if authentication requests are reaching Supabase

3. **Common Resources:**
   - [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/overview/)
   - [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
   - [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

## Quick Deploy Commands

```bash
# Test build locally (always do this first!)
npm run build

# Deploy to Netlify
netlify deploy --prod

# View logs
netlify logs

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin
```

## Success!

Once deployed, your wedding planner app will be:
- ✅ Accessible worldwide at your Netlify URL
- ✅ Automatically backed up (on Supabase)
- ✅ Auto-deployed on every git push
- ✅ Running on enterprise-grade infrastructure
- ✅ Completely free (on free tiers)

Share the link with your users and start planning amazing weddings! 💒
