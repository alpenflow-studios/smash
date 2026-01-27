# Next Steps - Updated Jan 26, 2026

## Immediate (Do Now)

### 1. ⏳ Wait for Supabase Restart
- Project is restarting to clear schema cache
- Should take 2-3 minutes
- Check: https://supabase.com/dashboard/project/utbkhzooafzepabtrhnc

### 2. Test Smash Creation
After restart completes:
1. Hard refresh browser (Cmd+Shift+R)
2. Go to localhost:3000/create or smash.xyz/create
3. Fill out form and submit
4. Check console for errors
5. If new column errors appear, add them via SQL Editor

### 3. Update Schema File
Once smash creation works:
```bash
# In SQL Editor, run:
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'smashes' 
ORDER BY ordinal_position;
```
Then update `smash_schema.sql` in repo to match.

---

## This Week

### 4. Fix Form State Reset
In `src/store/use-create-smash.ts`, add:
```typescript
resetForm: () => set(initialState),
```
Call this on navigation away from create page.

### 5. Smash Detail Page
- Create `/smash/[id]/page.tsx`
- Show smash details, participants, status
- Add proof submission UI

### 6. Profile Page Fixes
- Debug "Failed to fetch profile" errors
- Wire up user smashes query

---

## Next Sprint

### 7. Smart Contract Integration
- Connect SmashVault contract to create flow
- Entry fee deposits
- Prize pool management

### 8. Proof Submission System
- Image/video upload to Supabase Storage
- Submission review UI
- Voting mechanism

### 9. Prediction Market
- Polymarket CLOB API integration
- Betting UI components
- Odds display

---

## Credentials Reference

**Supabase (NEW):**
- Project: smash-xyz
- ID: utbkhzooafzepabtrhnc
- URL: https://utbkhzooafzepabtrhnc.supabase.co

**Vercel:**
- Project: v0-smash-xyz
- URL: https://smash.xyz

**Smart Contract:**
- SmashVault: 0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De
- Network: Base Sepolia (84532)

---

## For Claude Code in VS Code

When continuing development:
1. Open the smash project folder (not hello_foundry!)
2. Read SMASH_SPEC.md for full feature spec
3. Check src/types/index.ts for TypeScript types
4. Database queries are in src/lib/queries.ts