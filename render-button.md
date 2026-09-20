# 🚀 Deploy to Render (1-Click)

## Click the button below to deploy immediately:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/olivierlelevrier-spec/vehicle-auctions/tree/main)

---

## Or Manually Deploy:

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub account
4. Select: `olivierlelevrier-spec/vehicle-auctions`
5. Choose branch: `main`
6. Fill in:
   - **Name**: `vehicle-auctions-mvp`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or Pro if you prefer)

7. Click **"Advanced"** and add Environment Variables from your Supabase project:
   - Go to https://app.supabase.com/project/[your-project]/settings/api
   - Copy these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [your-url]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
   NODE_ENV = production
   ```

8. Click **"Deploy"** ✅

---

## What happens next:

- ✅ Render clones your repo
- ✅ Builds Next.js (`npm run build`)
- ✅ Deploys to Render servers
- ✅ Gives you a public URL: `https://vehicle-auctions-mvp.onrender.com`
- ✅ Auto-redeploys on GitHub push

---

## Your MVP will be live at:

**https://vehicle-auctions-mvp.onrender.com/mvp**

---

**Deploy Time**: ~3-5 minutes (first time)

**Cost**: Free (with limitations) or $7/month for reliable hosting
