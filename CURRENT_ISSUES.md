# CURRENT_ISSUES.md

> **Purpose**: Track known bugs, blockers, and tech debt. Check before starting any task.
> **Last Audit**: Feb 8, 2026 (session 3)

---

## Critical (Blocks Progress)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| — | None | — | All code complete, build passes, env vars set |

---

## High (Fix This Sprint)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| H3 | `update_updated_at` function security | Supabase DB | Mutable search_path. Needs `SET search_path = public`. Fix in SQL Editor. |

---

## Medium (Tech Debt)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| M1 | Storage bucket may not exist on new project | Supabase | `smash-proofs` bucket needed for proof uploads + cover images. Check dashboard. |
| M2 | Payment tokens not seeded | Supabase | ETH/USDC records needed in `payment_tokens` table for join-with-payment |
| M3 | Old project data not migrated | Supabase | Any data in old project needs migration to `utbkhzooafzepabtrhnc` |
| M4 | All changes uncommitted | git | Sessions 2+3 changes need to be committed |

---

## Low (Nice to Have)

| # | Issue | File/Area | Notes |
|---|-------|-----------|-------|
| L1 | `as never` type assertions | API routes + queries.ts | Needed for Supabase insert due to RLS type inference |
| L2 | No test coverage | Project-wide | `npm test` not configured |
| L3 | `getUser(userId)` deprecated in Privy | `src/lib/auth.ts` | Works but has rate limits at scale. Migrate to `getUser({idToken})` later. |

---

## Resolved (Recent)

| # | Issue | Resolution | Date |
|---|-------|------------|------|
| C1 | Build broken (SmashParticipant type) | Fixed type to SmashParticipantFrontend | Feb 8 |
| C2 | Phase 5 client updates not done | All 4 files updated to use API routes | Feb 8 |
| H1 | Supabase CLI token exposed | User regenerated token | Feb 8 |
| H2 | RLS security — direct client writes | Server-side API routes complete (Phases 1-5) | Feb 8 |
| H4 | CLAUDE.md references old project | Updated all 4 occurrences to `utbkhzooafzepabtrhnc` | Feb 8 |
| H5 | Frontend types don't match V3 lifecycle | Added `closed`, `judging`, `payout` + `SmashMode` type | Feb 8 |
| H6 | Env vars not added | All env vars set in .env.local (JWT format) | Feb 8 |

---

## Next Session Priority

1. **End-to-end testing** — `npm run dev` and test full flow
2. **M1** — Verify smash-proofs storage bucket
3. **M2** — Seed payment tokens
4. **M4** — Commit all changes
5. **H3** — Fix update_updated_at search_path
