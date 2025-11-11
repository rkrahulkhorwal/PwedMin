# Supabase Setup Guide

This guide will help you set up Supabase for the PwedMin wedding planner application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter your project details:
   - Name: PwedMin (or your preferred name)
   - Database Password: (choose a strong password)
   - Region: (choose the closest to your users)
4. Click "Create new project"
5. Wait for the project to finish setting up (1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long JWT token)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Project URL and anon key from Step 2.

## Step 4: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

This will:
- Create all necessary tables (profiles, budget_items, checklist_items, suppliers, guests)
- Set up Row Level Security (RLS) policies
- Create triggers for automatic timestamp updates
- Create a trigger to automatically create user profiles on signup

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000/auth/callback`

For production, update these with your production URLs.

## Step 6: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. You should be redirected to `/login`
4. Try signing up with a new account
5. Check your email for the confirmation link
6. After confirming, you should be able to log in

## Database Schema Overview

### Tables

1. **profiles** - User profiles extending auth.users
   - Stores: email, full_name, partner_name, wedding_date, total_budget

2. **budget_items** - Wedding budget tracking
   - Stores: category, amount, paid status, notes

3. **checklist_items** - Wedding tasks/checklist
   - Stores: task, completed status, category, due_date, priority

4. **suppliers** - Wedding vendor contacts
   - Stores: name, category, contact_person, email, phone, cost, notes

5. **guests** - Guest list management
   - Stores: name, email, phone, rsvp_status, plus_one, table_number, dietary_restrictions

### Security

All tables have Row Level Security (RLS) enabled. Users can only:
- View their own data
- Insert their own data
- Update their own data
- Delete their own data

This ensures complete data isolation between users.

## Troubleshooting

### Issue: "Invalid API key"
- Make sure you copied the **anon/public** key, not the service_role key
- Check that there are no extra spaces in your `.env.local` file

### Issue: "Cross-origin request blocked"
- Make sure your site URL is added to **Authentication** → **URL Configuration**

### Issue: "Row Level Security policy violation"
- Make sure you ran the migration script completely
- Check that RLS policies were created correctly in the **Database** → **Policies** section

### Issue: Email confirmation not arriving
- Check your spam folder
- In development, you can disable email confirmation:
  - Go to **Authentication** → **Settings**
  - Toggle off "Enable email confirmations"
  - WARNING: Only do this in development!

## Production Deployment

When deploying to production:

1. Update environment variables with production Supabase URL and key
2. Update **Authentication** → **URL Configuration** with production URLs
3. Enable email confirmations
4. Consider setting up:
   - Custom SMTP for email sending
   - Database backups
   - Usage alerts
   - Additional security measures

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
