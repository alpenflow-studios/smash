# Current Issues - Updated Jan 26, 2026

## ✅ RESOLVED - Smash Creation Works!

### Database Schema Fixed
**Problem:** App code expected columns that didn't exist in database.

**Solution:** 
1. Added missing columns: `start_time`, `end_time`, `entry_fee`, `entry_token`, `max_participants`, `proof_type`, `verification_type`, `betting_enabled`, `visibility`, `stakes_type`, `invite_code`, `consensus_threshold`, `dispute_window_hours`
2. Changed `creator_id` from UUID to TEXT (dropped foreign key constraint) to accept wallet addresses
3. Restarted Supabase to clear schema cache

**Key insight:** Used `StepReview.tsx` to find exactly what fields the app sends, then matched database to code.

---

## 🟡 Medium Priority (Post-creation issues to investigate)

### 1. Unknown Issues After Smash Creation
**Status:** User reported "some issues" but couldn't upload screenshot
**Next:** Get details in next session

### 2. Form State Persists After Failed Submission
**Problem:** When smash creation fails, navigating away and back shows old form data instead of resetting.

**Location:** `src/store/use-create-smash.ts` (Zustand store)

**Fix:** Add a `resetForm()` function to the store and call it on navigation or after errors.

---

### 3. Schema File Out of Sync
**Problem:** `smash_schema.sql` in repo doesn't match actual working schema.

**Fix:** After confirming smash creation works, export current schema from Supabase and update the file.

---

## 🟡 Medium Priority

### 4. VS Code Opening Wrong Project Folder
**Problem:** Claude Code in VS Code keeps searching in `/Users/mpr/first/hello_foundry/` instead of the smash project.

**Cause:** VS Code was opened to the wrong folder. Need to find and open the correct smash project folder.

**Fix:** 
1. In VS Code: File → Open Folder
2. Navigate to the smash project (search for "smash" folder)
3. Likely locations: `/Users/mpr/Projects/smash` or `/Users/mpr/first/smash`
4. Open that folder, then Claude Code will work on the right files

**Also fixed:** `code .` command now opens VS Code instead of Cursor (ran Shell Command: Install 'code' command in PATH)

---

## 🟢 Low Priority (Non-blocking)

### 5. Chrome Extension Console Errors
**Problem:** "runtime.sendMessage" errors from MetaMask/wallet extensions.

**Impact:** None - these are harmless extension conflicts, not app bugs.

---

## ✅ Resolved This Session

- ~~Vercel env vars pointing to old database~~ → Updated to new project
- ~~Missing INSERT RLS policy~~ → Fixed in new schema
- ~~betting_enabled column missing~~ → Added
- ~~ends_at column missing~~ → Added
- ~~stakes_type column missing~~ → Added (pending cache refresh)