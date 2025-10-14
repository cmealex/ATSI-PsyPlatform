# 🚀 Supabase Migration Guide

## ✅ Migration Complete!

Your ATSI PsyPlatform has been successfully migrated from localStorage to Supabase!

---

## 📋 What Was Changed

### 1. **New Files Created**
- `supabase-config.js` - Supabase client configuration
- `supabase-schema.sql` - Database schema (run this in Supabase)
- `data.js` - Updated to use Supabase instead of localStorage
- `auth.js` - Updated to use Supabase authentication

### 2. **Backup Files Created**
- `data-localStorage-backup.js` - Original localStorage version
- `auth-localStorage-backup.js` - Original auth version
- `app-localStorage-backup.js` - Original app version

### 3. **Files Updated**
- `index.html` - Added Supabase CDN script
- `app.js` - All functions updated to use async/await

---

## 🎯 Setup Steps

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name**: ATSI PsyPlatform
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to your users
5. Wait ~2 minutes for project setup

### Step 2: Run Database Schema (2 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase-schema.sql` from your project folder
4. Copy entire contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see success messages

### Step 3: Get API Credentials (1 minute)

1. In Supabase Dashboard, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. Keep this page open

### Step 4: Configure Your Application (1 minute)

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:

```javascript
// BEFORE:
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// AFTER (use YOUR actual values):
const SUPABASE_URL = 'https://abc123xyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

3. Save the file

### Step 5: Test Your Application

1. Open `index.html` in a browser
2. Open browser console (F12)
3. You should see:
   - `✅ Supabase configured successfully`
   - `✅ Supabase connection established`
4. If you see errors, check:
   - `supabase-config.js` has correct credentials
   - `supabase-schema.sql` ran without errors
   - You have internet connection

---

## 🔐 Create Admin Account

Since you're using Supabase Auth now, you need to create an admin account:

### Option A: Via Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email**: admin@atsi.ro
   - **Password**: (choose a secure password)
   - **Auto Confirm User**: ✅ Check this
4. Click **"Create user"**
5. Copy the **User UID**
6. Go to **SQL Editor** and run:

```sql
-- Insert admin user into users table
INSERT INTO users (id, email, name, user_type)
VALUES ('paste-user-uid-here', 'admin@atsi.ro', 'Administrator', 'admin');
```

### Option B: Register Through App

1. Open your application
2. Go to Registration
3. Register as a regular user
4. Go to Supabase Dashboard → **SQL Editor**
5. Run:

```sql
-- Find your user and make them admin
UPDATE users 
SET user_type = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 📊 Data Migration (If You Had Data in localStorage)

If you had data in your old localStorage version, you'll need to manually migrate it:

### Export from localStorage (Old Version)

Open browser console on the old version and run:

```javascript
// Export all data
const exportData = {
  users: localStorage.getItem('users'),
  therapists: localStorage.getItem('therapists'),
  appointments: localStorage.getItem('appointments'),
  reviews: localStorage.getItem('reviews'),
  forumTopics: localStorage.getItem('forumTopics'),
  forumReplies: localStorage.getItem('forumReplies')
};

console.log(JSON.stringify(exportData, null, 2));
// Copy this output
```

### Import to Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Create insert statements for your data
3. Run them

**Note**: This is a manual process. For production, consider building a migration script.

---

## 🔄 Key Differences from localStorage Version

### Authentication

**BEFORE (localStorage)**:
- Passwords stored with simple hash (insecure)
- Sessions in localStorage
- No real security

**AFTER (Supabase)**:
- Real authentication with bcrypt hashing
- JWT tokens for sessions
- Production-ready security
- Email confirmation available
- Password reset available

### Data Storage

**BEFORE (localStorage)**:
- Each user has their own data
- Data not shared between users
- Lost on browser clear

**AFTER (Supabase)**:
- Centralized PostgreSQL database
- Real-time data sharing
- Persistent across devices
- Proper relationships and constraints

### Field Name Changes

Some field names were updated to match PostgreSQL conventions:

| Old (localStorage) | New (Supabase) |
|--------------------|----------------|
| `userType` | `user_type` |
| `userId` | `user_id` |
| `userName` | `user_name` |
| `therapistId` | `therapist_id` |
| `topicId` | `topic_id` |

---

## 🧪 Testing Checklist

Test each feature to ensure migration was successful:

- [ ] **Registration**
  - [ ] Register as beneficiar
  - [ ] Register as psiholog (should be unapproved)
- [ ] **Login**
  - [ ] Login with correct credentials
  - [ ] Login fails with wrong credentials
- [ ] **Therapists**
  - [ ] View therapist list
  - [ ] Filter therapists (city, specialization, etc.)
  - [ ] View therapist detail
- [ ] **Appointments**
  - [ ] Book an appointment
  - [ ] View your appointments
  - [ ] Therapist sees their appointments
- [ ] **Reviews**
  - [ ] Submit a review
  - [ ] Review appears after admin approval
- [ ] **Forum**
  - [ ] Create a topic
  - [ ] Reply to a topic
- [ ] **Admin Panel**
  - [ ] View users
  - [ ] Approve psychologists
  - [ ] Approve reviews
  - [ ] View statistics

---

## 🐛 Troubleshooting

### Error: "Supabase NOT CONFIGURED"
**Solution**: Update `supabase-config.js` with your actual credentials

### Error: "relation 'users' does not exist"
**Solution**: Run `supabase-schema.sql` in Supabase SQL Editor

### Error: "Failed to fetch"
**Solution**: 
- Check internet connection
- Verify Supabase project is active
- Check browser console for CORS errors

### Row Level Security (RLS) Blocking Requests
**Solution**: Check policies in Supabase Dashboard → Authentication → Policies

### Can't See Unapproved Therapists
**Expected**: By default, only approved therapists are shown
**Admin**: Can see all therapists in admin panel

### Appointments Not Saving
**Check**: 
1. User is logged in
2. Browser console for errors
3. Supabase Dashboard → Table Editor → appointments table

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Static Frontend Only)

```bash
git init
git add .
git commit -m "Initial commit with Supabase"
git branch -M main
git remote add origin https://github.com/yourusername/atsi-psyplatform.git
git push -u origin main

# Enable GitHub Pages in repo settings
# Settings → Pages → Source: main branch
```

**URL**: `https://yourusername.github.io/atsi-psyplatform/`

### Option 2: Netlify (Recommended)

1. Go to https://netlify.com
2. Drag and drop your project folder
3. Done! Auto-deployed

### Option 3: Vercel

```bash
npx vercel
# Follow prompts
```

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth Guide**: https://supabase.com/docs/guides/auth
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **Supabase JavaScript Client**: https://supabase.com/docs/reference/javascript

---

## 🔒 Security Notes

### ⚠️ IMPORTANT for Production

1. **Environment Variables**: Move credentials to `.env` file (not committed to git)
2. **Row Level Security**: Review and tighten RLS policies
3. **Email Confirmation**: Enable in Supabase Auth settings
4. **Rate Limiting**: Configure in Supabase settings
5. **File Uploads**: Use Supabase Storage for therapist photos
6. **API Keys**: Use service role key only on backend (never in frontend)

### Current Security Level

✅ **Implemented**:
- Real password hashing (bcrypt on Supabase)
- JWT token authentication
- Row Level Security policies
- HTTPS by default (Supabase)

⚠️ **Still Needed for Production**:
- Email verification for registration
- Password strength requirements
- Account lockout after failed attempts (on backend)
- Input sanitization and validation
- CSRF protection for forms
- Content Security Policy headers

---

## 🎉 Success!

If all tests pass, your migration is complete! Your application now has:

✅ Real database with PostgreSQL
✅ Secure authentication
✅ Shared data across all users
✅ Production-ready infrastructure
✅ Free tier: 500MB database, 2GB bandwidth

---

## 📧 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check Supabase Dashboard → Logs
3. Review this guide's troubleshooting section
4. Check `migrate-app-to-async.js` helper script

---

## 🔄 Rollback (If Needed)

If something goes wrong, you can rollback:

```bash
# Restore original files
copy data-localStorage-backup.js data.js
copy auth-localStorage-backup.js auth.js
copy app-localStorage-backup.js app.js

# Remove Supabase script from index.html manually
```

Then refresh your browser.

---

**Created**: October 2024
**Version**: 1.0.0
**Status**: ✅ Migration Complete

