# Smash Specification

## What is a Smash?

A **Smash** is a competitive challenge between 2+ participants where completion must be proven and verified through consensus. Think "proof or it didn't happen" meets prediction markets.

---

## Core Rules

### Visibility
| Type | Description |
|------|-------------|
| **Public** | Anyone can view and join. Eligible for prediction market. |
| **Private** | Invite-only. Requires invite link or wallet address whitelist. NOT eligible for prediction market. |

### Participants
- Minimum: **2 participants**
- Maximum: Configurable by creator (or unlimited)
- Creator can be a participant or just the organizer

### Stakes Types
| Type | Description |
|------|-------------|
| **Monetary** | USDC/ETH entry fee, winner takes pool |
| **Prize** | Physical or digital prize provided by creator/sponsor |
| **Bragging Rights** | No monetary value, reputation/clout only |

### Prediction Market Rules
- ✅ Only **public** smashes can have prediction markets
- ❌ Smash **participants cannot bet** on their own smash
- ✅ Outside observers can bet on any participant's success/failure
- Betting uses binary outcomes: YES (will complete) / NO (will not complete)

---

## Consensus Methods

A smash reaches consensus (proof accepted/rejected) through one or more methods:

### 1. Wearable Data (Automatic)
- Connected fitness devices (Strava, Apple Health, Garmin, etc.)
- Automatic verification of metrics (distance, time, heart rate)
- Best for: Fitness challenges, sports, quantifiable goals
- Trust level: **High** (hard to fake)

### 2. Visual Proof (Manual Review)
- Photo or video upload
- Similar to poidh.xyz - "pics or it didn't happen"
- Can include metadata (timestamp, location)
- Best for: Creative challenges, physical achievements, events
- Trust level: **Medium** (can be faked but reviewable)

### 3. Participant Agreement (Multi-sig Style)
Options:
- **Unanimous** - All participants must approve
- **Majority** - 51%+ of participants approve
- **Dispute Window** - Auto-accepted after 24-48 hours unless disputed
- **Stake-to-Dispute** - Must stake tokens to dispute (prevents spam)
- Best for: Subjective challenges, trust-based groups
- Trust level: **Variable** (depends on participant honesty)

### 4. Audience Voting (Decentralized)
- Public voters decide if proof is valid
- Can require token holding or reputation score to vote
- Voting period: 24-72 hours configurable
- Best for: Public smashes, viral challenges, disputes
- Trust level: **Medium-High** (crowd wisdom)

### 5. Hybrid/Escalation
- Default: Participant agreement
- If disputed: Escalates to audience voting
- If still disputed: Third-party judge or DAO
- Best for: High-stakes smashes

---

## Smash Lifecycle

```
DRAFT → OPEN → ACTIVE → VERIFICATION → COMPLETE/DISPUTED
```

| Status | Description |
|--------|-------------|
| **Draft** | Creator is setting up, not visible to others |
| **Open** | Accepting participants/bets, countdown to start |
| **Active** | Challenge in progress, participants completing |
| **Verification** | Proofs submitted, consensus in progress |
| **Complete** | Consensus reached, payouts distributed |
| **Disputed** | Consensus failed, escalation in progress |

---

## Database Schema (Already Created)

### smashes table
```sql
- id (uuid)
- title (text)
- description (text)
- category (text) -- fitness, gaming, creative, etc.
- status (text) -- draft, open, active, verification, complete, disputed
- entry_fee (numeric)
- prize_pool (numeric)
- creator_id (uuid → users)
- max_participants (int)
- starts_at (timestamp)
- ends_at (timestamp)
- verification_method (text) -- wearable, visual, participant, audience, hybrid
- betting_enabled (boolean)
- visibility (text) -- public, private [TO ADD]
- stakes_type (text) -- monetary, prize, bragging [TO ADD]
- created_at (timestamp)
```

### Additional fields needed:
```sql
ALTER TABLE smashes ADD COLUMN visibility text DEFAULT 'public';
ALTER TABLE smashes ADD COLUMN stakes_type text DEFAULT 'monetary';
ALTER TABLE smashes ADD COLUMN invite_code text; -- for private smashes
ALTER TABLE smashes ADD COLUMN consensus_threshold int DEFAULT 100; -- percentage needed
ALTER TABLE smashes ADD COLUMN dispute_window_hours int DEFAULT 24;
```

---

## Create Smash Form Fields

### Step 1: Basics
- **Title** (required) - "Run a 5K in under 25 minutes"
- **Description** (optional) - Details, rules, context
- **Category** (required) - Fitness, Gaming, Creative, Social, Other
- **Cover Image** (optional) - Visual preview for the card

### Step 2: Visibility & Stakes
- **Visibility** - Public / Private
- **Stakes Type** - Monetary / Prize / Bragging Rights
- **Entry Fee** (if monetary) - Amount in USDC
- **Prize Description** (if prize) - What winner gets

### Step 3: Participants
- **Min Participants** - Default 2
- **Max Participants** - Optional limit
- **Invite List** (if private) - Wallet addresses or generate invite link

### Step 4: Timeline
- **Start Date/Time** - When challenge begins
- **End Date/Time** - Deadline for completion
- **Verification Window** - Hours after end for proof submission

### Step 5: Verification
- **Consensus Method** - Wearable / Visual / Participant / Audience / Hybrid
- **Consensus Threshold** - Percentage needed (default 100% for participant, 51% for audience)
- **Dispute Window** - Hours before auto-acceptance

### Step 6: Prediction Market
- **Enable Betting** - Toggle (only available if public)
- **Betting Deadline** - When betting closes (usually at start time)

### Step 7: Review & Create
- Summary of all settings
- Estimated gas fees
- Create button (triggers smart contract)

---

## UI/UX Inspiration (poidh.xyz)

- **Visual-first cards** - Large images/videos, minimal text
- **Status badges** - "accepted", "voting in progress", "open"
- **Bounty/Prize prominent** - Show the stakes clearly
- **Claim system** - Participants submit "claims" (proofs)
- **Transaction history** - Show all on-chain activity
- **Share functionality** - Easy social sharing

---

## Next Implementation Steps

1. **Add missing columns** to Supabase smashes table
2. **Create /create page** with multi-step form
3. **Create SmashCard component** that shows visual proof
4. **Create /smash/[id] detail page** with proof submission
5. **Wire up Supabase** to save/load smashes
6. **Later: Smart contracts** for escrow and betting

---

## Session 3 Handoff

To continue in VS Code with Claude Code:
1. Open smash project in VS Code
2. Tell Claude Code: "Read SMASH_SPEC.md and let's build the Create Smash form"
3. Claude Code will have full context from these docs