# Smash.xyz AI Coding Instructions

## Project Overview
Smash.xyz is a Web3 competitive challenge platform where users create "Smashes" (challenges), stake funds, submit proofs, and bet on outcomes. Built with Next.js 16 App Router, Privy wallet auth, and Supabase backend.

## Architecture

### Key Directories
- `src/app/` - Next.js App Router pages (all use `'use client'` directive)
- `src/components/` - React components; `ui/` contains Shadcn primitives
- `src/store/` - Zustand stores for state management
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utilities, Supabase client, mock data

### Data Flow
1. **Auth**: Privy handles wallet/email/OAuth → provides `user.wallet.address`
2. **State**: Zustand stores (`use-store.ts`, `use-create-smash.ts`) manage client state
3. **Database**: Supabase with typed client in `lib/supabase.ts`
4. **Chain**: Polygon network via Viem, configured in `providers.tsx`

## Conventions

### Components
- Use `'use client'` at top of interactive components
- Import UI primitives from `@/components/ui/*` (Shadcn)
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Follow existing card pattern in `smash-card.tsx` for feature cards

### Styling
- Dark theme: `bg-black`, `text-white`, `border-gray-800`
- Brand purple gradient: `from-purple-500 to-blue-500`
- Category colors defined inline (see `getCategoryColor` in `smash-card.tsx`)
- Tailwind classes only; no CSS modules

### State Management
```tsx
// Pattern for Zustand stores
import { create } from 'zustand';

export const useMyStore = create<MyState>((set) => ({
  value: initialValue,
  setValue: (v) => set({ value: v }),
}));
```

### Multi-Step Forms
Follow `components/create/` pattern:
- Container component with step state (`CreateSmashForm.tsx`)
- Individual step components receiving store hooks
- Progress bar with step indicators
- `nextStep()`/`prevStep()` actions in store

### Wallet Integration
```tsx
// Access wallet via Privy hook
const { authenticated, user, login, logout } = usePrivy();
const address = user?.wallet?.address;
```

## Types
Core types in `src/types/index.ts`:
- `Smash` - Challenge with stakes, participants, verification method
- `SmashCategory` - fitness | gaming | creative | food | professional | absurd
- `SmashStatus` - upcoming | active | completed | cancelled
- `VerificationMethod` - creator | participant-vote | community-vote | automated | hybrid

## Development

### Commands
```bash
npm run dev    # Start dev server on localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy authentication
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

### Key Documentation
- `SMASH_SPEC.md` - Full feature specification, consensus methods, lifecycle
- `PROJECT_SUMMARY.md` - Session progress and tech stack
- `NEXT_STEPS.md` - Implementation roadmap and pending SQL migrations

## Important Patterns

### Page Structure
```tsx
// All pages follow this layout pattern
export default function PageName() {
  return (
    <>
      <header className="border-b border-gray-800 bg-black">
        {/* Logo + WalletConnect */}
      </header>
      <main className="min-h-screen bg-black text-white">
        {/* Content */}
      </main>
    </>
  );
}
```

### Adding New Steps to Create Flow
1. Create `StepNewFeature.tsx` in `components/create/`
2. Add state fields to `use-create-smash.ts` store
3. Register step in `CreateSmashForm.tsx` steps array and switch case

## Current Status
- ✅ Homepage, wallet auth, smash cards working
- ✅ Create smash multi-step form structure complete
- 🔲 Supabase integration for persistence
- 🔲 Smart contracts for escrow/betting
