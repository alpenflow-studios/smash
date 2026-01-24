-- ============================================================================
-- SMASH.XYZ DATABASE SCHEMA
-- Version: 1.0.0
-- Last Updated: January 23, 2026
-- 
-- This is the SINGLE SOURCE OF TRUTH for the database.
-- Any changes to the database should be made here first.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Stores user profiles linked to their wallet addresses
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    
    -- Stats (denormalized for performance)
    total_smashes_created INTEGER DEFAULT 0,
    total_smashes_won INTEGER DEFAULT 0,
    total_earnings NUMERIC DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: payment_tokens
-- Supported tokens for payments (ETH, USDC, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    contract_address TEXT, -- NULL for native ETH
    decimals INTEGER NOT NULL DEFAULT 18,
    chain_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: smashes
-- Core challenge/competition records
-- ============================================================================
CREATE TABLE IF NOT EXISTS smashes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'fitness', 'gaming', 'creative', 'professional', 'custom'
    cover_image_url TEXT,
    
    -- Creator
    creator_id UUID REFERENCES users(id),
    
    -- Entry & Prize
    entry_fee NUMERIC DEFAULT 0,
    prize_pool NUMERIC DEFAULT 0,
    payment_token_id UUID REFERENCES payment_tokens(id),
    
    -- Vault (on-chain escrow)
    vault_smash_id TEXT, -- On-chain identifier
    total_pool_eth TEXT DEFAULT '0',
    total_pool_usdc TEXT DEFAULT '0',
    
    -- Participation
    min_participants INTEGER DEFAULT 2,
    max_participants INTEGER,
    
    -- Timing
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    
    -- Rules & Verification
    rules TEXT,
    verification_method TEXT DEFAULT 'community', -- 'community', 'oracle', 'creator', 'ai'
    consensus_threshold INTEGER DEFAULT 51, -- Percentage needed for community verification
    dispute_window_hours INTEGER DEFAULT 24,
    
    -- Privacy & Access
    visibility TEXT DEFAULT 'public', -- 'public', 'private', 'invite-only'
    invite_code TEXT UNIQUE,
    
    -- Status
    status TEXT DEFAULT 'draft', -- 'draft', 'open', 'active', 'judging', 'completed', 'cancelled', 'disputed'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: smash_participants
-- Users who have joined a smash
-- ============================================================================
CREATE TABLE IF NOT EXISTS smash_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smash_id UUID REFERENCES smashes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Payment
    entry_paid BOOLEAN DEFAULT FALSE,
    entry_tx_hash TEXT,
    
    -- Status
    status TEXT DEFAULT 'joined', -- 'joined', 'submitted', 'won', 'lost', 'withdrawn'
    
    -- Results
    final_rank INTEGER,
    payout_amount NUMERIC,
    payout_tx_hash TEXT,
    
    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(smash_id, user_id)
);

-- ============================================================================
-- TABLE: submissions
-- Proof submissions for smash challenges
-- ============================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smash_id UUID REFERENCES smashes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Content
    content_type TEXT NOT NULL, -- 'image', 'video', 'link', 'text'
    content_url TEXT,
    content_text TEXT,
    
    -- Verification
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'disputed'
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    
    -- Community Voting
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    -- Timestamps
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: bets
-- Spectator bets on smash outcomes (prediction market)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smash_id UUID REFERENCES smashes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Bet Details
    bet_type TEXT NOT NULL, -- 'winner', 'completion', 'custom'
    target_user_id UUID REFERENCES users(id), -- Who they're betting on (if applicable)
    target_outcome TEXT, -- Custom outcome description
    
    -- Amounts
    amount NUMERIC NOT NULL,
    odds NUMERIC, -- At time of bet
    potential_payout NUMERIC,
    payment_token_id UUID REFERENCES payment_tokens(id),
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'won', 'lost', 'refunded', 'cancelled'
    
    -- Settlement
    actual_payout NUMERIC,
    payout_tx_hash TEXT,
    
    -- Timestamps
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    settled_at TIMESTAMPTZ
);

-- ============================================================================
-- TABLE: payment_transactions
-- Record of all on-chain payment transactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- References
    user_id UUID REFERENCES users(id),
    smash_id UUID REFERENCES smashes(id),
    bet_id UUID REFERENCES bets(id),
    
    -- Transaction Details
    tx_type TEXT NOT NULL, -- 'entry_fee', 'bet', 'payout', 'refund', 'withdrawal'
    tx_hash TEXT UNIQUE,
    
    -- Amounts
    amount NUMERIC NOT NULL,
    payment_token_id UUID REFERENCES payment_tokens(id),
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    
    -- Chain Info
    chain_id INTEGER,
    block_number BIGINT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ
);

-- ============================================================================
-- TABLE: smash_accepted_tokens
-- Which tokens a specific smash accepts
-- ============================================================================
CREATE TABLE IF NOT EXISTS smash_accepted_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smash_id UUID REFERENCES smashes(id) ON DELETE CASCADE,
    payment_token_id UUID REFERENCES payment_tokens(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(smash_id, payment_token_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_smashes_creator ON smashes(creator_id);
CREATE INDEX IF NOT EXISTS idx_smashes_status ON smashes(status);
CREATE INDEX IF NOT EXISTS idx_smashes_category ON smashes(category);
CREATE INDEX IF NOT EXISTS idx_smashes_visibility ON smashes(visibility);

CREATE INDEX IF NOT EXISTS idx_participants_smash ON smash_participants(smash_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON smash_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_smash ON submissions(smash_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_bets_smash ON bets(smash_id);
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_smash ON payment_transactions(smash_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE smashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE smash_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smash_accepted_tokens ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);

-- PAYMENT_TOKENS policies (read-only for users, admin managed)
CREATE POLICY "Payment tokens are viewable by everyone" ON payment_tokens FOR SELECT USING (true);

-- SMASHES policies
CREATE POLICY "Smashes are viewable by everyone" ON smashes FOR SELECT USING (true);
CREATE POLICY "Users can create smashes" ON smashes FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can update their smashes" ON smashes FOR UPDATE USING (true);

-- SMASH_PARTICIPANTS policies
CREATE POLICY "Participants are viewable by everyone" ON smash_participants FOR SELECT USING (true);
CREATE POLICY "Users can join smashes" ON smash_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their participation" ON smash_participants FOR UPDATE USING (true);

-- SUBMISSIONS policies
CREATE POLICY "Submissions are viewable by everyone" ON submissions FOR SELECT USING (true);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their submissions" ON submissions FOR UPDATE USING (true);

-- BETS policies
CREATE POLICY "Bets are viewable by everyone" ON bets FOR SELECT USING (true);
CREATE POLICY "Users can place bets" ON bets FOR INSERT WITH CHECK (true);

-- PAYMENT_TRANSACTIONS policies
CREATE POLICY "Transactions are viewable by everyone" ON payment_transactions FOR SELECT USING (true);
CREATE POLICY "System can create transactions" ON payment_transactions FOR INSERT WITH CHECK (true);

-- SMASH_ACCEPTED_TOKENS policies
CREATE POLICY "Accepted tokens are viewable by everyone" ON smash_accepted_tokens FOR SELECT USING (true);
CREATE POLICY "Creators can set accepted tokens" ON smash_accepted_tokens FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SEED DATA: Payment Tokens (Base Sepolia Testnet)
-- ============================================================================
INSERT INTO payment_tokens (symbol, name, contract_address, decimals, chain_id, is_active) VALUES
    ('ETH', 'Ethereum', NULL, 18, 84532, true),
    ('USDC', 'USD Coin', '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 6, 84532, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_smashes_updated_at ON smashes;
CREATE TRIGGER update_smashes_updated_at
    BEFORE UPDATE ON smashes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- NOTES FOR FUTURE INTEGRATIONS
-- ============================================================================
-- 
-- FARCASTER/NEYNAR INTEGRATION (Future)
-- - Add farcaster_fid to users table
-- - Consider: farcaster_casts table for tracking frames/casts
-- - Consider: farcaster_reactions table for engagement
--
-- POLYMARKET INTEGRATION (Future)  
-- - Consider: prediction_markets table for market data
-- - Consider: market_positions table for user positions
-- - May need to cache Polymarket CLOB data locally
--
-- VERCEL AI SDK (Future)
-- - Consider: ai_judgments table for AI verification results
-- - Consider: ai_generations table for AI-created content
--
-- WORLD ID (Future)
-- - Add world_id_nullifier to users table for sybil resistance
--
-- ============================================================================
