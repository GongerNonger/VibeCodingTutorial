# Velocity x UVU — AI Academic Advisor Demo

> AI-powered academic advising prototype built specifically for **Utah Valley University**. Personalized degree guidance, course recommendations, and career pathway analysis for UVU Wolverines.

## Quick Start (Host from Your Browser)

```bash
cd businesses/night-21-velocity-uvu-demo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it!

## What You'll See

### Student Dashboard (/)
- **6 UVU students** across CS, IT, Business, Digital Marketing, and Cybersecurity
- Degree progress with UVU-green (#275D38) branding
- AI-powered course recommendations using real UVU course codes (CS 2420, IT 2300, MKTG 3400, etc.)
- Career pathway matching with salary data and skill gap analysis
- Risk alerts for GPA, graduation timeline, and credit pace

### Admin Dashboard (/admin)
- Institutional analytics for UVU
- Program distribution across colleges
- Workforce readiness indicators and common skill gaps
- Graduation rate projections

## UVU Data Included

- **5 Degree Programs:** Computer Science, Information Technology, Business Management, Digital Marketing, Cybersecurity
- **25 Courses** with real UVU course codes across CS, IT, MGMT, MKTG, STAT, MATH departments
- **6 Sample Students** at different stages across the College of Engineering & Technology and Woodbury School of Business
- **11 Career Paths** with salary data and growth rates
- **UVU Branding:** Green (#275D38), Wolverines, Orem Utah

## Revenue Model (B2B)

- **Target:** UVU and similar institutions
- **Pricing:** $100K/year platform fee + $25/student (UVU has ~41,000 students)
- **Potential deal size:** ~$1.1M/year for UVU alone

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Dark theme with UVU green (#275D38) accents
- No external APIs — all logic runs locally

## Running Tests

```bash
npm test
```

## Deployment

```bash
npx vercel
```

No environment variables needed.
