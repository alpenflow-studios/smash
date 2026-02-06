# CURRENT_ISSUES.md

> **Purpose**: Track known bugs, blockers, and tech debt. Check before starting any task.
> **Last Audit**: Feb 5, 2026

---

## Critical (Blocks Progress)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| C1 | **Payment amount not recorded** | `src/lib/queries.ts:445` | `amount: '0'` hardcoded - breaks transaction audit trail |
| C2 | **7x `as any` type casts in DB operations** | `src/lib/queries.ts` | Lines 164, 299, 394, 426, 439, 468 + StepReview.tsx:96 |

---

## High (Fix This Sprint)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| H1 | Entry fees hardcoded | `src/app/smash/[id]/page.tsx:204-205` | Should fetch from `smash_accepted_tokens` table |
| H2 | Memory leak - URL.createObjectURL | `src/components/proof/ProofUploadDialog.tsx:70` | Never revoked |
| H3 | Missing null check on fees | `src/components/payment/PaymentButton.tsx:59` | No validation before passing to handlers |
| H4 | Error not caught in approveUSDC flow | `src/hooks/usePayment.ts:83` | `needsUSDCApproval()` can throw |

---

## Medium (Tech Debt)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| M1 | 4 TODO comments unaddressed | `src/app/smash/[id]/page.tsx`, `queries.ts` | See audit for details |
| M2 | Placeholder console.logs | `src/app/page.tsx:112-113` | Join/Bet handlers are stubs |
| M3 | Unused `useStore` hook | `src/store/use-store.ts` | Only `useCreateSmash` used |
| M4 | Unused `useSingleTokenBalance` | `src/hooks/useTokenBalance.ts:89-102` | Exported but never imported |
| M5 | Participant status type mismatch | `database.types.ts` vs `queries.ts:325` | DB allows any string, code expects enum |
| M6 | UUID not validated in uuidToBytes32 | `src/hooks/usePayment.ts:25-27` | Could produce invalid bytes32 |

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

---

## Next Session Priority

1. **Fix C1** - Payment amount recording (critical data loss)
2. **Fix H1** - Fetch entry fees from DB instead of hardcoding
3. **Address C2** - Replace `as any` casts with proper types
