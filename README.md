<<<<<<< HEAD
# smash
smash.xyz
=======
# Base MCP Project

A professional blockchain development project using Hardhat, TypeScript, and AgentKit.

## Prerequisites

- Node.js v22.x (LTS) - **Important:** Node.js v25.x is not supported by Hardhat
- npm or yarn

## Installation

```bash
npm install
```

## Project Structure

```
.
├── contracts/          # Solidity smart contracts
├── scripts/           # Deployment scripts
├── test/              # Contract tests
├── src/               # TypeScript source code
│   └── lib/          # Libraries and utilities
├── server.js         # MCP server
└── hardhat.config.ts # Hardhat configuration
```

## Available Scripts

- `npm run compile` - Compile smart contracts
- `npm test` - Run contract tests
- `npm run build` - Build TypeScript
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check without emitting
- `npm run node` - Start local Hardhat node
- `npm run deploy` - Deploy contracts

## Environment Variables

Create a `.env` file with:

```env
# Coinbase CDP API Keys
CDP_API_KEY_NAME=your_key_name
CDP_API_KEY_PRIVATE_KEY=your_private_key

# Private Key (for deployments)
PRIVATE_KEY=your_private_key_without_0x

# RPC URLs (optional)
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Block Explorer API Key
BASESCAN_API_KEY=your_basescan_api_key
```

**🚨 SECURITY WARNING:** Never commit `.env` file or private keys to version control!

## Development

1. Start local Hardhat node:
   ```bash
   npm run node
   ```

2. In another terminal, deploy contracts:
   ```bash
   npm run deploy
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Networks

- **Local:** Hardhat Network (chainId: 1337)
- **Base Mainnet:** chainId 8453
- **Base Sepolia Testnet:** chainId 84532

## License

ISC
>>>>>>> 614694d (Add Hardhat, TypeScript, ESLint, and project structure)
