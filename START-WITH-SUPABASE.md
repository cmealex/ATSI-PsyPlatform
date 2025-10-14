# 🚀 Quick Start - Supabase Setup

## ⏱️ Setup Time: ~10 minutes

Follow these steps to get your application running with Supabase:

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Verify your email

---

## Step 2: Create New Project (3 minutes)

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   ```
   Name: ATSI-PsyPlatform
   Database Password: [Choose strong password - SAVE IT!]
   Region: [Choose closest to you]
   Pricing Plan: Free
   ```
4. Click **"Create new project"**
5. Wait ~2 minutes (grab coffee ☕)

---

## Step 3: Create Database Tables (2 minutes)

1. In your new project, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open `supabase-schema.sql` from your project folder
4. Copy ALL contents (Ctrl/Cmd + A, then Ctrl/Cmd + C)
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press **Ctrl/Cmd + Enter**
7. Wait for green success message ✅

---

## Step 4: Get Your API Keys (1 minute)

1. Click **"Settings"** (⚙️ icon at bottom of sidebar)
2. Click **"API"** in the Settings menu
3. You'll see two important values:

   ```
   Project URL: https://xxx.supabase.co
   anon public: eyJhbGc...long string...
   ```

4. Keep this tab open (you'll need these in next step)

---

## Step 5: Configure Your App (1 minute)

1. In your project folder, open **`supabase-config.js`**
2. Find these lines:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

3. Replace with YOUR values from Step 4:
   ```javascript
   const SUPABASE_URL = 'https://abc123xyz.supabase.co'; // YOUR URL
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...'; // YOUR KEY
   ```

4. Save the file

---

## Step 6: Test It! (1 minute)

1. Open **`index.html`** in your browser
2. Press **F12** to open Developer Console
3. Look for these messages:
   ```
   ✅ Supabase configured successfully
   ✅ Supabase connection established
   ```

4. If you see these, **YOU'RE DONE!** 🎉

---

## ❌ If You See Errors

### "Supabase NOT CONFIGURED"
→ Go back to Step 5, make sure you pasted YOUR actual values

### "Failed to fetch" or "Network error"
→ Check your internet connection

### "relation 'users' does not exist"
→ Go back to Step 3, run the SQL schema again

---

## ✅ What's Next?

### Create Your Admin Account

**Option A: Register Through App (Easiest)**
1. Click "Înregistrare" (Register)
2. Fill in your details
3. Choose "Beneficiar" as user type
4. Click Register
5. Go to Supabase Dashboard → SQL Editor
6. Run this query (replace with your email):
   ```sql
   UPDATE users 
   SET user_type = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

**Option B: Create Directly in Supabase**
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add user"**
3. Enter: `admin@atsi.ro` and a password
4. Check **"Auto Confirm User"**
5. Click **"Create user"**
6. Copy the User UID
7. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO users (id, email, name, user_type)
   VALUES ('paste-uid-here', 'admin@atsi.ro', 'Administrator', 'admin');
   ```

---

## 🎯 Test These Features

1. ✅ Register a new user
2. ✅ Login with your account
3. ✅ View therapists list
4. ✅ View a therapist's profile
5. ✅ Book an appointment (if logged in)
6. ✅ Submit a review
7. ✅ Create a forum topic
8. ✅ Access admin panel (if admin)

---

## 📚 Full Documentation

- **SUPABASE-MIGRATION-GUIDE.md** - Complete detailed guide
- **SUPABASE-IMPLEMENTATION-SUMMARY.md** - Technical overview
- **Supabase Docs** - https://supabase.com/docs

---

## 🐛 Still Having Issues?

1. Check browser console (F12) for errors
2. Check Supabase Dashboard → Logs
3. Read `SUPABASE-MIGRATION-GUIDE.md` troubleshooting section
4. Verify all 6 steps above were completed

---

## 🎊 Success!

If everything works, you now have:
- ✅ Real PostgreSQL database
- ✅ Secure authentication
- ✅ Shared data across all users
- ✅ Production-ready backend
- ✅ Free hosting (500MB database)

---

**Need more help?** See `SUPABASE-MIGRATION-GUIDE.md` for complete instructions.

**Ready to deploy?** See deployment section in the migration guide.

---

Created: October 2024 | Setup Time: ~10 minutes | Difficulty: Easy ⭐

