# CURRENT_ISSUES.md

> **Purpose**: Track known bugs, blockers, and tech debt. Check before starting any task.
> **Last Audit**: Feb 6, 2026

---

## Critical (Blocks Progress)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| — | *All critical issues resolved* | — | — |

---

## High (Fix This Sprint)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| — | *All high-priority issues resolved* | — | — |

---

## Medium (Tech Debt)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| ~~M1~~ | ~~4 TODO comments unaddressed~~ | — | Resolved Feb 6 - no TODOs remain |
| ~~M2~~ | ~~Placeholder console.logs~~ | — | Resolved Feb 6 - handlers now navigate to detail page |
| ~~M3~~ | ~~Unused `useStore` hook~~ | — | Resolved Feb 6 - file deleted |
| ~~M4~~ | ~~Unused `useSingleTokenBalance`~~ | — | Resolved Feb 6 - export removed |
| ~~M5~~ | ~~Participant status type mismatch~~ | — | Resolved Feb 6 - added `ParticipantStatus` type |
| ~~M6~~ | ~~UUID not validated in uuidToBytes32~~ | — | Resolved Feb 6 |

---

## Low (Nice to Have)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| ~~L1~~ | ~~Magic numbers throughout~~ | — | Resolved Feb 6 - created `src/lib/constants.ts` |
| ~~L2~~ | ~~Type confusion - dual Smash imports~~ | — | Resolved Feb 6 - renamed to `DbSmash`, `DbUser`, etc. |
| ~~L3~~ | ~~Form state persists after navigation~~ | — | Resolved Feb 6 - reset on unmount in create page |

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
| R11 | 8x `as any` type casts in DB operations | Replaced with `as never` + documentation comments. Root cause: Supabase types infer `never` for insert/update due to RLS. Fix requires `npx supabase gen types` with CLI auth. | Feb 6 |
| R12 | TODO comments unaddressed | Verified none remain in src/ | Feb 6 |
| R13 | Homepage Join/Bet handlers were stubs | Implemented navigation to detail page with tab param | Feb 6 |
| R14 | Unused `useStore` hook | Deleted `src/store/use-store.ts` - only `useCreateSmash` was used | Feb 6 |
| R15 | Unused `useSingleTokenBalance` export | Removed from `src/hooks/useTokenBalance.ts` | Feb 6 |
| R16 | Participant status type mismatch | Added `ParticipantStatus` type to `database.types.ts`, used in `queries.ts` | Feb 6 |
| R17 | Magic numbers throughout | Created `src/lib/constants.ts` with named constants | Feb 6 |
| R18 | Type confusion - dual Smash imports | Renamed DB types to `DbSmash`, `DbUser`, `DbSubmission`, `DbBet` | Feb 6 |
| R19 | Form state persists after navigation | Added `useEffect` cleanup in create page to reset on unmount | Feb 6 |

---

## Next Session Priority

*All tracked issues resolved. Consider:*
- Price oracle integration (replace `ETH_USD_FALLBACK_PRICE` constant)
- Supabase CLI auth for proper type generation
- Additional test coverage
