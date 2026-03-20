# Night 21: Velocity - AI Academic Advisor for Higher Education

> Based on the Velocity business plan. An AI-powered academic advising platform that empowers students with personalized, data-driven guidance to graduate efficiently and transition into meaningful careers.

## Business Model

- **Target Market:** Higher education institutions (B2B to universities)
- **Revenue:** $50K-$250K annual platform fee + $20-30/student depending on institution size
- **Key Differentiator:** Student-centered AI interface vs. existing advisor-centered tools (EAB Navigate, Starfish, Degree Works)

## Features

### Student Dashboard
- **Degree Progress Tracker** - Visual progress bar showing credits completed vs. required
- **AI Advisor Insights** - Template-based recommendations for courses, pacing, and academic standing
- **Course Recommendations** - Personalized next-course suggestions based on degree requirements, career goals, and prerequisite completion
- **Career Pathway Visualization** - Match scores for career paths with skill gap analysis
- **Skills Tracker** - Current skills inventory and gaps relative to career aspirations
- **Risk Alerts** - GPA warnings, graduation delay alerts, credit pace monitoring

### Admin Dashboard (Institution View)
- **Student Retention Metrics** - On-track graduation rate, academic standing rates
- **Graduation Rate Stats** - Projected on-time completion, average degree progress
- **Department Breakdown** - Student distribution across majors
- **Workforce Readiness Indicators** - Common skill gaps, popular career aspirations
- **Institutional Analytics** - Average GPA, credits completed, career path interest

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create or update student profile |
| GET | `/api/students/[id]` | Get student profile with details |
| POST | `/api/advise` | Get AI academic advising recommendations |
| GET | `/api/degrees` | List degree programs with requirements |
| POST | `/api/career-path` | Get career pathway analysis |
| GET | `/api/analytics` | Institution-level analytics |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark theme, blue-600 accent)
- **Data:** In-memory store with pre-seeded sample data
- **AI Logic:** Template-based advising engine (no external API calls)

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

## Sample Data

- **3 Degree Programs:** Computer Science, Business Management, Marketing
- **17 Courses** across departments with prerequisites and skill mappings
- **3 Sample Students** at different stages of their academic journey
- **5 Career Paths** with salary data, growth rates, and required skills

## Deployment

1. Deploy to Vercel: `npx vercel`
2. Or build and run: `npm run build && npm start`
3. No environment variables or external services required
