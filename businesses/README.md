# 25 Overnight Businesses - Built with Claude Code Agent Teams

## How This Works

Each business below is designed to be **built in a single evening** using Claude Code's multi-agent capabilities. Agent teams work in parallel — frontend, backend, testing, and deployment happening simultaneously.

### Research: How Teams Work with Claude Code

Based on extensive research of Claude Code's capabilities, here's how we leverage agent teams:

**Agent Teams Architecture:**
- One **lead session** coordinates the build
- 3-5 **teammate agents** work in parallel on separate concerns
- Each teammate operates in an **isolated git worktree** (no merge conflicts)
- Teammates communicate via **shared task lists** with dependency resolution
- Hooks auto-format code, run tests, and handle deployment

**Optimal Team Size:** 3-5 agents per build (diminishing returns beyond that)
**Task Sizing:** 5-6 tasks per teammate prevents bottlenecks

---

## The 25 Businesses

### TIER 1: API/Tool Businesses (Nights 1-5)
*Fastest to build. Single-purpose tools that solve one pain point.*

#### Night 1: **InstaLanding** - AI Landing Page Generator
- **What:** Paste a product description, get a conversion-optimized landing page
- **Revenue:** $9/mo for 10 pages, $29/mo unlimited
- **Stack:** Next.js + Tailwind + Claude API
- **Why overnight:** Single API call generates HTML, minimal backend needed
- **Team:** Frontend (page builder UI) + Backend (Claude API integration) + Deploy (Vercel)

#### Night 2: **ColdMailCraft** - AI Cold Email Writer
- **What:** Input target company + your product → get personalized cold email sequences
- **Revenue:** $19/mo for 100 emails, $49/mo unlimited
- **Stack:** Next.js + Claude API + email templates
- **Why overnight:** Form → API → formatted output. Clean and simple.
- **Team:** Frontend (input wizard) + Backend (prompt engineering) + Templates (email designs)

#### Night 3: **SEOBrief** - Blog Post Brief Generator
- **What:** Enter a keyword, get a full content brief with outline, word count targets, competitor analysis
- **Revenue:** $15/mo starter, $39/mo agency
- **Stack:** Next.js + Claude API + SerpAPI for competitor data
- **Why overnight:** API mashup — combine search data with AI analysis
- **Team:** Frontend (dashboard) + Backend (API orchestration) + Data (search integration)

#### Night 4: **ContractSnap** - Freelancer Contract Generator
- **What:** Fill in project details, get a legally-informed freelance contract
- **Revenue:** $5 per contract or $19/mo unlimited
- **Stack:** Next.js + Claude API + PDF generation
- **Why overnight:** Form → AI → PDF pipeline is straightforward
- **Team:** Frontend (contract wizard) + Backend (document gen) + Legal (template library)

#### Night 5: **APIDocWriter** - Auto API Documentation
- **What:** Upload OpenAPI spec or paste endpoints, get beautiful API docs
- **Revenue:** $29/mo per project
- **Stack:** Next.js + Claude API + syntax highlighting
- **Why overnight:** Parse spec → generate docs → render. Well-scoped.
- **Team:** Frontend (doc renderer) + Backend (spec parser) + Styling (theme engine)

---

### TIER 2: Content/Creator Businesses (Nights 6-10)
*Higher perceived value. Serve the massive creator economy.*

#### Night 6: **ThreadSmith** - Twitter/X Thread Generator
- **What:** Paste an article or idea, get a viral-format thread with hooks
- **Revenue:** $12/mo basic, $29/mo with scheduling integration
- **Stack:** Next.js + Claude API + Twitter character counting
- **Why overnight:** Text in → formatted threads out. Add analytics later.
- **Team:** Frontend (thread preview) + Backend (AI generation) + Social (formatting logic)

#### Night 7: **PodScript** - Podcast Show Notes Generator
- **What:** Upload transcript or audio → get show notes, timestamps, key takeaways, social posts
- **Revenue:** $19/mo per podcast
- **Stack:** Next.js + Whisper API + Claude API
- **Why overnight:** Transcription → AI summary pipeline
- **Team:** Frontend (upload/display) + Backend (transcription) + Content (summary generation)

#### Night 8: **CourseForge** - Mini-Course Builder
- **What:** Describe a topic, get a structured 5-lesson mini-course with quizzes
- **Revenue:** $39/mo for course creators
- **Stack:** Next.js + Claude API + Markdown rendering
- **Why overnight:** Structured content generation with templates
- **Team:** Frontend (course player) + Backend (content gen) + UX (quiz engine)

#### Night 9: **NewsletterPilot** - Newsletter Content Assistant
- **What:** Input your niche + this week's topics → get a ready-to-send newsletter
- **Revenue:** $15/mo hobby, $39/mo professional
- **Stack:** Next.js + Claude API + email-safe HTML
- **Why overnight:** Topic research → writing → formatting pipeline
- **Team:** Frontend (editor) + Backend (content gen) + Email (HTML templates)

#### Night 10: **ThumbnailCopy** - YouTube Thumbnail Text Optimizer
- **What:** Analyze top-performing thumbnails in your niche, suggest text overlays
- **Revenue:** $9/mo
- **Stack:** Next.js + Claude API (vision) + Canvas for preview
- **Why overnight:** Simple analysis tool with visual preview
- **Team:** Frontend (preview canvas) + Backend (image analysis) + Data (niche research)

---

### TIER 3: Developer Tools (Nights 11-15)
*Developers pay well for things that save them time.*

#### Night 11: **RegexGenie** - Natural Language to Regex
- **What:** Describe what you want to match in plain English, get tested regex
- **Revenue:** Free tier + $9/mo for saved patterns and API access
- **Stack:** Next.js + Claude API + regex testing engine
- **Why overnight:** Ultra-focused tool, minimal UI needed
- **Team:** Frontend (regex tester) + Backend (AI + validation) + Tests (edge case library)

#### Night 12: **GitBlame** - PR Review Summary Bot
- **What:** GitHub App that auto-summarizes PRs and suggests review focus areas
- **Revenue:** $19/mo per repo, $49/mo org
- **Stack:** Next.js + GitHub API + Claude API
- **Why overnight:** Webhook → analyze diff → post comment
- **Team:** Frontend (dashboard) + Backend (GitHub integration) + AI (review logic)

#### Night 13: **EnvGuard** - .env File Security Scanner
- **What:** Scan repos for leaked secrets, suggest rotation, generate secure configs
- **Revenue:** $15/mo per project
- **Stack:** Next.js + file analysis + pattern matching
- **Why overnight:** Pattern matching + Claude for context analysis
- **Team:** Frontend (report dashboard) + Backend (scanner engine) + Security (pattern library)

#### Night 14: **MigrateBot** - Database Migration Generator
- **What:** Describe schema changes in English, get migration files for your ORM
- **Revenue:** $19/mo
- **Stack:** Next.js + Claude API + ORM template library
- **Why overnight:** Natural language → code generation for known formats
- **Team:** Frontend (schema visualizer) + Backend (migration gen) + Templates (ORM support)

#### Night 15: **CronSpeak** - Cron Expression Builder
- **What:** Describe schedule in English, get cron expression with visual timeline
- **Revenue:** Freemium + $5/mo for monitoring integration
- **Stack:** Next.js + Claude API + cron parser + timeline viz
- **Why overnight:** Tiny scope, high utility, great SEO potential
- **Team:** Frontend (timeline viz) + Backend (parser) + Integration (monitoring hooks)

---

### TIER 4: Small Business Tools (Nights 16-20)
*Non-technical users will pay premium for simplicity.*

#### Night 16: **InvoiceAI** - Smart Invoice Generator
- **What:** Describe work done, get professional invoice with line items auto-generated
- **Revenue:** Free for 3/mo, $12/mo unlimited
- **Stack:** Next.js + Claude API + PDF generation
- **Why overnight:** Form → AI structuring → PDF output
- **Team:** Frontend (invoice preview) + Backend (AI + PDF) + Templates (invoice designs)

#### Night 17: **ReviewReply** - Google Review Response Writer
- **What:** Paste customer reviews, get professional response suggestions
- **Revenue:** $19/mo per business location
- **Stack:** Next.js + Claude API + tone controls
- **Why overnight:** Input → AI with persona → formatted responses
- **Team:** Frontend (review dashboard) + Backend (response gen) + Tone (persona engine)

#### Night 18: **MenuMaker** - Restaurant Menu Builder
- **What:** Input dishes and prices, get a beautiful digital menu with QR code
- **Revenue:** $15/mo per restaurant
- **Stack:** Next.js + Tailwind + QR generation
- **Why overnight:** Template-driven with customization. Mostly frontend.
- **Team:** Frontend (menu designer) + Backend (data/QR) + Templates (menu themes)

#### Night 19: **HireWrite** - Job Description Generator
- **What:** Input role details, get an inclusive, optimized job posting
- **Revenue:** $5 per post or $29/mo unlimited
- **Stack:** Next.js + Claude API + bias detection
- **Why overnight:** Structured input → AI generation with guidelines
- **Team:** Frontend (job wizard) + Backend (AI generation) + Quality (bias checker)

#### Night 20: **MeetingMemo** - Meeting Notes Summarizer
- **What:** Paste meeting transcript, get action items, decisions, and summary
- **Revenue:** $15/mo individual, $49/mo team
- **Stack:** Next.js + Claude API + export formats
- **Why overnight:** Transcript → structured extraction. Core AI task.
- **Team:** Frontend (notes viewer) + Backend (AI extraction) + Export (PDF/Notion/Slack)

---

### TIER 5: Niche/Creative Businesses (Nights 21-25)
*Unique ideas with less competition. Higher margins.*

#### Night 21: **NameForge** - Business Name Generator + Domain Checker
- **What:** Describe your business, get creative names with instant domain availability
- **Revenue:** $5 one-time or $9/mo for saved searches
- **Stack:** Next.js + Claude API + domain availability API
- **Why overnight:** AI naming + API check. Fast and valuable.
- **Team:** Frontend (name cards) + Backend (AI + domain API) + Data (TLD checking)

#### Night 22: **PitchDeck** - AI Pitch Deck Outline Generator
- **What:** Describe your startup, get a structured pitch deck outline with talking points
- **Revenue:** $19 per deck or $39/mo unlimited
- **Stack:** Next.js + Claude API + slide framework
- **Why overnight:** Structured output from business description input
- **Team:** Frontend (slide preview) + Backend (deck generation) + Templates (slide designs)

#### Night 23: **CommitPoet** - Fun Git Commit Message Generator
- **What:** Paste your diff, get creative/funny commit messages (or professional ones)
- **Revenue:** Free tool with sponsorships + premium personas
- **Stack:** Next.js + Claude API + Git diff parser
- **Why overnight:** Tiny product, high virality potential
- **Team:** Frontend (diff viewer) + Backend (message gen) + Fun (persona library)

#### Night 24: **LeaseEye** - Apartment Lease Analyzer
- **What:** Upload lease PDF, get plain-English summary of key terms and red flags
- **Revenue:** $9 per analysis or $19/mo
- **Stack:** Next.js + PDF parsing + Claude API
- **Why overnight:** PDF extraction → AI analysis pipeline
- **Team:** Frontend (report view) + Backend (PDF parser) + AI (legal analysis)

#### Night 25: **WeddingSpeech** - Wedding Speech Writer
- **What:** Input details about the couple, get a heartfelt, personalized speech
- **Revenue:** $15 per speech
- **Stack:** Next.js + Claude API + tone/length controls
- **Why overnight:** Form → AI with emotional intelligence → polished output
- **Team:** Frontend (speech editor) + Backend (AI writing) + Quality (tone calibration)

---

## Revenue Summary

| Tier | Businesses | Price Range | Potential MRR (100 users each) |
|------|-----------|-------------|-------------------------------|
| API/Tools | 5 | $5-29/mo | $4,500-14,500 |
| Content/Creator | 5 | $9-39/mo | $4,500-19,500 |
| Developer Tools | 5 | $5-49/mo | $2,500-24,500 |
| Small Business | 5 | $5-49/mo | $2,500-24,500 |
| Niche/Creative | 5 | $5-39/mo | $2,500-19,500 |
| **TOTAL** | **25** | | **$16,500-102,500/mo** |

---

## Execution Schedule

Each night follows the same pattern:
1. **7:00 PM** - Spawn agent team, kick off parallel development
2. **7:30 PM** - Frontend + Backend + Tests working simultaneously
3. **9:00 PM** - Integration, testing, bug fixes
4. **10:00 PM** - Deploy to Vercel/Railway, set up domain
5. **10:30 PM** - Create landing page, write copy
6. **11:00 PM** - Ship it. Post on Twitter/Reddit/HN

See `teams/` for detailed agent team configurations.
See `progress/` for nightly build logs.
