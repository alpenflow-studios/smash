# Current Issues & Solutions

## 🔴 Critical Issues

### 1. Vercel Deployment Failing
**Status:** In Progress

**Error:**
```
npm error Could not resolve dependency:
npm error peer @privy-io/react-auth@"^1.33.0" from @privy-io/wagmi-connector
```

**Root Cause:**
- Privy's wagmi-connector requires old version of react-auth
- We installed newer version
- Peer dependency conflict

**Solution Applied:**
- Created `.npmrc` with `legacy-peer-deps=true`
- Pushed to GitHub
- Need to redeploy in Vercel

**Next Steps:**
1. Go to Vercel
2. Click "Redeploy"
3. Build should succeed

---

### 2. Missing Environment Variable in Production
**Status:** Not Yet Fixed

**Issue:**
- Privy App ID not in Vercel environment
- Wallet connection won't work on live site

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_PRIVY_APP_ID` = (your app ID)
3. Redeploy

**Where to find App ID:**
- Local: `.env.local` file
- Or: https://dashboard.privy.io

---

## ⚠️ Minor Issues

### 3. DNS Propagation Time
**Status:** Resolving Naturally

**Issue:**
- Changed nameservers to Vercel
- Takes 24-48 hours to fully propagate globally

**Current State:**
- Works on whatsmydns.net
- May not work everywhere yet

**Solution:**
- Wait 24 hours
- Test from multiple locations/devices
- Use Vercel URL in meantime

---

### 4. No Real Data
**Status:** Expected (By Design)

**Issue:**
- Only showing 3 hardcoded smashes
- No database connection yet

**Solution:**
- This is intentional for MVP
- Will connect Supabase in next session
- Mock data proves UI works

---

### 5. Buttons Don't Do Anything
**Status:** Expected

**Issue:**
- "Join" button just logs to console
- "Bet" button just logs to console
- "Create Your First Smash" doesn't open modal

**Solution:**
- These features not built yet
- Will implement in next session
- Currently just UI/design phase

---

## 🟢 Resolved Issues

### ~~Shadcn Components Not Installing~~
**Fixed:** Used `--legacy-peer-deps` flag

### ~~Font Files Not Found~~
**Fixed:** Removed local font imports from layout.tsx

### ~~SmashCard Import Error~~
**Fixed:** Moved file from `components/ui/` to `components/`

### ~~Type Errors~~
**Fixed:** Created proper TypeScript types in `src/types/`

---

## Debug Commands

**Check git status:**
```bash
git status
git log --oneline -5
```

**Test locally:**
```bash
npm run dev
# Open http://localhost:3000
```

**Check environment variables:**
```bash
cat .env.local
```

**Force clean install:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Common Errors & Fixes

**"Module not found" errors:**
- Check file exists in correct location
- Check import path uses `@/` alias
- Restart dev server

**Wallet connection not working:**
- Check Privy App ID is set
- Check domain is added in Privy dashboard
- Check browser console for errors

**Vercel build fails:**
- Check build logs for specific error
- Ensure all files pushed to GitHub
- Check environment variables set in Vercel