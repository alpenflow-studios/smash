
# Web3 Agentic Mini App – Full Stack Architecture

A unified stack for building:
- Web app
- Farcaster Mini App
- Base App (TBA) Mini App
- World App Mini App
- Agentic AI workflows

Principle: **One core app, thin host adapters.**

---

## 🧠 Architecture Philosophy

Build once with **Next.js**, then adapt to each host:
- Web = native
- Farcaster = Mini App surface
- Base = signed manifest + wallet association
- World App = MiniKit + World ID

Structure:

apps/web  
packages/ui  
packages/sdk  
packages/host-farcaster  
packages/host-base  
packages/host-world  

---

## 🎨 Frontend Stack

### Core
- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod

### Wallets / Web3
- viem
- wagmi
- WalletConnect
- Coinbase Smart Wallet

---

## 📱 Mini App Adapters

### Farcaster
- Frames v2 / Mini Apps
- Signed actions
- Context + identity

### Base App
- Signed manifest
- Account association
- Gasless UX possible

### World App
- MiniKit SDK
- World ID verification
- Built-in wallet

---

## ⚙️ Backend

### Option A (fast iteration)
- Next.js route handlers
- Postgres + Prisma
- Redis
- Trigger.dev jobs

### Option B (scaling heavy)
- Fastify or NestJS
- Temporal or BullMQ
- Postgres + Redis

---

## 🔗 Smart Contracts

- Solidity
- Foundry
- OpenZeppelin
- Deploy on Base

Optional:
- ERC-4337 Account Abstraction
- Paymaster (gasless)

Indexing:
- Ponder or The Graph

---

## 🔐 Identity Strategy

Normalize all users into a single account:

Providers:
- Farcaster identity
- Wallet address
- World ID proof

users:
  id
  identities[]

---

## 🤖 Agentic Layer

### Orchestration
- LangGraph or OpenAI Responses API

### Memory
- Postgres (state)
- pgvector (semantic memory)

### Tools
- DB access
- Chain reads/writes
- Payments
- Support workflows
- Notifications

### Safety
- Allowlisted tools only
- Human approval for funds
- Rate limits

---

## ☁️ Infra

Hosting:
- Vercel
- Cloudflare

Data:
- Supabase or Neon Postgres
- Upstash Redis

Monitoring:
- Sentry
- PostHog

---

## 🧑‍💻 Dev Workflow

1. Verbal planning
2. ChatGPT → architecture & scaffolds
3. Claude Code → large implementations
4. VS Code → tests + integration

Repo:
- Turborepo + pnpm
- Playwright tests
- Typecheck + CI

---

## 🚀 MVP Order

1. Core web app
2. Base Mini App
3. Farcaster Mini App
4. World Mini App
5. Agent workflows

---

## Suggested Stack (Quick Reference)

Frontend:
- Next.js + Tailwind + wagmi

Backend:
- Route handlers + Prisma + Postgres

Contracts:
- Solidity + Foundry + Base

Agents:
- LangGraph + pgvector

Infra:
- Vercel + Supabase + Cloudflare

---

## Summary

Build:
- One core web app
- Three host adapters
- One shared backend
- One identity layer
- One agent orchestration layer

Outcome:
Fast shipping, low complexity, and portable across ecosystems.
