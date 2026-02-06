# CURRENT_SPRINT.md

> **Purpose**: Active tasks with machine-checkable acceptance criteria. Claude Code checks this at session start.

---

## Sprint: MVP Completion

### Goal
> Complete the core smash flow: create, join, submit proof, verify.

---

## Tasks

### 🔴 Not Started

#### TASK-001: Smash Detail Page
- **Priority**: P0
- **Scope**: `src/app/smash/[id]/page.tsx`, `src/components/smash/`
- **Acceptance Criteria**:
  - [ ] Route `/smash/[id]` loads smash data from Supabase
  - [ ] Displays title, description, dates, entry fee, participants
  - [ ] Shows join button for non-participants
  - [ ] Shows proof submission button for participants
  - [ ] `pnpm typecheck` passes with zero errors
- **Dependencies**: None
- **Notes**: Basic read-only view first, then add interactions

#### TASK-002: Join Smash Flow
- **Priority**: P0
- **Scope**: `src/hooks/usePayment.ts`, `src/components/payment/`
- **Acceptance Criteria**:
  - [ ] User can pay entry fee (ETH or USDC)
  - [ ] Payment recorded in SmashVault contract
  - [ ] Participant added to Supabase `participants` table
  - [ ] UI shows success/error states
  - [ ] `pnpm typecheck` passes
- **Dependencies**: TASK-001
- **Notes**: Use existing `usePayment` hook

#### TASK-003: Proof Submission
- **Priority**: P1
- **Scope**: `src/components/proof/`, `src/app/api/proof/`
- **Acceptance Criteria**:
  - [ ] Participant can upload image/video proof
  - [ ] Proof stored in Supabase Storage
  - [ ] Submission record created in `submissions` table
  - [ ] Proof visible on smash detail page
  - [ ] `pnpm typecheck` passes
- **Dependencies**: TASK-001, TASK-002
- **Notes**: Visual proof only for MVP

---

### 🟡 In Progress

> Move tasks here when work begins. Note the session/branch.

---

### 🟢 Done

> Move tasks here when ALL acceptance criteria checkboxes are checked.

#### TASK-000: Create Smash Form
- **Completed**: Session 8
- **Acceptance Criteria**: ✅ All passed
- **Notes**: 8-step wizard complete, saves to Supabase

---

## Writing Good Acceptance Criteria

**Good** (machine-checkable):
- `forge test --match-test testStakeTokens` passes
- `curl localhost:3000/api/health` returns `{"status":"ok"}`
- `pnpm lint` exits with code 0
- Component renders with test data, no console errors
- Database migration applies without error

**Bad** (subjective/vague):
- "Staking works correctly"
- "UI looks good"
- "Performance is acceptable"
