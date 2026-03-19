# Overnight Business Factory

## Project Purpose
Rapidly build and deploy micro-businesses using Claude Code agent teams. Each business should be shippable in one evening session.

## Code Style
- TypeScript/JavaScript with ES modules
- React + Tailwind CSS for frontends
- Node.js/Express or Next.js for backends
- SQLite or Supabase for databases
- Keep dependencies minimal - ship fast

## Workflow
- Use agent teams for parallel development (frontend + backend + tests)
- Run `npm test` before committing
- Each business lives in its own directory under `businesses/`
- Every business must have: README, working demo, deployment instructions

## Architecture
- `businesses/` - Each overnight business project
- `teams/` - Team structure definitions for agent coordination
- `framework/` - Shared execution framework and templates
- `progress/` - Nightly progress logs and status updates
