# Night 19: HireWrite - Job Description Generator

Generate inclusive, optimized job postings with built-in bias detection. HireWrite helps HR teams, hiring managers, and startups create professional job descriptions that attract diverse talent.

## Features

- **Role Input Wizard** - Step-by-step form for title, department, level, location, and work mode (remote/hybrid/onsite)
- **Requirements Builder** - Separate must-have and nice-to-have skills, experience, and education inputs
- **Company Info** - Add company name, mission, benefits, and culture description
- **Tone Selector** - Choose from startup-casual, corporate-formal, or creative writing styles
- **Industry Templates** - Pre-built templates for Technology, Healthcare, Finance, Education, and Creative industries
- **Bias Detection** - Scans generated text for gender-coded, age-biased, ability-biased, and exclusionary language with specific suggestions
- **Inclusivity Score** - Numerical score showing how inclusive your job description is
- **Copy & Export** - One-click copy to clipboard or export as Markdown file

## Revenue Model

- $5 per individual job post
- $29/month unlimited plan

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (dark theme, violet-500 accent)
- **Generation**: Template-based (no external AI APIs)
- **Testing**: Custom test runner with tsx

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate a job description from role details |
| POST | `/api/bias-check` | Scan text for biased/exclusionary language |
| GET | `/api/templates` | Return industry-specific JD templates |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npx tsx test.ts
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy with zero configuration (Next.js auto-detected)

```bash
npx vercel --prod
```

## Project Structure

```
night-19-hirewrite/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # JD generation endpoint
│   │   ├── bias-check/route.ts  # Bias detection endpoint
│   │   └── templates/route.ts   # Templates endpoint
│   ├── globals.css              # Tailwind imports + dark theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main UI with wizard
├── lib/
│   ├── generator.ts             # Template-based JD generation
│   ├── bias-detector.ts         # Bias detection engine
│   └── templates.ts             # Industry templates
├── test.ts                      # Test suite (25+ assertions)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```
