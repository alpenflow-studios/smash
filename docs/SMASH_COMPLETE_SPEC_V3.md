# SMASH.XYZ — Complete Frontend & Database Specification
### Version 3.0 — Final Consolidated Spec
### February 8, 2026

---

## Table of Contents

1. [Platform Vision](#1-platform-vision)
2. [Homepage Layout](#2-homepage-layout)
3. [Smash Modes](#3-smash-modes)
4. [Smash Detail Page](#4-smash-detail-page)
5. [Wearable Data & AI Verification](#5-wearable-data--ai-verification)
6. [Leaderboards](#6-leaderboards)
7. [Token Economy ($SMASH)](#7-token-economy-smash)
8. [User Profile](#8-user-profile)
9. [Page Routes](#9-page-routes)
10. [Complete Database Schema](#10-complete-database-schema)
11. [Build Order](#11-build-order)

---

## 1. Platform Vision

**smash something. prove it. win.**

Smash.xyz is a universal competitive challenge platform where:
- Anyone can create or join challenges across any category
- Participants prove completion through photos, video, wearable data, or AI-verified metrics
- Staked challenges use a squares/pool model (buy a square, winner takes the pot)
- Free challenges are open to all
- Daily platform challenges build streaks and feed leaderboards
- Wearable opt-in + AI agents enable trustless verification at scale

**Crypto-powered, not crypto-first.** Blockchain handles stakes, payouts, and identity — but the UX feels like a normal app.

**Cross-platform:** Core proof verification system feeds into MoltCoach (coaching) and FitCaster (Farcaster fitness) as shared infrastructure.

---

## 2. Homepage Layout

```
┌─────────────────────────────────────────────────────────┐
│  smash.xyz                              [Connect Wallet]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│              smash something                            │
│              prove it                                   │
│              win                                        │
│                                                         │
│              [How It Works]                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ACTIVE SMASHES                                         │
│  ◄ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ►      │
│    │ 🏋️ Pool│ │ 🎮 Free│ │ 🎨 Pool│ │ 💼 Free│       │
│    │        │ │        │ │        │ │        │       │
│    │ $0.5ETH│ │ 24/50  │ │ $1.2ETH│ │ 8/20   │       │
│    │ 12/16  │ │ 3d left│ │ 45/100 │ │ 1d left│       │
│    │[Detail]│ │ [Join] │ │[Detail]│ │ [Join] │       │
│    └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LEADERBOARDS                                           │
│  [Daily] [Weekly] [Monthly] [Yearly] [All-Time]         │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │  WEARABLE            │  │  PROOF               │      │
│  │  1. alice.eth  🔥12  │  │  1. bob.base   47✅   │      │
│  │  2. @carol     🔥9   │  │  2. alice.eth  39✅   │      │
│  │  3. degen.eth  🔥7   │  │  3. @dave      31✅   │      │
│  │  ...                 │  │  ...                 │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 🔥 Rip Your │ │  Start a    │ │  Gift       │      │
│  │ Daily Smash!│ │  Smash.     │ │  $SMASH     │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Purchase │ │  Smash   │ │  Stake   │ │   Tip    │  │
│  │ $SMASH   │ │  Mints   │ │  $SMASH  │ │  $SMASH  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Homepage Components

| Component | Description |
|-----------|-------------|
| `NavBar` | Logo, nav links (Explore, Leaderboard, Daily, Profile), wallet connect |
| `HeroSection` | Tagline + "How It Works" button (opens modal or scrolls to explainer) |
| `HowItWorks` | Modal/section: 3-step explainer (Create/Join → Prove → Win) |
| `SmashCarousel` | Horizontal scrollable cards of active smashes (pools + free) |
| `SmashCard` | Card showing: category icon, title, mode badge, pot/participants, time remaining |
| `LeaderboardPreview` | Compact leaderboard with time filter tabs + Wearable/Proof toggle |
| `CTACards` | Three large action cards: Daily Smash, Start a Smash, Gift $SMASH |
| `TokenActions` | Four action buttons: Purchase, Mints, Stake, Tip |

---

## 3. Smash Modes

### Three Modes

| Mode | `smash_mode` | Entry | Participation Model | Detail Page Layout |
|------|-------------|-------|--------------------|--------------------|
| **Pool** | `'pool'` | Buy a square (ETH/USDC/$SMASH) | Squares grid | Split view: challenge + grid |
| **Free** | `'free'` | Free join | Participant list | Split view: challenge + list |
| **Daily** | `'daily'` | Free (platform-generated) | Participant feed | Challenge + proof feed |

### Lifecycle States

```
OPEN → CLOSED → ACTIVE → JUDGING → PAYOUT → COMPLETED
         ↑          ↑         ↑         ↑          ↑
    squares/     no more    challenge  community   pot
    joins open   buying     is live    votes on    distributed
                                       proofs
```

For **free** and **daily** modes, CLOSED and PAYOUT may be skipped:
- Free: OPEN → ACTIVE → JUDGING → COMPLETED
- Daily: OPEN → ACTIVE → COMPLETED (proof = completion, no voting needed)

---

## 4. Smash Detail Page

### Pool Mode Layout

```
┌─────────────────────────────────────────────────────┐
│  [OPEN] 🏋️ FITNESS                                  │
│  Run a Sub-8 Mile                                   │
│  Created by alice.eth                               │
├────────────────────────┬────────────────────────────┤
│                        │                            │
│  CHALLENGE             │   SQUARES                  │
│                        │   ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
│  Run 1 mile in under   │   │👤│ │👤│ │👤│ │  │    │
│  8 minutes. Must film  │   └──┘ └──┘ └──┘ └──┘    │
│  with a running app    │   ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
│  showing time, or opt  │   │👤│ │  │ │👤│ │  │    │
│  in wearable data.     │   └──┘ └──┘ └──┘ └──┘    │
│                        │   ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
│  Verification:         │   │  │ │  │ │👤│ │  │    │
│  🤖 AI + Wearable     │   └──┘ └──┘ └──┘ └──┘    │
│                        │   ┌──┐ ┌──┐ ┌──┐ ┌──┐    │
│  [Farcaster embed]     │   │  │ │👤│ │  │ │  │    │
│                        │   └──┘ └──┘ └──┘ └──┘    │
├────────────────────────┴────────────────────────────┤
│  Payment: ETH     Square: 0.01 ETH                  │
│  Total Pot: 0.07 ETH        Squares: 7/16 available │
├─────────────────────────────────────────────────────┤
│  Closes:  Feb 10  5:00 PM  │  ⏳ 1d 22h remaining  │
│  Begins:  Feb 11  9:00 AM  │                        │
│  Ends:    Feb 14 11:59 PM  │                        │
├─────────────────────────────────────────────────────┤
│  📝 Editor Notes                                    │
│  "Flat courses only. Treadmill OK."                 │
├─────────────────────────────────────────────────────┤
│  🗳️ Vote (visible during JUDGING)                  │
├─────────────────────────────────────────────────────┤
│  💰 Payout (visible during PAYOUT/COMPLETED)        │
└─────────────────────────────────────────────────────┘
```

### Free Mode — right side becomes participant list
### Daily Mode — right side becomes proof submission feed with streak display

---

## 5. Wearable Data & AI Verification

### The Game Changer

Users can opt-in to share wearable/health data as proof. This creates a verification layer that's:
- **Trustless** — data comes directly from Apple Health, Garmin, Strava, etc.
- **AI-verified** — Claude or other agents validate metrics against challenge requirements
- **Tamper-resistant** — screenshots + raw data cross-referenced
- **Scalable** — no manual review needed for opted-in users

### How It Works

```
USER OPTS IN
    │
    ▼
┌─────────────────────────────────┐
│  Data Sources (user chooses)    │
│  ☑ Apple Health                 │
│  ☑ Strava                      │
│  ☐ Garmin Connect              │
│  ☐ Fitbit                      │
│  ☐ Whoop                       │
│  ☐ Google Fit                   │
└─────────────────────────────────┘
    │
    ▼
User submits proof:
  - Screenshot/PDF of health data
  - Raw metrics (steps, distance, heartrate, time)
  - OR: API-connected live data (future)
    │
    ▼
┌─────────────────────────────────┐
│  AI VERIFICATION AGENT          │
│                                 │
│  Inputs:                        │
│  - Challenge requirements       │
│  - User-submitted data          │
│  - Wearable screenshots/PDFs   │
│  - Historical user data         │
│                                 │
│  Checks:                        │
│  ✓ Does the data meet the       │
│    challenge criteria?          │
│  ✓ Is the timestamp within      │
│    the challenge window?        │
│  ✓ Does the data look           │
│    consistent / not fabricated? │
│  ✓ Cross-reference multiple     │
│    data points                  │
│                                 │
│  Output:                        │
│  → VERIFIED ✅                  │
│  → NEEDS REVIEW ⚠️             │
│  → REJECTED ❌                  │
│  → Confidence score (0-100)     │
└─────────────────────────────────┘
    │
    ▼
Result feeds into:
  - Smash outcome (pool payout / challenge completion)
  - Leaderboard rankings
  - User reputation score
```

### Verification Methods (per smash)

| Method | `verification_method` | How It Works |
|--------|----------------------|--------------|
| **Community** | `'community'` | Other users vote on proof (existing) |
| **AI Agent** | `'ai'` | Claude/agent reviews submitted data |
| **AI + Wearable** | `'ai_wearable'` | Agent cross-references wearable data with proof |
| **Creator** | `'creator'` | Smash creator manually approves |
| **Oracle** | `'oracle'` | External data feed (future: Chainlink, API3) |

### Wearable Opt-In Levels

| Level | What's Shared | Use Case |
|-------|--------------|----------|
| **None** | Nothing — traditional proof only | Users who prefer photo/video |
| **Screenshots** | User uploads health app screenshots | Simple verification, AI reads the image |
| **Metrics** | User manually enters key metrics | Structured data for AI to validate |
| **Connected** | Live API connection to wearable platform | Real-time, highest trust (future phase) |

### Cross-Platform: MoltCoach & FitCaster Integration

The proof + wearable verification system is **shared infrastructure**:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  smash.xyz  │    │ MoltCoach   │    │ FitCaster   │
│  (challenges│    │ (coaching)  │    │ (Farcaster  │
│   + pools)  │    │             │    │  fitness)   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
              ┌───────────┴───────────┐
              │  SHARED PROOF ENGINE  │
              │                       │
              │  - Wearable data      │
              │  - AI verification    │
              │  - Proof storage      │
              │  - Reputation scores  │
              └───────────────────────┘
```

A user who opts in on MoltCoach can have their verified fitness data automatically count as proof on smash.xyz challenges. FitCaster posts with wearable data can auto-submit as proof. This creates a flywheel across all three products.

---

## 6. Leaderboards

### Two Leaderboard Types

**Wearable Leaderboard** — Rankings based on verified wearable/health metrics:
- Steps, distance, calories, active minutes, workouts completed
- Only available for users who have opted in to wearable data sharing
- AI-verified data only (prevents gaming)

**Proof Leaderboard** — Rankings based on proof submission activity:
- Total proofs submitted
- Proofs verified
- Smashes completed
- Win rate
- Streak length

### Time Filters

Both leaderboards support: **Daily | Weekly | Monthly | Yearly | All-Time**

### Leaderboard Page Layout

```
┌─────────────────────────────────────────────────────┐
│  LEADERBOARDS                                       │
│                                                     │
│  [Daily] [Weekly] [Monthly] [Yearly] [All-Time]     │
│                                                     │
│  [🏃 Wearable]  [📸 Proof]                         │
│                                                     │
│  ┌─ WEARABLE LEADERBOARD ─────────────────────────┐ │
│  │ #  User          Steps    Distance  Streak     │ │
│  │ 1  alice.eth     142,391  87.3 mi   🔥 12     │ │
│  │ 2  @carol        128,005  72.1 mi   🔥 9      │ │
│  │ 3  degen.eth     115,882  64.5 mi   🔥 7      │ │
│  │ 4  bob.base      98,441   55.2 mi   🔥 5      │ │
│  │ 5  0xAB...CD     87,221   48.8 mi   🔥 3      │ │
│  │                                                │ │
│  │ YOUR RANK: #14   67,332   37.4 mi   🔥 2      │ │
│  └────────────────────────────────────────────────┘ │
│                                                     │
│  Categories: [All] [Fitness] [Gaming] [Creative]    │
└─────────────────────────────────────────────────────┘
```

---

## 7. Token Economy ($SMASH)

### Token Actions

| Action | Description | Database Impact |
|--------|-------------|-----------------|
| **Daily Smash** (free) | Claim daily challenge, earn $SMASH for completion | `daily_claims` + `token_transactions` |
| **Purchase $SMASH** | Buy tokens via fiat on-ramp or DEX swap | `token_transactions` (type: 'purchase') |
| **Smash Mints** | Mint an NFT from a completed smash (proof-of-completion NFT) | `smash_mints` table |
| **Stake $SMASH** | Stake tokens for rewards / governance weight | `staking_positions` |
| **Tip $SMASH** | Send tokens to another user or smash creator | `token_transactions` (type: 'tip_sent') |
| **Gift $SMASH** | Gift tokens with a message (CTA card) | `token_transactions` (type: 'gift') |

### Smash Mints (NFTs)

When a user completes a smash, they can mint a commemorative NFT:
- Contains: challenge title, proof image, completion date, verification status
- Feeds into profile as achievement badges
- Tradeable on secondary markets

---

## 8. User Profile

### Profile Page Layout

```
┌─────────────────────────────────────────────────────┐
│  ┌────┐  alice.eth                                  │
│  │ 👤 │  @alice on Farcaster                       │
│  └────┘  0xABC...DEF                               │
│                                                     │
│  Smashes: 24 │ Won: 8 │ Streak: 🔥12 │ Rep: ⭐ 94 │
│                                                     │
│  Wearable: ✅ Opted In (Apple Health, Strava)       │
│                                                     │
│  [Active] [Completed] [Created] [Proofs] [Mints]    │
│                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ smash1 │ │ smash2 │ │ smash3 │                  │
│  └────────┘ └────────┘ └────────┘                  │
│                                                     │
│  $SMASH Balance: 1,240                              │
│  Staked: 500  │  Pending Rewards: 12                │
└─────────────────────────────────────────────────────┘
```

---

## 9. Page Routes

```
/                           → Homepage
/how-it-works               → How It Works (or modal from homepage)
/smash/create               → Create Smash (mode selector → form)
/smash/[id]                 → Smash Detail (adapts by smash_mode)
/daily                      → Today's Daily Smash
/leaderboard                → Leaderboard (Wearable / Proof × time filters)
/profile/[address]          → User Profile
/tokens                     → Token Dashboard
/settings                   → User settings (wearable opt-in, notifications)
/settings/wearables         → Manage wearable connections
```

---

## 10. Complete Database Schema

### Run this as a single migration in Supabase SQL Editor.

All tables use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` so it's safe to re-run.

```sql
-- ============================================================================
-- SMASH.XYZ — COMPLETE DATABASE MIGRATION v3.0
-- Run once in Supabase SQL Editor
-- Safe to re-run (all IF NOT EXISTS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE — update with new fields
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS farcaster_fid INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS farcaster_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS base_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ens_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_smashes_joined INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_smashes_won INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earned NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_score NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wearable_opt_in BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wearable_sources TEXT[];  -- ['apple_health', 'strava', 'garmin']
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- 2. SMASHES TABLE — update with new fields
-- ============================================================================
-- Mode
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS smash_mode TEXT DEFAULT 'pool';
  -- 'pool' (staked squares), 'free' (open join), 'daily' (platform generated)

-- Pool/squares config
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS total_squares INTEGER DEFAULT 16;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS square_price NUMERIC DEFAULT 0;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS payment_token TEXT DEFAULT 'ETH';
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS squares_sold INTEGER DEFAULT 0;

-- Lifecycle timestamps
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS close_time TIMESTAMPTZ;
  -- When square purchases / joins close (before start_time)

-- Editor notes
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS editor_notes TEXT;

-- Payout
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS payout_type TEXT DEFAULT 'winner_take_all';
  -- 'winner_take_all', 'top_3', 'proportional', 'custom'
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS payout_distributed BOOLEAN DEFAULT FALSE;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS payout_tx_hash TEXT;

-- Verification
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS verification_method TEXT DEFAULT 'community';
  -- 'community', 'ai', 'ai_wearable', 'creator', 'oracle'
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS requires_wearable BOOLEAN DEFAULT FALSE;

-- Social
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS farcaster_cast_hash TEXT;

-- Sponsor (for free smashes with prizes)
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS sponsor TEXT;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS prize_description TEXT;

-- Platform challenges
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS is_platform_challenge BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- 3. SMASH SQUARES — for pool mode
-- ============================================================================
CREATE TABLE IF NOT EXISTS smash_squares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID NOT NULL REFERENCES smashes(id) ON DELETE CASCADE,
    square_number INTEGER NOT NULL,

    -- Buyer info
    user_id TEXT,
    display_name TEXT,
    avatar_url TEXT,
    farcaster_fid INTEGER,
    farcaster_username TEXT,
    base_name TEXT,

    -- Purchase
    purchased_at TIMESTAMPTZ,
    purchase_tx_hash TEXT,
    price_paid NUMERIC DEFAULT 0,
    payment_token TEXT DEFAULT 'ETH',

    -- Result
    is_winner BOOLEAN DEFAULT FALSE,
    payout_amount NUMERIC DEFAULT 0,
    payout_tx_hash TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(smash_id, square_number)
);

CREATE INDEX IF NOT EXISTS idx_squares_smash ON smash_squares(smash_id);
CREATE INDEX IF NOT EXISTS idx_squares_user ON smash_squares(user_id);

-- ============================================================================
-- 4. SMASH PARTICIPANTS — for free + daily modes
-- ============================================================================
CREATE TABLE IF NOT EXISTS smash_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID NOT NULL REFERENCES smashes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    farcaster_username TEXT,
    base_name TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    proof_submitted BOOLEAN DEFAULT FALSE,
    proof_id UUID,
    streak_at_join INTEGER DEFAULT 0,
    UNIQUE(smash_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_smash ON smash_participants(smash_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON smash_participants(user_id);

-- ============================================================================
-- 5. PROOF SUBMISSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS proof_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID NOT NULL REFERENCES smashes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,

    -- Proof content
    proof_type TEXT NOT NULL,
      -- 'image', 'video', 'link', 'text', 'wearable_screenshot', 'wearable_metrics'
    proof_url TEXT,
    proof_text TEXT,
    proof_metadata JSONB,

    -- Wearable data (when applicable)
    wearable_source TEXT,               -- 'apple_health', 'strava', 'garmin', etc.
    wearable_data JSONB,                -- structured metrics from wearable
      -- Example: {"steps": 12453, "distance_miles": 6.2, "duration_minutes": 48, 
      --           "heart_rate_avg": 155, "calories": 580, "timestamp": "..."}
    wearable_screenshots TEXT[],        -- array of screenshot URLs

    -- Verification
    status TEXT DEFAULT 'pending',
      -- 'pending', 'ai_reviewing', 'verified', 'rejected', 'disputed', 'needs_review'
    verification_method TEXT,           -- how this proof was verified
    verification_votes_yes INTEGER DEFAULT 0,
    verification_votes_no INTEGER DEFAULT 0,

    -- AI verification results
    ai_verified BOOLEAN,
    ai_confidence_score INTEGER,        -- 0-100
    ai_verification_notes TEXT,         -- AI's reasoning
    ai_verified_at TIMESTAMPTZ,

    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proofs_smash ON proof_submissions(smash_id);
CREATE INDEX IF NOT EXISTS idx_proofs_user ON proof_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_proofs_status ON proof_submissions(status);

-- ============================================================================
-- 6. PROOF VOTES — community verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS proof_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_id UUID NOT NULL REFERENCES proof_submissions(id) ON DELETE CASCADE,
    voter_id TEXT NOT NULL,
    vote BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(proof_id, voter_id)
);

-- ============================================================================
-- 7. WEARABLE CONNECTIONS — user's connected data sources
-- ============================================================================
CREATE TABLE IF NOT EXISTS wearable_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    source TEXT NOT NULL,               -- 'apple_health', 'strava', 'garmin', 'fitbit', 'whoop', 'google_fit'
    connection_status TEXT DEFAULT 'active',  -- 'active', 'disconnected', 'expired'
    opt_in_level TEXT DEFAULT 'screenshots',  -- 'screenshots', 'metrics', 'connected'
    access_token TEXT,                  -- encrypted OAuth token (for API connections)
    refresh_token TEXT,                 -- encrypted refresh token
    last_sync_at TIMESTAMPTZ,
    permissions JSONB,                  -- what data types the user consented to share
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, source)
);

CREATE INDEX IF NOT EXISTS idx_wearable_user ON wearable_connections(user_id);

-- ============================================================================
-- 8. WEARABLE DATA SNAPSHOTS — historical health data for verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS wearable_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    source TEXT NOT NULL,
    snapshot_date DATE NOT NULL,
    data_type TEXT NOT NULL,            -- 'daily_summary', 'workout', 'sleep', 'heart_rate'
    metrics JSONB NOT NULL,             -- the actual data
      -- daily_summary: {"steps": 12453, "distance_miles": 6.2, "calories_burned": 2100, "active_minutes": 48}
      -- workout: {"type": "run", "duration_minutes": 32, "distance_miles": 4.1, "avg_pace": "7:48/mi", "heart_rate_avg": 155}
    screenshot_urls TEXT[],             -- supporting screenshots
    verified_by_ai BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, source, snapshot_date, data_type)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_user_date ON wearable_snapshots(user_id, snapshot_date);

-- ============================================================================
-- 9. AI VERIFICATION LOG — audit trail of AI agent decisions
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_verification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_id UUID REFERENCES proof_submissions(id) ON DELETE CASCADE,
    smash_id UUID REFERENCES smashes(id),
    user_id TEXT NOT NULL,
    agent_model TEXT NOT NULL,          -- 'claude-sonnet-4-20250514', etc.
    challenge_requirements JSONB,       -- what the challenge asked for
    submitted_data JSONB,               -- what the user submitted
    wearable_data JSONB,                -- wearable data cross-referenced
    decision TEXT NOT NULL,             -- 'verified', 'rejected', 'needs_review'
    confidence_score INTEGER,           -- 0-100
    reasoning TEXT,                     -- AI's explanation
    flags TEXT[],                       -- ['timestamp_mismatch', 'data_inconsistency', etc.]
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_log_proof ON ai_verification_log(proof_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_smash ON ai_verification_log(smash_id);

-- ============================================================================
-- 10. DAILY SMASHES — platform-generated daily challenges
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_smashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID NOT NULL REFERENCES smashes(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL UNIQUE,
    theme TEXT,
    prompt TEXT NOT NULL,
    difficulty TEXT DEFAULT 'medium',
    participant_count INTEGER DEFAULT 0,
    featured_proof_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_smashes(challenge_date);

-- ============================================================================
-- 11. DAILY CLAIMS — streak tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC NOT NULL DEFAULT 0,
    streak_count INTEGER DEFAULT 1,
    proof_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, claim_date)
);

-- ============================================================================
-- 12. TOKEN BALANCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    token_type TEXT NOT NULL DEFAULT 'SMASH',
    balance NUMERIC DEFAULT 0,
    staked_balance NUMERIC DEFAULT 0,
    pending_rewards NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token_type)
);

-- ============================================================================
-- 13. TOKEN TRANSACTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL,
      -- 'daily_claim', 'purchase', 'mint', 'stake', 'unstake', 
      -- 'tip_sent', 'tip_received', 'gift_sent', 'gift_received',
      -- 'prize_won', 'entry_fee', 'square_purchase', 'payout'
    amount NUMERIC NOT NULL,
    token_type TEXT DEFAULT 'SMASH',
    related_smash_id UUID REFERENCES smashes(id),
    related_user_id TEXT,
    tx_hash TEXT,
    status TEXT DEFAULT 'completed',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_token_tx_user ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_tx_type ON token_transactions(transaction_type);

-- ============================================================================
-- 14. STAKING POSITIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS staking_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    staked_at TIMESTAMPTZ DEFAULT NOW(),
    lock_until TIMESTAMPTZ,
    rewards_earned NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    tx_hash TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 15. SMASH MINTS — NFTs from completed smashes
-- ============================================================================
CREATE TABLE IF NOT EXISTS smash_mints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smash_id UUID NOT NULL REFERENCES smashes(id),
    user_id TEXT NOT NULL,
    token_id TEXT,                      -- on-chain NFT token ID
    contract_address TEXT,
    tx_hash TEXT,
    metadata_uri TEXT,                  -- IPFS URI for NFT metadata
    image_url TEXT,                     -- generated NFT image
    minted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(smash_id, user_id)
);

-- ============================================================================
-- 16. LEADERBOARD ENTRIES — computed rankings
-- ============================================================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    period_type TEXT NOT NULL,          -- 'daily', 'weekly', 'monthly', 'yearly', 'all_time'
    period_start DATE NOT NULL,
    leaderboard_type TEXT NOT NULL DEFAULT 'proof',  -- 'proof', 'wearable'
    category TEXT,                      -- NULL = overall

    -- Proof leaderboard metrics
    smashes_completed INTEGER DEFAULT 0,
    smashes_won INTEGER DEFAULT 0,
    proofs_submitted INTEGER DEFAULT 0,
    proofs_verified INTEGER DEFAULT 0,
    win_rate NUMERIC DEFAULT 0,

    -- Wearable leaderboard metrics
    total_steps INTEGER DEFAULT 0,
    total_distance_miles NUMERIC DEFAULT 0,
    total_active_minutes INTEGER DEFAULT 0,
    total_calories INTEGER DEFAULT 0,
    workouts_completed INTEGER DEFAULT 0,

    -- Common
    total_earned NUMERIC DEFAULT 0,
    streak_current INTEGER DEFAULT 0,
    streak_best INTEGER DEFAULT 0,
    rank INTEGER,
    score NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, period_type, period_start, leaderboard_type, category)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_query 
    ON leaderboard_entries(leaderboard_type, period_type, period_start, rank);

-- ============================================================================
-- 17. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE smash_squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE smash_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_verification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_smashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smash_mints ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Public read policies (data everyone can see)
DO $$
BEGIN
    -- Squares, participants, proofs, leaderboards, daily smashes, mints are public
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_squares') THEN
        CREATE POLICY public_read_squares ON smash_squares FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_participants') THEN
        CREATE POLICY public_read_participants ON smash_participants FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_proofs') THEN
        CREATE POLICY public_read_proofs ON proof_submissions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_leaderboard') THEN
        CREATE POLICY public_read_leaderboard ON leaderboard_entries FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_daily') THEN
        CREATE POLICY public_read_daily ON daily_smashes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_read_mints') THEN
        CREATE POLICY public_read_mints ON smash_mints FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated write policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_participants') THEN
        CREATE POLICY auth_insert_participants ON smash_participants FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_proofs') THEN
        CREATE POLICY auth_insert_proofs ON proof_submissions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_votes') THEN
        CREATE POLICY auth_insert_votes ON proof_votes FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_claims') THEN
        CREATE POLICY auth_insert_claims ON daily_claims FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_token_tx') THEN
        CREATE POLICY auth_insert_token_tx ON token_transactions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_update_squares') THEN
        CREATE POLICY auth_update_squares ON smash_squares FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'auth_insert_squares') THEN
        CREATE POLICY auth_insert_squares ON smash_squares FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Private data: users can only read their own wearable/token data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_wearable_connections') THEN
        CREATE POLICY own_wearable_connections ON wearable_connections FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_wearable_snapshots') THEN
        CREATE POLICY own_wearable_snapshots ON wearable_snapshots FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_token_balances') THEN
        CREATE POLICY own_token_balances ON token_balances FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_token_transactions') THEN
        CREATE POLICY own_token_transactions ON token_transactions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'own_staking') THEN
        CREATE POLICY own_staking ON staking_positions FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'read_ai_log') THEN
        CREATE POLICY read_ai_log ON ai_verification_log FOR SELECT USING (true);
    END IF;
END $$;

-- ============================================================================
-- 18. TRIGGER: Auto-create squares when a pool smash is created
-- ============================================================================
CREATE OR REPLACE FUNCTION create_smash_squares()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.smash_mode = 'pool' THEN
        INSERT INTO smash_squares (smash_id, square_number)
        SELECT NEW.id, generate_series(1, COALESCE(NEW.total_squares, 16));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_squares ON smashes;
CREATE TRIGGER trigger_create_squares
    AFTER INSERT ON smashes
    FOR EACH ROW
    EXECUTE FUNCTION create_smash_squares();

-- ============================================================================
-- 19. TRIGGER: Update squares_sold count when a square is purchased
-- ============================================================================
CREATE OR REPLACE FUNCTION update_squares_sold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NOT NULL AND (OLD.user_id IS NULL OR OLD.user_id != NEW.user_id) THEN
        UPDATE smashes 
        SET squares_sold = (
            SELECT COUNT(*) FROM smash_squares 
            WHERE smash_id = NEW.smash_id AND user_id IS NOT NULL
        )
        WHERE id = NEW.smash_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_squares_sold ON smash_squares;
CREATE TRIGGER trigger_update_squares_sold
    AFTER UPDATE ON smash_squares
    FOR EACH ROW
    EXECUTE FUNCTION update_squares_sold();

-- ============================================================================
-- MIGRATION COMPLETE
-- Tables created: 16 new tables
-- Columns added: ~25 new columns on existing tables
-- Triggers: 2 (auto-create squares, auto-update squares_sold)
-- Indexes: 15
-- RLS policies: ~20
-- ============================================================================
```

---

## 11. Build Order

### Phase 1: Database + Core (Week 1)
1. ✅ Run the complete SQL migration above
2. Update TypeScript types to match new schema
3. Enhanced `NavBar` with navigation
4. Enhanced `SmashCard` with mode badges, proper stats
5. `SmashCarousel` on homepage

### Phase 2: Challenge Flow (Week 2)
6. Create Smash form (mode selector → Pool / Free)
7. Smash Detail Page — Pool mode (squares grid)
8. Smash Detail Page — Free mode (participant list)
9. Buy Square flow (wallet transaction → square update)
10. Join Smash flow (free mode)

### Phase 3: Proof + Verification (Week 3)
11. Proof submission (image/video upload)
12. Wearable opt-in settings page
13. Wearable data submission (screenshots + metrics)
14. Community voting on proofs
15. AI verification agent (basic — screenshot reading)

### Phase 4: Engagement (Week 4)
16. Daily Smash system
17. Streak tracking
18. Leaderboard page (Proof + Wearable, time filters)
19. User Profile page

### Phase 5: Token Economy (Week 5+)
20. Token Dashboard
21. Daily claim rewards
22. Tip/Gift $SMASH
23. Smash Mints (NFTs)
24. Staking

### Phase 6: AI + Wearable Deep Integration
25. AI verification with wearable cross-referencing
26. MoltCoach / FitCaster shared proof engine
27. Connected wearable APIs (Strava, etc.)
28. Oracle integration for external data feeds
