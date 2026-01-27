# Claude Browser/MCP Role - Smash.xyz

## Role Definition

Claude (via claude.ai with browser/MCP tools) handles:

- **Database work** - Running SQL in Supabase dashboard
- **Deployment checks** - Verifying Vercel deployments
- **External services** - Any browser-based admin tasks
- **Research** - Checking reference sites (poidh.xyz, etc.)
- **File creation** - Generating docs, specs, handoff files

## Project Context

**Project:** smash.xyz - Universal competitive challenge platform  
**Stack:** Next.js 14 + TypeScript + Tailwind + Privy + Supabase  
**Repo:** github.com/alpenflow-studios/smash  
**Live:** https://smash.xyz

### Key Resources

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm |
| Supabase SQL Editor | https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm/sql/new |
| Vercel Dashboard | https://vercel.com/classcoin/v0-smash-xyz |
| GitHub Repo | https://github.com/alpenflow-studios/smash |
| Base Sepolia Explorer | https://sepolia.basescan.org |

### Database Info

- **Project:** smash.xyz
- **Project ID:** pdjrexphjivdwfbvgbqm
- **Tables:** users, smashes, submissions, bets, payment_tokens, payment_transactions, smash_accepted_tokens

### Smart Contract (Deployed Session 8)

- **Contract:** SmashVault
- **Network:** Base Sepolia (Chain ID: 84532)
- **Address:** `0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De`
- **USDC Address:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Admin Wallet:** `0xAd4E23f274cdF74754dAA1Fb03BF375Db2eBf5C2`

### Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=https://pdjrexphjivdwfbvgbqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_SMASH_VAULT_ADDRESS=0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

## Workflow Split

| Task | Tool |
|------|------|
| Writing code | Claude Code Chat (VS Code) |
| Database changes | Claude MCP (this chat) |
| Deployment issues | Claude MCP (this chat) |
| Spec/doc creation | Either |
| Research/reference | Claude MCP (this chat) |


## ⚠️ KNOWN ISSUE: Chat Context Loss

Session 9 experienced **multiple chat context losses** during deep Supabase investigation. This caused loss of discovered fixes twice.

**Workaround for future sessions:**
- Create checkpoint handoff files frequently
- Stop at 75% token usage (not 65%)
- Document findings immediately before going deeper

---

## How to Start New MCP Session

Paste this context:
```
I'm building smash.xyz. You handle browser/MCP tasks:
- Supabase SQL at: https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm/sql/new
- Vercel at: https://vercel.com/classcoin/v0-smash-xyz
- SmashVault deployed at: 0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De (Base Sepolia)
- Reference: CLAUDE_MCP_ROLE.md in my repo

CURRENT ISSUE: "Failed to create smash" - need to:
1. Run column check on smashes table
2. Verify RLS INSERT policy exists
3. Add any missing columns or policies

IMPORTANT: Stop at 65% token usage and create SESSION_HANDOFF.MD file. Previous session had context loss issues.
- Prepare CURRENT_ISSUES.MD
- Prepare NEXT_STEPS.MD
-

[Then describe what you need done]
```

## Michael's Preferences

- Periodic token usage updates in chat
- **Notify at 75% usage** and create handoff file (updated from 65%)
- Step-by-step guidance (low-level developer learning blockchain)
- Uses Coinbase Wallet for funds, MetaMask for development
- Verify testnet contracts (skip for now but remind him, especially when critical)
- Stop and ask questions and preferences.
- Provide best practice suggestions; Mike is a low level developer but making progress.


---

*Last updated: Jan 23, 2026 - Session 9 (partial - context loss occurred)*
