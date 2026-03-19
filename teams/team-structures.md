# Agent Team Structures for Overnight Business Builds

## How Claude Code Agent Teams Work

Claude Code supports **coordinated parallel development** through agent teams:
- A **lead session** breaks down the project and assigns tasks
- **3-5 teammate agents** work simultaneously in isolated git worktrees
- Teammates communicate via shared task lists with dependency tracking
- Each teammate has its own context window and tool access
- Hooks handle auto-formatting, testing, and quality checks

---

## Team Configurations

### Team Alpha: "Full-Stack Builder" (Most Common)
**Use for:** API tools, content generators, any business with a frontend + backend

```
Lead Agent (Coordinator)
├── Agent 1: Frontend Engineer
│   - Build UI with React/Next.js + Tailwind
│   - Create responsive layouts
│   - Handle form validation and UX
│   - Tools: Edit, Write, Bash(npm)
│
├── Agent 2: Backend Engineer
│   - Build API routes and business logic
│   - Integrate Claude API / external APIs
│   - Set up database schema
│   - Tools: Edit, Write, Bash(npm, curl)
│
├── Agent 3: QA & Deployment
│   - Write tests (unit + integration)
│   - Set up CI/CD pipeline
│   - Deploy to Vercel/Railway
│   - Configure domain and env vars
│   - Tools: Edit, Write, Bash(npm, vercel, git)
```

**Assigned to Nights:** 1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 14, 16, 17, 19, 20, 21, 22, 24, 25

---

### Team Beta: "Template Factory"
**Use for:** Businesses that are primarily about beautiful output (menus, invoices, decks)

```
Lead Agent (Coordinator)
├── Agent 1: Template Designer
│   - Create 3-5 beautiful templates
│   - Responsive HTML/CSS designs
│   - Print-ready PDF layouts
│   - Tools: Edit, Write
│
├── Agent 2: Customization Engine
│   - Build the form/wizard interface
│   - Dynamic preview rendering
│   - Color/font/layout controls
│   - Tools: Edit, Write, Bash(npm)
│
├── Agent 3: Export & Deploy
│   - PDF generation pipeline
│   - QR code generation
│   - Image export
│   - Deployment
│   - Tools: Edit, Write, Bash(npm, vercel)
```

**Assigned to Nights:** 4, 8, 16, 18, 22

---

### Team Gamma: "API Mashup"
**Use for:** Businesses that combine multiple external APIs

```
Lead Agent (Coordinator)
├── Agent 1: API Integration Specialist
│   - Connect external APIs (search, domain, GitHub)
│   - Handle rate limiting and caching
│   - Error handling and fallbacks
│   - Tools: Edit, Write, Bash(npm, curl)
│
├── Agent 2: AI Orchestrator
│   - Craft prompts for Claude API
│   - Build processing pipelines
│   - Handle streaming and chunking
│   - Tools: Edit, Write, Bash(npm)
│
├── Agent 3: Frontend + Deploy
│   - Build dashboard UI
│   - Real-time status updates
│   - Deploy and configure
│   - Tools: Edit, Write, Bash(npm, vercel, git)
```

**Assigned to Nights:** 3, 5, 10, 12, 13, 21

---

### Team Delta: "Micro-Tool"
**Use for:** Tiny, focused tools (regex builder, cron builder, commit messages)

```
Lead Agent (Coordinator)
├── Agent 1: Core Logic + UI
│   - Build the entire tool (small scope)
│   - Both frontend and core logic
│   - Tools: Edit, Write, Bash(npm)
│
├── Agent 2: Polish & Edge Cases
│   - Comprehensive test suite
│   - Edge case handling
│   - Performance optimization
│   - Accessibility
│   - Tools: Edit, Write, Bash(npm)
```

**Assigned to Nights:** 11, 15, 23

---

## Night-to-Team Assignment Table

| Night | Business | Team | Agents | Est. Hours |
|-------|----------|------|--------|------------|
| 1 | InstaLanding | Alpha | 3 | 3-4 |
| 2 | ColdMailCraft | Alpha | 3 | 3-4 |
| 3 | SEOBrief | Gamma | 3 | 4 |
| 4 | ContractSnap | Beta | 3 | 3-4 |
| 5 | APIDocWriter | Gamma | 3 | 4 |
| 6 | ThreadSmith | Alpha | 3 | 3 |
| 7 | PodScript | Alpha | 3 | 4 |
| 8 | CourseForge | Beta | 3 | 4 |
| 9 | NewsletterPilot | Alpha | 3 | 3-4 |
| 10 | ThumbnailCopy | Gamma | 3 | 3 |
| 11 | RegexGenie | Delta | 2 | 2-3 |
| 12 | GitBlame | Gamma | 3 | 4 |
| 13 | EnvGuard | Gamma | 3 | 3-4 |
| 14 | MigrateBot | Alpha | 3 | 3-4 |
| 15 | CronSpeak | Delta | 2 | 2-3 |
| 16 | InvoiceAI | Beta | 3 | 3-4 |
| 17 | ReviewReply | Alpha | 3 | 3 |
| 18 | MenuMaker | Beta | 3 | 3 |
| 19 | HireWrite | Alpha | 3 | 3 |
| 20 | MeetingMemo | Alpha | 3 | 3-4 |
| 21 | NameForge | Gamma | 3 | 3 |
| 22 | PitchDeck | Beta | 3 | 4 |
| 23 | CommitPoet | Delta | 2 | 2 |
| 24 | LeaseEye | Alpha | 3 | 4 |
| 25 | WeddingSpeech | Alpha | 3 | 2-3 |

---

## Agent Communication Protocol

### Task Handoff Pattern
```
Lead → "Frontend: Build the landing page with form at /app/page.tsx.
        Use Tailwind. The form needs: [field list].
        When done, update task status."

Lead → "Backend: Create API route at /app/api/generate/route.ts.
        Accept POST with [schema]. Call Claude API with [prompt template].
        Return [response format]. When done, update task status."

Lead → "QA: Once Frontend and Backend tasks complete,
        write integration tests. Then deploy to Vercel."
```

### Dependency Resolution
- Frontend and Backend work in parallel (no file conflicts)
- QA waits for both to complete before integration testing
- Deploy happens last, after all tests pass

### Conflict Avoidance Rules
1. Frontend owns: `app/page.tsx`, `app/components/`, `app/globals.css`
2. Backend owns: `app/api/`, `lib/`, `types/`
3. QA owns: `__tests__/`, `.github/`, deployment configs
4. Shared files (package.json, tsconfig) → Lead agent only
