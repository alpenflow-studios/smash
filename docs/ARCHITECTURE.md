# ARCHITECTURE.md — System Design

> **Version**: 1.0.0
> **Project**: SMASH

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                   │
│  ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────────┐   │
│  │  Web App  │   │   PWA    │   │  Farcaster  │   │  Base App    │   │
│  │ (Next.js) │   │ (Mobile) │   │  Mini App   │   │  Mini App    │   │
│  └─────┬─────┘   └─────┬────┘   └──────┬──────┘   └──────┬───────┘   │
└────────┼───────────────┼───────────────┼────────────────┼───────────┘
         │               │               │                │
         ▼               ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API LAYER (Next.js)                           │
│  /api/auth/*     /api/[feature]/*     /api/ai/*     /api/chain/*     │
└─────────────────────────────────────────────────────────────────────┘
         │               │               │               │
         ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │   Postgres    │  │  Redis   │  │  IPFS    │  │  Base Chain   │     │
│  │  (Supabase)   │  │(Upstash) │  │(optional)│  │  (8453)       │     │
│  └──────────────┘  └──────────┘  └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

Wallet-first authentication via Privy. Supports email, Google, and wallet connections.

```
User clicks "Connect Wallet"
    │
    ▼
Privy handles connection (WalletConnect / Coinbase / Injected / Email / Google)
    │
    ▼
Client gets wallet address (embedded or external)
    │
    ▼
Wallet address used as user identifier
    │
    ▼
Authenticated session established
```

---

## Data Model (Postgres/Supabase)

### Core Tables

```sql
-- Users (canonical identity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Smashes (challenges)
CREATE TABLE smashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft',
    visibility TEXT DEFAULT 'public',
    stakes_type TEXT DEFAULT 'monetary',
    entry_fee NUMERIC,
    prize_pool NUMERIC,
    creator_id TEXT,
    max_participants INT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    verification_method TEXT DEFAULT 'visual',
    consensus_threshold INT DEFAULT 100,
    dispute_window_hours INT DEFAULT 24,
    betting_enabled BOOLEAN DEFAULT false,
    invite_code TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Participants
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID REFERENCES smashes(id),
    user_id UUID REFERENCES users(id),
    wallet_address TEXT,
    joined_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'joined'
);

-- Submissions (proofs)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID REFERENCES smashes(id),
    participant_id UUID REFERENCES participants(id),
    proof_url TEXT,
    proof_type TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'pending'
);
```

---

## Smart Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SmashVault.sol                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  - joinWithETH(bytes32 smashId)                              │    │
│  │  - joinWithUSDC(bytes32 smashId, uint256 amount)            │    │
│  │  - withdrawBeforeStart(bytes32 smashId)                      │    │
│  │  - payoutWinners(bytes32 smashId, address[] winners)        │    │
│  │  - cancelSmash(bytes32 smashId)                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                      │
│                               ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Storage                                                     │    │
│  │  - smashEntryFees[smashId][token] → uint256                 │    │
│  │  - participants[smashId] → address[]                        │    │
│  │  - participantDeposits[smashId][addr][token] → uint256      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Caching Strategy

| Data | Store | TTL |
|------|-------|-----|
| User session | Privy | Session |
| Token balance | Client (viem) | 15s |
| Smash list | TanStack Query | 30s |
| Smash detail | TanStack Query | 60s |

---

## File Storage

| Content | Store | Access |
|---------|-------|--------|
| Cover images | Supabase Storage | Public |
| Proof uploads | Supabase Storage | Public |
| User avatars | Supabase Storage | Public |

---

## Monitoring

| Tool | What It Monitors |
|------|------------------|
| Sentry | Frontend + API errors |
| PostHog | User analytics |
| Vercel Analytics | Performance metrics |
| Supabase Dashboard | Database metrics |
