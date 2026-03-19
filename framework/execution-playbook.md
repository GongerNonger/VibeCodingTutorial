# Overnight Business Execution Playbook

## Pre-Flight Checklist (Before Each Night)

### 1. Environment Setup (5 min)
```bash
# Create the business directory
mkdir -p businesses/night-XX-business-name
cd businesses/night-XX-business-name

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir

# Install common dependencies
npm install @anthropic-ai/sdk
```

### 2. Configure CLAUDE.md for the Business (5 min)
Create a business-specific CLAUDE.md with:
- What the product does (1 sentence)
- Revenue model
- Core features (3-5 bullet points)
- Tech stack specifics
- API keys needed

### 3. Spawn Agent Team (2 min)
```
Create an agent team to build [Business Name]:
- Frontend teammate: Build the UI with [specific pages/components]
- Backend teammate: Build the API with [specific endpoints]
- QA/Deploy teammate: Write tests and deploy to Vercel
```

---

## Execution Timeline (Per Night)

### Phase 1: Parallel Build (7:00 PM - 9:00 PM)

**Frontend Agent Tasks:**
1. Create main page layout with responsive design
2. Build input form/wizard with validation
3. Create output display/preview component
4. Add loading states and error handling
5. Polish UI with animations and micro-interactions

**Backend Agent Tasks:**
1. Set up API route structure
2. Implement core business logic
3. Integrate Claude API with optimized prompts
4. Add rate limiting and input validation
5. Set up database if needed (SQLite/Supabase)

**QA/Deploy Agent Tasks (Phase 1):**
1. Set up testing framework (Vitest/Jest)
2. Write unit tests for business logic
3. Prepare deployment configuration
4. Set up environment variables template

### Phase 2: Integration (9:00 PM - 10:00 PM)

**Lead Agent coordinates:**
1. Connect frontend forms to backend API
2. Test full user flow end-to-end
3. Fix any integration issues
4. Run full test suite

### Phase 3: Ship It (10:00 PM - 11:00 PM)

**Deploy Agent:**
1. Deploy to Vercel (`vercel --prod`)
2. Configure custom domain (if available)
3. Set up environment variables in production
4. Verify production deployment

**Lead Agent:**
1. Create README with setup instructions
2. Write launch copy for social media
3. Create progress log entry
4. Screenshot the live product

---

## Prompt Templates

### Frontend Agent Prompt
```
You are building the frontend for [Business Name].

Product: [one-line description]
Pages needed:
- / (landing page with hero, features, CTA)
- /app (main application interface)
- /pricing (if applicable)

Tech: Next.js 14 App Router, Tailwind CSS, TypeScript

Requirements:
- Mobile-first responsive design
- Clean, modern SaaS aesthetic
- Loading states for all async operations
- Form validation with clear error messages
- Dark mode support via Tailwind

Do NOT touch any files in app/api/ or lib/ — those belong to the backend team.
```

### Backend Agent Prompt
```
You are building the backend for [Business Name].

Product: [one-line description]
API endpoints needed:
- POST /api/generate - [main functionality]
- GET /api/health - health check

Tech: Next.js 14 API Routes, TypeScript, Claude API

Requirements:
- Input validation with Zod
- Rate limiting (10 requests/min per IP)
- Streaming responses where applicable
- Error handling with proper HTTP codes
- TypeScript types in types/ directory

Do NOT touch any files in app/page.tsx or app/components/ — those belong to the frontend team.
```

### QA Agent Prompt
```
You are the QA and deployment engineer for [Business Name].

Responsibilities:
1. Write tests in __tests__/ directory
2. Test API endpoints with various inputs (valid, invalid, edge cases)
3. Test UI components render correctly
4. Deploy to Vercel when all tests pass
5. Verify production deployment works

Tech: Vitest for testing, Vercel for deployment

Do NOT modify source code in app/ or lib/ — only create test files and deployment configs.
```

---

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] OpenGraph meta tags for social sharing
- [ ] Analytics tracking (Plausible/Umami)
- [ ] Error monitoring (Sentry free tier)
- [ ] README with local development instructions
- [ ] Screenshots in progress log

---

## Post-Launch Tasks (Next Morning)

1. **Check analytics** - Did anyone visit?
2. **Monitor errors** - Anything breaking?
3. **Social media** - Post on Twitter, Reddit, HN, IndieHackers
4. **Iterate** - Fix any user-reported issues
5. **Document learnings** - What went well? What to improve?

---

## Cost Management

### Per-Business Estimates
- Claude API (development): ~$5-15 per night (agent team tokens)
- Claude API (production): $0.01-0.05 per user request
- Vercel hosting: Free tier (hobby)
- Domain: $10/year (optional, use .vercel.app initially)
- Total per business: **~$15-25 to launch**

### Token Optimization
- Use Haiku for research/exploration subagents
- Use Sonnet for implementation agents
- Keep CLAUDE.md concise (every line costs tokens)
- Use `/clear` between major phases
- Delegate verbose operations (test output) to subagents
