# Smash.xyz

A competitive challenge platform where completion must be proven and verified through consensus. Think "proof or it didn't happen" meets prediction markets.

**Live Site:** https://smash.xyz

## What is a Smash?

A **Smash** is a competitive challenge between 2+ participants. Examples:
- Run a 5K in under 25 minutes
- Beat a video game boss without taking damage
- Create the best AI-generated artwork

Participants submit proof (photos, videos, fitness data) and the community verifies completion.

## Features

- **Wallet Authentication** - Connect with Privy (supports MetaMask, WalletConnect, etc.)
- **Multiple Verification Methods** - Wearable data, visual proof, participant voting, audience voting
- **Prediction Markets** - Bet on participants (public smashes only)
- **Flexible Stakes** - Monetary (USDC/ETH), prizes, or bragging rights

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Auth:** Privy
- **Database:** Supabase (PostgreSQL)
- **State:** Zustand

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/alpenflow-studios/smash.git
cd smash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

You'll need:
- **Privy App ID** - Get from [Privy Dashboard](https://dashboard.privy.io/)
- **Supabase URL & Anon Key** - Get from [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── page.tsx         # Homepage with SmashCards
│   ├── create/          # Create new smash form
│   └── layout.tsx       # Root layout with providers
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── create/          # Multi-step form components
│   ├── smash-card.tsx   # Smash preview card
│   └── wallet-connect.tsx
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── database.types.ts # Auto-generated types
├── store/
│   └── use-create-smash.ts # Zustand store for form
└── types/
    └── index.ts         # Shared TypeScript types
```

## Database Schema

Main tables in Supabase:
- `users` - Wallet addresses and profiles
- `smashes` - Challenge details
- `submissions` - Proof submissions
- `bets` - Prediction market bets

See [SMASH_SPEC.md](./SMASH_SPEC.md) for full specification.

## Deployment

The app is deployed on Vercel. Push to `main` to deploy automatically.

Make sure to set environment variables in Vercel:
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Resources

- [SMASH_SPEC.md](./SMASH_SPEC.md) - Full feature specification
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap
- [Supabase Dashboard](https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm)
- [Vercel Dashboard](https://vercel.com/classcoin/v0-smash-xyz)

## Inspiration

- [poidh.xyz](https://poidh.xyz) - Proof bounties
- [Polymarket](https://polymarket.com) - Prediction markets
- [Strava](https://strava.com) - Fitness challenges
