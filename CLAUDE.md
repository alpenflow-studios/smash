# CLAUDE.md — SMASH Project Context

> **Project**: smash.xyz
> **Extends**: `~/.claude/CLAUDE.md` (global rules apply)

---

## Project Identity

- **Name**: SMASH
- **One-liner**: Universal competitive challenge platform with proof verification and prediction markets
- **Repo**: github.com/alpenflow-studios/smash
- **Live**: https://smash.xyz

---

## Quick Links

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm |
| Supabase SQL Editor | https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm/sql/new |
| Vercel Dashboard | https://vercel.com/classcoin/v0-smash-xyz |
| GitHub Repo | https://github.com/alpenflow-studios/smash |
| Base Sepolia Explorer | https://sepolia.basescan.org |

---

## Smart Contracts

| Contract | Address | Network |
|----------|---------|---------|
| SmashVault | `0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De` | Base Sepolia (84532) |
| USDC (testnet) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Base Sepolia (84532) |

**Admin Wallet**: `0xAd4E23f274cdF74754dAA1Fb03BF375Db2eBf5C2`

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://pdjrexphjivdwfbvgbqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>

# Chain / Contracts
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_SMASH_VAULT_ADDRESS=0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Auth
NEXT_PUBLIC_PRIVY_APP_ID=<your_privy_app_id>
```

---

## Tech Stack (SMASH-Specific)

> Overrides/extends global defaults where noted.

| Layer | Technology |
|-------|-----------|
| Auth | Privy (email, Google, wallet) |
| Database | Supabase (project ID: `pdjrexphjivdwfbvgbqm`) |
| Chain | Base Sepolia (84532) for dev, Base mainnet (8453) for prod |
| State | Zustand |

---

## Domain Concepts

### What is a Smash?
A **Smash** is a competitive challenge between 2+ participants where completion must be proven and verified through consensus. "Proof or it didn't happen" meets prediction markets.

### Smash Lifecycle
```
DRAFT → OPEN → ACTIVE → VERIFICATION → COMPLETE/DISPUTED
```

### Visibility
- **Public**: Anyone can view/join. Eligible for prediction market.
- **Private**: Invite-only. NOT eligible for prediction market.

### Stakes Types
- **Monetary**: USDC/ETH entry fee, winner takes pool
- **Prize**: Physical or digital prize from creator/sponsor
- **Bragging Rights**: Reputation only, no monetary value

### Consensus Methods
1. **Wearable Data** — Automatic via Strava, Apple Health, Garmin
2. **Visual Proof** — Photo/video upload (poidh.xyz style)
3. **Participant Agreement** — Multi-sig style approval
4. **Audience Voting** — Decentralized crowd decision
5. **Hybrid/Escalation** — Starts with participants, escalates if disputed

### Prediction Market Rules
- ✅ Only **public** smashes can have prediction markets
- ❌ Smash **participants cannot bet** on their own smash
- ✅ Outside observers can bet on any participant's success/failure

---

## Database Tables

Core tables in Supabase:
- `users` — User profiles
- `smashes` — Challenge definitions
- `submissions` — Proof submissions
- `bets` — Prediction market bets
- `payment_tokens` — Accepted payment tokens
- `payment_transactions` — Transaction records
- `smash_accepted_tokens` — Token whitelist per smash

---

## Before You Start Any Task

1. Read this file (automatic)
2. Check `SESSION_HANDOFF.md` for context from last session
3. Check `NEXT_STEPS.md` for current priorities
4. Check `CURRENT_ISSUES.md` for known blockers
5. For feature work, read `docs/PRD.md` (formerly `SMASH_SPEC.md`)

| Task Type | Read First |
|-----------|------------|
| Feature work | `docs/PRD.md` |
| Smart contracts | `docs/CONTRACTS.md` |
| Database changes | Supabase dashboard (link above) |
| System design | `docs/ARCHITECTURE.md` |
| Web3 commands | `docs/WEB3_COMMANDS.md` |

---

## Related Documents

| Document | Path | Notes |
|----------|------|-------|
| Product Requirements | `docs/PRD.md` | Full smash spec, lifecycle, schema |
| Session Handoff | `SESSION_HANDOFF.md` | Context for next session |
| Current Issues | `CURRENT_ISSUES.md` | Known bugs and blockers |
| Next Steps | `NEXT_STEPS.md` | Current priorities |

---

## Known Issues (Historical)

- **Session 9**: Multiple chat context losses during deep Supabase investigation. Workaround: create checkpoint files frequently, stop at 75% usage.
- **RLS Policies**: Have caused "Failed to create smash" errors in the past. Check INSERT policies if this recurs.

---

*Last updated: Feb 2026*
