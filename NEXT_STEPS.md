# Next Steps for Smash.xyz

## Completed ✅

### Session 1 (Jan 17-18, 2026)
- ✅ Next.js foundation with TypeScript
- ✅ Tailwind CSS + Shadcn/UI
- ✅ Homepage with SmashCards
- ✅ Privy wallet authentication
- ✅ GitHub repo + Vercel deployment
- ✅ Domain: smash.xyz

### Session 2 (Jan 18-19, 2026)
- ✅ Fixed Privy v3 configuration
- ✅ Fixed package.json devDependencies
- ✅ Supabase project created (smashsmash.xyz)
- ✅ Database tables: users, smashes, submissions, bets
- ✅ Row Level Security enabled
- ✅ Supabase client + types added to project
- ✅ Environment variables in Vercel
- ✅ Created SMASH_SPEC.md with full feature specification

---

## Session 3 Priority: Create Smash Feature 🚀

### Pre-work: Database Updates
Run this SQL in Supabase to add missing columns:

```sql
-- Add new columns to smashes table
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS stakes_type text DEFAULT 'monetary';
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS invite_code text;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS consensus_threshold int DEFAULT 100;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS dispute_window_hours int DEFAULT 24;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE smashes ADD COLUMN IF NOT EXISTS min_participants int DEFAULT 2;

-- Add index for invite codes (for private smash lookups)
CREATE INDEX IF NOT EXISTS idx_smashes_invite_code ON smashes(invite_code);
```

### Build: Create Smash Page (/create)

**Files to create:**
```
src/app/create/page.tsx        # Main create page
src/components/create/
  ├── CreateSmashForm.tsx      # Multi-step form container
  ├── StepBasics.tsx           # Title, description, category
  ├── StepVisibility.tsx       # Public/private, stakes type
  ├── StepParticipants.tsx     # Min/max, invite list
  ├── StepTimeline.tsx         # Start/end dates
  ├── StepVerification.tsx     # Consensus method
  ├── StepPrediction.tsx       # Betting toggle
  └── StepReview.tsx           # Summary + create button
```

**Form State (Zustand or React state):**
```typescript
interface CreateSmashState {
  // Step 1: Basics
  title: string
  description: string
  category: 'fitness' | 'gaming' | 'creative' | 'social' | 'other'
  coverImage: File | null
  
  // Step 2: Visibility
  visibility: 'public' | 'private'
  stakesType: 'monetary' | 'prize' | 'bragging'
  entryFee: number | null
  prizeDescription: string | null
  
  // Step 3: Participants
  minParticipants: number
  maxParticipants: number | null
  inviteList: string[] // wallet addresses
  
  // Step 4: Timeline
  startsAt: Date
  endsAt: Date
  verificationWindowHours: number
  
  // Step 5: Verification
  verificationMethod: 'wearable' | 'visual' | 'participant' | 'audience' | 'hybrid'
  consensusThreshold: number
  disputeWindowHours: number
  
  // Step 6: Prediction Market
  bettingEnabled: boolean
  bettingDeadline: Date | null
}
```

### After Create Smash:
1. **Smash Detail Page** (/smash/[id]) - View single smash
2. **Replace Homepage Mock Data** - Pull from Supabase
3. **Proof Submission** - Upload images/videos
4. **User Profile** - Show joined smashes

---

## Technical Debt / Improvements

- [ ] Add loading states to all async operations
- [ ] Add error boundaries
- [ ] Add form validation (zod or yup)
- [ ] Add image upload to Supabase Storage
- [ ] Add real-time subscriptions for live updates
- [ ] Mobile responsive testing

---

## Smart Contracts (Week 2+)

### SmashFactory.sol
- createSmash() - Deploy new smash with escrow
- joinSmash() - Deposit entry fee
- submitProof() - Record proof hash on-chain
- resolveSmash() - Distribute prize pool
- disputeSmash() - Initiate dispute process

### PredictionMarket.sol
- placeBet() - Bet YES/NO on participant
- closeBetting() - Lock bets at start time
- resolveBets() - Payout based on outcome
- claimWinnings() - Withdraw winnings

### Deploy to:
1. Polygon Mumbai (testnet) first
2. Polygon Mainnet when ready

---

## Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm
- **Vercel Dashboard:** https://vercel.com/classcoin/v0-smash-xyz
- **GitHub Repo:** https://github.com/alpenflow-studios/smash
- **Live Site:** https://smash.xyz
- **Inspiration:** https://poidh.xyz

---

## How to Continue with Claude Code

1. Open VS Code with smash project
2. Open Claude Code extension
3. Say: "Read SMASH_SPEC.md and NEXT_STEPS.md, then let's build the Create Smash form"
4. Claude Code will create files directly in your project

**Inspiration:**
- Polymarket.com (prediction markets)
- Poidh.xyz (proof bounties)
- Strava (fitness challenges)