# MAINTENANCE.md — System Update & Environment Maintenance

---

## Quick Update (Interactive)

```
Update my dev environment: 1) brew packages, 2) npm global packages, 3) list any outdated CLI tools. Show me a checklist first, then proceed step by step.
```

---

## Headless Mode (Unattended)

```bash
claude -p "Update homebrew packages and npm globals. List what was updated with old->new versions. Be concise." \
  --allowedTools "Bash,Read" \
  > ~/maintenance-report-$(date +%Y%m%d).txt
```

---

## Autonomous Maintenance Agent

```
I want you to act as my autonomous system maintenance agent. First, create a
comprehensive TODO list of everything that needs updating: brew packages, npm
global packages, pip packages, system software updates, VS Code extensions,
and any language version managers (nvm, pyenv, rbenv).

Then systematically work through each category: check current versions,
identify what's outdated, document any breaking changes in release notes,
and execute updates. Run updates in parallel where safe.

After each category, write a brief status report. If any update fails,
document the error, attempt a rollback if needed, and continue with
remaining updates.

Conclude with a full summary of what was updated, what failed, and any
manual actions I need to take.
```

---

## Self-Healing Update Pipeline

```
Create a self-testing update system for my development environment.

First, establish baseline tests: verify that git, node, python, forge, cast,
anvil, and my other key tools return expected version formats and can execute
basic commands. Store these as executable test scripts.

Then perform system updates, and after each major update, re-run the test
suite. If any test fails, automatically investigate the cause, attempt fixes
(reinstall, path adjustments, version pinning), and re-test.

Document everything in a markdown report.
```

---

## Manual Update Checklist

```bash
# 1. Homebrew
brew update && brew upgrade && brew cleanup

# 2. Node.js / npm
nvm install --lts && nvm alias default node
npm update -g

# 3. Foundry
foundryup

# 4. Verify
echo "Node: $(node --version)"
echo "Forge: $(forge --version)"
echo "Cast: $(cast --version)"
```

---

## Maintenance Schedule

| Frequency | What |
|-----------|------|
| Weekly | Brew + npm globals |
| Bi-weekly | Full environment audit |
| Monthly | Self-healing pipeline |
| Before major project | Full pipeline |

---

## SMASH-Specific Maintenance

### Database
```bash
# Check Supabase status
# Visit: https://supabase.com/dashboard/project/pdjrexphjivdwfbvgbqm

# Export schema
# SQL Editor → Run: \d smashes
```

### Dependencies
```bash
# Check for outdated packages
pnpm outdated

# Update all (careful!)
pnpm update

# Update specific package
pnpm update @privy-io/react-auth
```

### Contracts
```bash
# Update Foundry
foundryup

# Rebuild contracts
cd contracts && forge build

# Run tests
forge test -vvvv
```
