# CURRENT_ISSUES.md

> **Purpose**: Track known bugs, blockers, and tech debt. Check before starting any task.
> **Last Audit**: Feb 6, 2026

---

## Critical (Blocks Progress)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| C2 | **8x `as any` type casts in DB operations** | `src/lib/queries.ts` | Lines 164, 299, 394, 426, 439, 468, 527 + StepReview.tsx:96 |

---

## High (Fix This Sprint)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| — | *All high-priority issues resolved* | — | — |

---

## Medium (Tech Debt)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| M1 | 4 TODO comments unaddressed | `src/app/smash/[id]/page.tsx`, `queries.ts` | See audit for details |
| M2 | Placeholder console.logs | `src/app/page.tsx:112-113` | Join/Bet handlers are stubs |
| M3 | Unused `useStore` hook | `src/store/use-store.ts` | Only `useCreateSmash` used |
| M4 | Unused `useSingleTokenBalance` | `src/hooks/useTokenBalance.ts:89-102` | Exported but never imported |
| M5 | Participant status type mismatch | `database.types.ts` vs `queries.ts:325` | DB allows any string, code expects enum |
| ~~M6~~ | ~~UUID not validated in uuidToBytes32~~ | — | Resolved Feb 6 |

---

## Low (Nice to Have)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| L1 | Magic numbers throughout | Multiple files | File size (50MB), step count (8), padding (64) |
| L2 | Type confusion - dual Smash imports | `src/lib/queries.ts:1-3` | `Smash as DbSmash` and `Smash` |
| L3 | Form state persists after failed submission | `src/store/use-create-smash.ts` | Need reset on navigation/error |

---

## Resolved (Recent)

| # | Issue | Resolution | Date |
|---|-------|------------|------|
| R1 | Database schema mismatch | Added missing columns, changed creator_id to TEXT | Jan 26 |
| R2 | Missing RLS INSERT policy | Fixed in new schema | Jan 26 |
| R3 | Project folder confusion | Correct path: `.github/workflows/smash` | Jan 26 |
| R4 | Docs disorganized | Created CLAUDE.md, docs/, tasks/ structure | Feb 5 |
| R5 | Payment amount not recorded | Added `amount` param to `joinSmashWithPayment()` flow | Feb 6 |
| R6 | Entry fees hardcoded | Added `getAcceptedTokensForSmash()`, dynamic fee loading | Feb 6 |
| R7 | Memory leak in ProofUploadDialog | Added `URL.revokeObjectURL()` in cleanup paths | Feb 6 |
| R8 | Missing null check on fees | Wrapped payment flow in try-catch | Feb 6 |
| R9 | Error not caught in approveUSDC flow | Wrapped payment flow in try-catch | Feb 6 |
| R10 | UUID not validated in uuidToBytes32 | Added UUID regex validation | Feb 6 |

---

## Next Session Priority

1. **Address C2** - Replace `as any` casts with proper types (requires Supabase type regen)
2. **Fix M1** - Address remaining TODO comments
3. **Fix M2** - Implement Join/Bet handlers (currently console.log stubs)
