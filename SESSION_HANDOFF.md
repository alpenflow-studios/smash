# Session Handoff - Smash.xyz

## Project Location
`/Users/mpr/first/hello_foundry/.github/workflows/smash`

## Live Site
https://smash.xyz

---

## Current Status (Session 8)

### Issue to Debug
**Smash creation is failing** - both with prediction market enabled and disabled. The error needs to be investigated in the browser console when attempting to create a smash.

Check `src/components/create/StepReview.tsx` line 127 for the error logging: `console.error('Failed to create smash:', err);`

Likely causes:
- Database schema mismatch (columns may not exist in Supabase)
- Missing SQL migrations for payment tables
- RLS policy blocking inserts

---

## What Was Completed (Session 7)

### Entry Fee Payment Flow
- Switched chain from Polygon to **Base Sepolia** testnet
- Created full payment infrastructure for **ETH and USDC** support

### Smart Contract
- Created `contracts/SmashVault.sol`:
  - Holds entry fees in escrow
  - Supports ETH and USDC payments
  - Automatic refunds before smash starts
  - Payout distribution to winners (admin-controlled)
  - ReentrancyGuard protection

### Blockchain Infrastructure
- Created `src/lib/blockchain/config.ts`:
  - Chain configuration (Base Sepolia)
  - Token addresses (USDC on Base Sepolia)
  - Block explorer URLs
- Created `src/lib/blockchain/viem-client.ts`:
  - Public client for reading chain data
  - Transaction confirmation helpers
- Created contract ABIs:
  - `src/lib/blockchain/contracts/smash-vault-abi.ts`
  - `src/lib/blockchain/contracts/erc20-abi.ts`

### Payment Hooks
- `src/hooks/useTokenBalance.ts` - Fetch ETH and USDC balances
- `src/hooks/useAllowance.ts` - Check ERC20 approval for vault
- `src/hooks/usePayment.ts` - Full payment transaction handling

### Payment UI Components
- `src/components/payment/TokenSelector.tsx` - Token dropdown with balances
- `src/components/payment/PaymentButton.tsx` - Join button with payment flow
- `src/components/payment/TransactionStatus.tsx` - Tx confirmation modal
- `src/components/payment/RefundButton.tsx` - Withdraw before start

### Create Flow Updates
- Added Step 3: **Token Selection** (`src/components/create/StepTokens.tsx`)
- Updated `src/store/use-create-smash.ts` with:
  - `acceptedTokens: PaymentToken[]`
  - `entryFeeETH: string`
  - `entryFeeUSDC: string`
- Form now has 8 steps (was 7)

### Join Flow Updates
- Updated `src/app/smash/[id]/page.tsx`:
  - PaymentButton replaces simple join button
  - Token selection before payment
  - ERC20 approval flow for USDC
  - Transaction confirmation modal
  - RefundButton for pre-start withdrawals
- Added `joinSmashWithPayment()` to queries.ts:
  - Records payment transaction in DB
  - Links participant to payment record

---

## Database Migrations REQUIRED

**These SQL migrations may not have been run yet - this could be causing the creation failure.**

Run this SQL in Supabase:

```sql
-- Payment tokens table
CREATE TABLE payment_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10) NOT NULL,
  name VARCHAR(50) NOT NULL,
  contract_address VARCHAR(42),
  decimals INTEGER NOT NULL DEFAULT 18,
  chain_id INTEGER NOT NULL DEFAULT 84532,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Seed ETH and USDC for Base Sepolia
INSERT INTO payment_tokens (symbol, name, contract_address, decimals, chain_id) VALUES
('ETH', 'Ethereum', NULL, 18, 84532),
('USDC', 'USD Coin', '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 6, 84532);

-- Smash accepted tokens (many-to-many)
CREATE TABLE smash_accepted_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smash_id UUID REFERENCES smashes(id) ON DELETE CASCADE,
  token_id UUID REFERENCES payment_tokens(id),
  UNIQUE(smash_id, token_id)
);

-- Payment transactions
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smash_id UUID REFERENCES smashes(id),
  user_id VARCHAR(42) NOT NULL,
  token_id UUID REFERENCES payment_tokens(id),
  amount TEXT NOT NULL,
  amount_usd NUMERIC,
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  tx_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  block_number BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Add columns to participants
ALTER TABLE participants
ADD COLUMN payment_tx_id UUID REFERENCES payment_transactions(id),
ADD COLUMN refund_tx_id UUID REFERENCES payment_transactions(id),
ADD COLUMN paid_amount TEXT,
ADD COLUMN paid_token_id UUID REFERENCES payment_tokens(id);

-- Add columns to smashes
ALTER TABLE smashes
ADD COLUMN vault_smash_id VARCHAR(66),
ADD COLUMN total_pool_eth TEXT DEFAULT '0',
ADD COLUMN total_pool_usdc TEXT DEFAULT '0';

-- Indexes
CREATE INDEX idx_payment_tx_smash ON payment_transactions(smash_id);
CREATE INDEX idx_payment_tx_user ON payment_transactions(user_id);
CREATE INDEX idx_payment_tx_hash ON payment_transactions(tx_hash);

-- RLS policies
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE smash_accepted_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payment tokens" ON payment_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can view smash accepted tokens" ON smash_accepted_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can insert smash accepted tokens" ON smash_accepted_tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view payment transactions" ON payment_transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert payment transactions" ON payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payment transactions" ON payment_transactions FOR UPDATE USING (true);
```

---

## Environment Variables Needed
Add to `.env.local`:
```
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_SMASH_VAULT_ADDRESS=0x...  # Deploy contract first
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

---

## Next Steps

### 1. Debug Smash Creation Failure
- Open browser console (F12 → Console)
- Attempt to create a smash
- Check error message at `StepReview.tsx:127`
- Likely need to run SQL migrations above

### 2. Deploy SmashVault Contract
- Deploy `contracts/SmashVault.sol` to Base Sepolia
- Set USDC address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Set admin address (your backend wallet)
- Add contract address to env vars

### 3. Test Full Payment Flow
1. Get Base Sepolia ETH from faucet
2. Create a smash with ETH entry fee
3. Join with payment
4. Verify on-chain and in DB

---

## Key Files

### New Files (Session 7)
| File | Purpose |
|------|---------|
| `contracts/SmashVault.sol` | Escrow contract for payments |
| `src/lib/blockchain/config.ts` | Chain and token config |
| `src/lib/blockchain/viem-client.ts` | Blockchain client |
| `src/lib/blockchain/contracts/*.ts` | Contract ABIs |
| `src/hooks/usePayment.ts` | Payment transaction hook |
| `src/hooks/useTokenBalance.ts` | Balance fetching hook |
| `src/hooks/useAllowance.ts` | ERC20 approval hook |
| `src/components/payment/*.tsx` | Payment UI components |
| `src/components/create/StepTokens.tsx` | Token selection step |

### Modified Files (Session 7)
| File | Changes |
|------|---------|
| `src/app/providers.tsx` | Polygon → Base Sepolia |
| `src/store/use-create-smash.ts` | Added token fields |
| `src/components/create/CreateSmashForm.tsx` | Added StepTokens |
| `src/app/smash/[id]/page.tsx` | PaymentButton integration |
| `src/lib/queries.ts` | Added `joinSmashWithPayment()` |
| `src/lib/database.types.ts` | Added payment table types |
| `src/types/index.ts` | Added `stakesType` to Smash |

---

## Previous Sessions Summary

### Session 6
- Join Smash flow with participants table
- Create Smash form submission with all fields
- Cover image upload to Supabase Storage

### Session 5
- Proof submission feature with file upload
- User profile page at `/profile/[address]`
- Wallet dropdown with profile link

### Session 4
- Smash detail page at `/smash/[id]`
- Supabase data integration with queries.ts

### Session 3
- Multi-step create smash form (7 steps)
- Zustand store for form state

---

## Quick Start for Next Session

```
Continue working on smash.xyz at /Users/mpr/first/hello_foundry/.github/workflows/smash

Read SESSION_HANDOFF.md for context.

Current issue: Smash creation is failing. Debug by checking browser console for error message.
```
