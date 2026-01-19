# Next Steps for Smash.xyz

## Immediate Priority (Session 2)

### 1. Fix Vercel Deployment ⚠️
**Status:** Build failing due to Privy dependency conflicts

**Solution:**
- `.npmrc` file has been added with `legacy-peer-deps=true`
- Need to redeploy in Vercel
- Add `NEXT_PUBLIC_PRIVY_APP_ID` environment variable in Vercel

**Steps:**
1. Go to Vercel dashboard
2. Click "Redeploy" on latest deployment
3. Settings → Environment Variables → Add Privy app ID
4. Test at smash.xyz

---

### 2. Setup Database (Supabase) 🗄️

**Why Supabase:**
- Postgres (robust queries)
- Built-in file storage (for proof uploads)
- Real-time subscriptions
- Row Level Security
- Free tier is generous

**Schema to Create:**

**Users Table:**
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  username text,
  avatar_url text,
  reputation_score integer default 0,
  created_at timestamp default now()
);
```

**Smashes Table:**
```sql
create table smashes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  status text not null,
  entry_fee decimal,
  prize_pool decimal,
  creator_id uuid references users(id),
  max_participants integer,
  starts_at timestamp,
  ends_at timestamp,
  verification_method text,
  betting_enabled boolean default false,
  created_at timestamp default now()
);
```

**Submissions Table:**
```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  smash_id uuid references smashes(id),
  user_id uuid references users(id),
  proof_url text not null,
  proof_type text,
  verified boolean default false,
  submitted_at timestamp default now()
);
```

---

### 3. Build Core Features 🚀

**Priority Order:**

**A. Smash Detail Page** (2-3 hours)
- Route: `/smash/[id]`
- Show full smash details
- Participant list
- Join button (functional)
- Bet interface (basic)

**B. Create Smash Form** (3-4 hours)
- Modal or dedicated page
- Form fields for all smash properties
- Category selection
- Entry fee and prize settings
- Save to Supabase

**C. Proof Upload** (2-3 hours)
- File upload component (photos/videos)
- Store in Supabase Storage
- Link to submission record
- Display in submission queue

**D. User Profile** (2 hours)
- Route: `/profile/[address]`
- Show user stats
- List of joined smashes
- Completed challenges
- Wallet info

---

### 4. Smart Contracts (Week 2) ⛓️

**Contracts Needed:**

**SmashFactory.sol:**
- Create smash with escrow
- Join smash (deposit entry fee)
- Verify completion
- Distribute prize pool

**PredictionMarket.sol:**
- Binary outcome markets (YES/NO)
- Betting on participants
- UMA oracle integration for resolution
- Automated payouts

**Deploy to:**
- Polygon Mumbai (testnet first)
- Then Polygon Mainnet

---

### 5. Payment Flow 💰

**Wallet → USDC → Smash Entry:**
1. User connects wallet
2. Approve USDC spending
3. Deposit entry fee to contract
4. Contract holds funds in escrow
5. Winner verification triggers payout

**Implementation:**
- Use Wagmi hooks for contract interactions
- Show transaction status
- Handle errors gracefully

---

## Future Features (Backlog)

### Polish & UX
- Loading states
- Error boundaries
- Toast notifications
- Skeleton loaders

### Social Features
- Comments on smashes
- Like/react to proofs
- Share to social media
- Invite friends

### Advanced Features
- Team smashes
- Recurring challenges
- Leaderboards (all-time, weekly)
- Achievement badges
- Referral system

### Monetization
- Platform fee (10% of entry fees)
- Betting volume fee (2.5%)
- Premium features
- Sponsorship integration

---

## Development Workflow

**Daily:**
1. Pull latest from main
2. Run `npm run dev`
3. Build one feature
4. Test locally
5. Commit and push
6. Vercel auto-deploys

**Testing:**
- Use Polygon Mumbai testnet
- Test wallet with test ETH/USDC
- Invite friends to beta test

---

## Resources

**Docs:**
- Next.js: https://nextjs.org/docs
- Privy: https://docs.privy.io
- Supabase: https://supabase.com/docs
- Wagmi: https://wagmi.sh
- UMA: https://docs.uma.xyz

**Inspiration:**
- Polymarket.com (prediction markets)
- Poidh.xyz (proof bounties)
- Strava (fitness challenges)