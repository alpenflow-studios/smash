# CONTRACTS.md — Smart Contract Specifications

> **Chain**: Base (chainId 8453)
> **Framework**: Foundry
> **Solidity**: ^0.8.20
> **Libraries**: OpenZeppelin 5.x

---

## Deployed Contracts

| Contract | Address | Network |
|----------|---------|---------|
| SmashVault | `0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De` | Base Sepolia (84532) |
| USDC (testnet) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Base Sepolia (84532) |

**Admin Wallet**: `0xAd4E23f274cdF74754dAA1Fb03BF375Db2eBf5C2`

---

## Directory Structure

```
contracts/
├── src/
│   └── SmashVault.sol
├── test/
│   └── SmashVault.t.sol
├── script/
│   └── Deploy.s.sol
├── foundry.toml
└── remappings.txt
```

---

## SmashVault Contract

### Overview
Escrow contract for smash entry fees. Supports ETH and ERC20 tokens (USDC).

### Key Functions

```solidity
// Join a smash with ETH
function joinWithETH(bytes32 smashId) external payable;

// Join a smash with USDC (requires prior approval)
function joinWithUSDC(bytes32 smashId, uint256 amount) external;

// Withdraw before smash starts (refund)
function withdrawBeforeStart(bytes32 smashId) external;

// Admin: Pay out winners
function payoutWinners(bytes32 smashId, address[] calldata winners) external onlyAdmin;

// Admin: Cancel smash and refund all participants
function cancelSmash(bytes32 smashId) external onlyAdmin;
```

### Events

```solidity
event Joined(bytes32 indexed smashId, address indexed participant, address token, uint256 amount);
event Withdrawn(bytes32 indexed smashId, address indexed participant, address token, uint256 amount);
event Payout(bytes32 indexed smashId, address indexed winner, address token, uint256 amount);
event SmashCancelled(bytes32 indexed smashId);
```

---

## UUID to bytes32 Conversion

Smash IDs in the database are UUIDs. The contract uses bytes32. Conversion:

```typescript
// Frontend: UUID string → bytes32
function uuidToBytes32(uuid: string): `0x${string}` {
  const hex = uuid.replace(/-/g, '');
  return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
}
```

---

## Deploy Commands

```bash
# Testnet (Base Sepolia)
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_KEY \
  -vvvv

# Mainnet
forge script script/Deploy.s.sol \
  --rpc-url $BASE_RPC \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_KEY \
  -vvvv
```

---

## Verify Contract

```bash
forge verify-contract \
  --chain-id 84532 \
  --compiler-version v0.8.20 \
  0xF2b3001f69A78574f6Fcf83e14Cf6E7275fB83De \
  src/SmashVault.sol:SmashVault \
  --etherscan-api-key $BASESCAN_KEY
```

---

## Security Checklist

### Pre-Testnet
- [ ] All tests passing (`forge test -vvvv`)
- [ ] Coverage > 90% (`forge coverage`)
- [ ] Slither clean
- [ ] No `tx.origin` usage
- [ ] All state changes emit events
- [ ] ReentrancyGuard on value transfers

### Pre-Mainnet
- [ ] All of the above
- [ ] Testnet tested for 2+ weeks
- [ ] External audit or peer review
- [ ] Admin keys secured (hardware wallet or multi-sig)
- [ ] Emergency pause mechanism tested

---

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| joinWithETH | ~50,000 |
| joinWithUSDC | ~80,000 |
| withdrawBeforeStart | ~40,000 |
| payoutWinners (per winner) | ~30,000 |
