# /update Skill

Run system maintenance updates for the development environment.

## Usage
```
/update
```

## What It Does
1. Updates Homebrew packages
2. Updates npm global packages
3. Updates Foundry (forge, cast, anvil)
4. Shows version changes (old → new)
5. Verifies tools still work after update

## Options
- `/update brew` — Only Homebrew
- `/update npm` — Only npm globals
- `/update foundry` — Only Foundry
- `/update all` — Full update (default)

## Notes
- Always shows checklist before proceeding
- Asks for confirmation before major updates
- Reports any failures immediately
