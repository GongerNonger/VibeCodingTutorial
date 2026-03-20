# Night 16: RFPReply -- AI RFP & Grant Application Response Writer

RFPReply helps small businesses and nonprofits compete for government/corporate contracts and grants by generating tailored draft responses for each RFP section based on your company profile.

## Features

- **RFP Parsing**: Paste full RFP or grant application text and automatically extract sections (numbered, header-based, or paragraph-based)
- **Company Profiles**: Store company details including name, description, capabilities, past projects, and team size
- **Tailored Responses**: Generate section-by-section responses that weave in your company's specific qualifications and experience
- **Tone Selector**: Choose between formal, persuasive, or technical response styles
- **Copy Controls**: Copy individual sections or the full response with one click
- **Dark Theme**: Professional dark UI with indigo accent colors

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: In-memory profile store
- **Generation**: Template-based response engine (no external AI API calls)

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Parse RFP text into structured sections |
| POST | `/api/generate` | Generate tailored responses for parsed sections |
| GET | `/api/profiles` | Retrieve all saved company profiles |
| POST | `/api/profiles` | Create or update a company profile |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Test

```bash
npm run build
npx tsx test.ts
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or build and run with Node.js:

```bash
npm run build
npm start
```

## Revenue Model

- **$29** per individual RFP response
- **$79/month** for unlimited responses
