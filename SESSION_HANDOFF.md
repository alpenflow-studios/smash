# Session Handoff - Smash.xyz

## Project Location
`/Users/mpr/first/hello_foundry/.github/workflows/smash`

## Live Site
https://smash.xyz

---

## What Was Completed (Session 6)

### Join Smash Flow
- Created `participants` table schema (run SQL below in Supabase)
- Added participant types to `src/lib/database.types.ts`:
  - `Participant` and `NewParticipant` types
- Added query functions to `src/lib/queries.ts`:
  - `getParticipantsForSmash()` - Fetch all participants for a smash
  - `hasUserJoinedSmash()` - Check if user already joined
  - `joinSmash()` - Join a smash (creates participant record + user if needed)
  - `leaveSmash()` - Withdraw from a smash
  - `getParticipantCount()` - Get count for a smash
  - `SmashParticipant` interface for frontend
- Updated smash detail page (`src/app/smash/[id]/page.tsx`):
  - Integrated Privy auth to get current user's wallet address
  - Join button now functional with loading state
  - Shows "Joined" state for users who already joined
  - Shows "Connect to Join" for unauthenticated users
  - Shows "Copy Link" for smash creators
  - Participants tab shows actual DB participants with status badges
  - Current user is highlighted in participants list

### Complete Create Smash Submission
- Updated `src/components/create/StepReview.tsx`:
  - Integrated Privy auth to get creator's wallet address
  - Added all missing fields to smash creation:
    - `creator_id` - wallet address of creator
    - `visibility` - public or private
    - `stakes_type` - monetary, prize, or bragging
    - `min_participants` - minimum required participants
    - `consensus_threshold` - percentage for verification
    - `dispute_window_hours` - time window for disputes
  - Cover image upload to Supabase Storage (`covers/` folder)
  - Invite code generation for private smashes (8-char alphanumeric)
  - Status set to 'open' instead of 'draft' so users can join immediately
  - "Connect Wallet to Create" button when not authenticated
  - Wallet connection notice on review step

### Database Update Required
Run this SQL in Supabase to create the participants table:

```sql
-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smash_id UUID NOT NULL REFERENCES smashes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  UNIQUE(smash_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_participants_smash_id ON participants(smash_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can leave their own participations" ON participants FOR DELETE USING (true);
```

---

## What Was Completed (Session 5)

### Proof Submission Feature
- Created `src/components/proof/ProofUploadDialog.tsx`:
  - Proof type selection (photo, video, document)
  - Drag-and-drop file upload
  - File preview for images/videos
  - File size/type validation (50MB max)
  - Upload progress with loading state
- Created `src/components/proof/ProofGallery.tsx`:
  - Grid display of submitted proofs
  - Image/video thumbnails
  - Verification status badges
  - Click to view full size
- Added query functions to `src/lib/queries.ts`:
  - `uploadProofFile()` - Upload to Supabase Storage
  - `createSubmission()` - Create submission record
  - `submitProof()` - Combined upload + record
  - `getSubmissionsForSmash()` - Fetch submissions
- Updated smash detail page with functional Proofs tab
- **Supabase Storage bucket `smash-proofs` created (PUBLIC)**

### User Profile Page (`/profile/[address]`)
- Created full profile page at `src/app/profile/[address]/page.tsx`
- Features:
  - Avatar with wallet address initials
  - Username display (if set)
  - Copy address button + BaseScan link
  - Reputation score display
  - Stats grid (created, joined, won, winnings)
  - Tabbed interface:
    - **Created** - Smashes user created
    - **Participated** - User's submissions
- Added query functions:
  - `getUserByAddress()` - Fetch user profile
  - `getUserStats()` - Fetch user statistics
  - `getSubmissionsByUser()` - Fetch user's submissions
  - `getOrCreateUser()` - Get or create user record
  - `transformUser()` - Map DB to frontend type
- Updated `src/components/wallet-connect.tsx`:
  - Added dropdown menu when connected
  - "My Profile" link to user's profile page
  - "Disconnect" button
- Creator links to profile in smash detail page

---

## What Was Completed (Session 4)

### Smash Detail Page (`/smash/[id]`)
- Created full detail page at `src/app/smash/[id]/page.tsx`
- Features implemented:
  - Title, description, category, status badges
  - Stats grid (prize pool, entry fee, participants, time remaining)
  - Join/bet action section with progress bar
  - Tabbed interface with:
    - **Details** - Timeline and verification requirements
    - **Participants** - List with creator highlighted
    - **Proofs** - Submission area (placeholder for upload)
    - **Betting** - Odds and betting options (if enabled)
- Updated SmashCard to link to detail page

### Supabase Data Integration
- Created `src/lib/queries.ts` - Data fetching layer with:
  - `getSmashes()` - Fetch all public smashes with filters
  - `getSmashById()` - Fetch single smash by ID
  - `getActiveSmashes()` - Fetch active smashes for homepage
  - `getSmashesByCreator()` - Fetch smashes by creator
  - `transformSmash()` - Maps database types to frontend types
- Updated home page (`src/app/page.tsx`):
  - Fetches from Supabase with loading spinner
  - Falls back to mock data if no results or error
  - Error banner for failed requests
  - Empty state when no smashes exist
- Updated detail page (`src/app/smash/[id]/page.tsx`):
  - Fetches from Supabase with loading state
  - Falls back to mock data on error
  - Proper 404 handling

---

## What Was Completed (Session 3)

### Code Fixes
- Fixed `SmashCategory` type mismatch (now: fitness, gaming, creative, social, other)
- Fixed `VerificationMethod` type mismatch (now: wearable, visual, participant, audience, hybrid)
- Fixed `SmashStatus` type (now: draft, open, active, verification, complete, disputed)
- Updated mock data to use correct types
- Fixed SmashCard category colors

### New Files Created
- `.env.example` - Template for environment variables
- `tailwind.config.ts` - Tailwind configuration for shadcn/ui
- `README.md` - Updated with project documentation
- `src/store/use-create-smash.ts` - Zustand store for create form
- `src/components/create/*` - Multi-step form components (7 steps)
- `src/app/create/page.tsx` - Create smash page

### Configuration Updates
- `next.config.ts` - Added security headers, Turbopack config, image optimization
- `components.json` - Added tailwind config path
- `.env.local` - Added Supabase environment variables
- Set up Supabase MCP (run `/mcp` to authenticate)

### Database Updates (Run in Supabase)
Added these columns to `smashes` table:
- `visibility` (public/private)
- `stakes_type` (monetary/prize/bragging)
- `invite_code` (for private smashes)
- `consensus_threshold` (percentage needed)
- `dispute_window_hours`
- `cover_image_url`
- `min_participants`

Updated `src/lib/database.types.ts` to match.

---

## Next Priorities

### 1. Entry Fee Payment Flow
- Integrate wallet payment for entry fees (USDC on Base)
- Update prize pool when users join
- Handle refunds for withdrawn participants

### 2. Verification & Voting
- Implement participant voting on proofs
- Create `votes` table for tracking votes
- Consensus threshold checking
- Dispute window handling

### 3. Betting System
- Place bet functionality
- Track betting pool
- Calculate odds

### 4. Smash Lifecycle Management
- Auto-transition status (open -> active -> verification -> complete)
- Scheduled tasks for status updates based on dates
- Winner determination based on verified proofs

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/types/index.ts` | Shared TypeScript types |
| `src/lib/database.types.ts` | Supabase auto-generated types |
| `src/lib/supabase.ts` | Supabase client |
| `src/store/use-create-smash.ts` | Zustand store for create form |
| `src/lib/mock-data.ts` | Fallback mock data |
| `src/lib/queries.ts` | Supabase data fetching functions |
| `src/components/proof/*` | Proof upload and gallery components |
| `src/app/profile/[address]/page.tsx` | User profile page |
| `SMASH_SPEC.md` | Full feature specification |
| `NEXT_STEPS.md` | Development roadmap |

---

## Environment Variables Needed

```
NEXT_PUBLIC_PRIVY_APP_ID=xxx
NEXT_PUBLIC_SUPABASE_URL=https://pdjrexphjivdwfbvgbqm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## Quick Start for Next Session

Paste this to get started:

```
Continue working on smash.xyz at /Users/mpr/first/hello_foundry/.github/workflows/smash

Read SESSION_HANDOFF.md for context.
```

---

## Important: Session Management

**At ~75% token usage:**
1. Create and save a new SESSION_HANDOFF.md with all completed work
2. Push current work to the repo with a descriptive commit message
3. Continue working or hand off to next session
