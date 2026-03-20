import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  keyword: string;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  wordCount: number;
  audience: string;
}

interface ContentBrief {
  keyword: string;
  title: string;
  meta: {
    description: string;
    intent: string;
    difficulty: string;
    wordCount: number;
    audience: string;
  };
  outline: OutlineSection[];
  questionsToAnswer: string[];
  relatedKeywords: string[];
  lsiTerms: string[];
  competitors: CompetitorSnippet[];
  internalLinkingSuggestions: string[];
  contentDos: string[];
  contentDonts: string[];
}

interface OutlineSection {
  heading: string;
  tag: "h2" | "h3";
  notes: string;
  wordEstimate: number;
}

interface CompetitorSnippet {
  title: string;
  angle: string;
  gap: string;
}

// Knowledge base for generating realistic briefs
const QUESTION_STARTERS = ["What is", "How to", "Why does", "When should", "What are the best", "How much does", "Is it worth", "Can you", "What's the difference between", "How long does"];
const LSI_SUFFIXES = ["guide", "tips", "examples", "best practices", "strategies", "tools", "checklist", "template", "vs", "for beginners", "mistakes", "benefits", "cost"];
const CONTENT_DOS = [
  "Include real examples and case studies",
  "Add original data or statistics where possible",
  "Use short paragraphs (2-3 sentences max)",
  "Include a table of contents for scannability",
  "Add relevant images with descriptive alt text",
  "Link to authoritative external sources",
  "Include a clear call-to-action",
  "Use bullet points and numbered lists",
  "Answer the search query in the first 100 words",
  "Include schema markup recommendations",
];
const CONTENT_DONTS = [
  "Don't keyword stuff — use natural language",
  "Don't write thin content under the word target",
  "Don't ignore search intent mismatch",
  "Don't skip the introduction or conclusion",
  "Don't use generic stock photos",
  "Don't plagiarize competitor content",
  "Don't neglect mobile readability",
  "Don't forget internal linking opportunities",
];

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { keyword, intent, wordCount, audience } = body;

    if (!keyword || !keyword.trim()) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const validIntents = ["informational", "commercial", "transactional", "navigational"];
    if (!validIntents.includes(intent)) {
      return NextResponse.json({ error: "Intent must be informational, commercial, transactional, or navigational" }, { status: 400 });
    }

    const targetWords = Math.min(Math.max(wordCount || 1500, 500), 5000);
    const brief = generateBrief(keyword.trim(), intent, targetWords, audience || "general audience");

    return NextResponse.json({ brief });
  } catch {
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
  }
}

function generateBrief(keyword: string, intent: string, wordCount: number, audience: string): ContentBrief {
  const titleKeyword = toTitleCase(keyword);
  const title = generateTitle(titleKeyword, intent);
  const outline = generateOutline(keyword, intent, wordCount);
  const questions = generateQuestions(keyword);
  const relatedKeywords = generateRelatedKeywords(keyword);
  const lsiTerms = generateLSITerms(keyword);
  const competitors = generateCompetitors(keyword, intent);
  const internalLinks = generateInternalLinks(keyword);

  return {
    keyword,
    title,
    meta: {
      description: generateMetaDescription(keyword, intent),
      intent,
      difficulty: estimateDifficulty(keyword),
      wordCount,
      audience,
    },
    outline,
    questionsToAnswer: questions,
    relatedKeywords,
    lsiTerms,
    competitors,
    internalLinkingSuggestions: internalLinks,
    contentDos: pickN(CONTENT_DOS, 5),
    contentDonts: pickN(CONTENT_DONTS, 4),
  };
}

function generateTitle(keyword: string, intent: string): string {
  const templates: Record<string, string[]> = {
    informational: [
      `${keyword}: The Complete Guide (${new Date().getFullYear()})`,
      `What Is ${keyword}? Everything You Need to Know`,
      `${keyword} Explained: A Comprehensive Guide`,
      `The Ultimate Guide to ${keyword}`,
    ],
    commercial: [
      `Best ${keyword} in ${new Date().getFullYear()}: Top Picks Reviewed`,
      `${keyword}: Reviews, Pricing & Comparison`,
      `Top 10 ${keyword} Options Worth Considering`,
      `${keyword} Buyer's Guide: How to Choose the Right One`,
    ],
    transactional: [
      `${keyword} — Get Started Today (Free Trial Available)`,
      `${keyword}: Pricing, Plans & How to Buy`,
      `Where to Get ${keyword}: Best Deals in ${new Date().getFullYear()}`,
    ],
    navigational: [
      `${keyword} — Official Guide & Resources`,
      `${keyword}: Features, Login & Getting Started`,
    ],
  };
  return pickRandom(templates[intent] || templates.informational);
}

function generateMetaDescription(keyword: string, intent: string): string {
  const templates: Record<string, string[]> = {
    informational: [
      `Learn everything about ${keyword}. This comprehensive guide covers key concepts, best practices, and expert tips to help you succeed.`,
      `Discover what ${keyword} is, why it matters, and how to get started. Updated for ${new Date().getFullYear()} with practical examples.`,
    ],
    commercial: [
      `Compare the best ${keyword} options available. Unbiased reviews, pricing breakdowns, and expert recommendations to help you choose.`,
      `Looking for the right ${keyword}? Our in-depth comparison covers features, pricing, pros & cons for the top choices.`,
    ],
    transactional: [
      `Get ${keyword} today. Compare pricing, check availability, and find the best deals from trusted providers.`,
    ],
    navigational: [
      `Find everything you need about ${keyword}. Access official resources, documentation, and guides.`,
    ],
  };
  return pickRandom(templates[intent] || templates.informational);
}

function generateOutline(keyword: string, intent: string, wordCount: number): OutlineSection[] {
  const sections: OutlineSection[] = [];
  let remaining = wordCount;

  // Intro
  const introWords = Math.round(wordCount * 0.08);
  sections.push({ heading: `What Is ${toTitleCase(keyword)}?`, tag: "h2", notes: `Define ${keyword} clearly. Provide context on why it matters. Hook the reader with a compelling stat or claim.`, wordEstimate: introWords });
  remaining -= introWords;

  if (intent === "informational" || intent === "navigational") {
    const sectionTopics = [
      { heading: `How ${toTitleCase(keyword)} Works`, notes: `Explain the mechanics/process. Use diagrams or step-by-step breakdowns where helpful.` },
      { heading: `Key Benefits of ${toTitleCase(keyword)}`, notes: `List 5-7 concrete benefits. Include data points where possible. Relate benefits to reader's goals.` },
      { heading: `Common ${toTitleCase(keyword)} Mistakes to Avoid`, notes: `Cover 3-5 mistakes. For each, explain why it's harmful and how to fix it.` },
      { heading: `${toTitleCase(keyword)} Best Practices`, notes: `Actionable tips. Include expert quotes or references. Prioritize by impact.` },
      { heading: `Getting Started with ${toTitleCase(keyword)}`, notes: `Step-by-step beginner guide. Keep it practical and actionable. Link to tools/resources.` },
    ];
    const perSection = Math.round(remaining * 0.85 / sectionTopics.length);
    for (const t of sectionTopics) {
      sections.push({ heading: t.heading, tag: "h2", notes: t.notes, wordEstimate: perSection });
      remaining -= perSection;
    }
  } else if (intent === "commercial") {
    const sectionTopics = [
      { heading: `What to Look for in ${toTitleCase(keyword)}`, notes: `Key evaluation criteria. Help reader understand what features matter and why.` },
      { heading: `Top ${toTitleCase(keyword)} Options Compared`, notes: `Compare 3-5 options. Include a comparison table. Cover features, pricing, pros/cons.` },
      { heading: `${toTitleCase(keyword)} Pricing Breakdown`, notes: `Explain pricing models. Include specific numbers where possible. Note hidden costs.` },
      { heading: `Who Should Use ${toTitleCase(keyword)}?`, notes: `Segment by use case/audience. Help reader self-identify. Include specific scenarios.` },
    ];
    const perSection = Math.round(remaining * 0.85 / sectionTopics.length);
    for (const t of sectionTopics) {
      sections.push({ heading: t.heading, tag: "h2", notes: t.notes, wordEstimate: perSection });
      remaining -= perSection;
    }
  } else {
    const sectionTopics = [
      { heading: `${toTitleCase(keyword)} Features & Capabilities`, notes: `Detailed feature overview. Highlight unique selling points.` },
      { heading: `How to Get ${toTitleCase(keyword)}`, notes: `Step-by-step purchase/signup process. Include pricing info.` },
      { heading: `${toTitleCase(keyword)} Alternatives`, notes: `Brief comparison with alternatives. Be fair but highlight advantages.` },
    ];
    const perSection = Math.round(remaining * 0.85 / sectionTopics.length);
    for (const t of sectionTopics) {
      sections.push({ heading: t.heading, tag: "h2", notes: t.notes, wordEstimate: perSection });
      remaining -= perSection;
    }
  }

  // FAQ
  sections.push({ heading: `Frequently Asked Questions About ${toTitleCase(keyword)}`, tag: "h2", notes: `Answer 4-6 common questions. Use FAQ schema markup. Keep answers concise (50-100 words each).`, wordEstimate: Math.max(remaining, 200) });

  return sections;
}

function generateQuestions(keyword: string): string[] {
  return QUESTION_STARTERS.slice(0, 8).map((starter) => `${starter} ${keyword}?`);
}

function generateRelatedKeywords(keyword: string): string[] {
  const words = keyword.split(/\s+/);
  const modifiers = ["best", "top", "how to", "free", "cheap", "vs", "alternative", "review", "for beginners", "2026"];
  const related: string[] = [];
  for (const mod of modifiers) {
    if (mod === "vs" && words.length > 0) {
      related.push(`${keyword} vs [competitor]`);
    } else if (["best", "top", "free", "cheap"].includes(mod)) {
      related.push(`${mod} ${keyword}`);
    } else {
      related.push(`${keyword} ${mod}`);
    }
  }
  return related;
}

function generateLSITerms(keyword: string): string[] {
  return pickN(LSI_SUFFIXES, 8).map((suffix) => `${keyword} ${suffix}`);
}

function generateCompetitors(keyword: string, intent: string): CompetitorSnippet[] {
  const angles: Record<string, string[][]> = {
    informational: [
      ["The Definitive Guide", "Comprehensive long-form", "Lacks practical examples"],
      ["Everything You Need to Know", "Beginner-friendly overview", "Surface-level coverage"],
      ["Expert Tips & Strategies", "Actionable advice focus", "Outdated statistics"],
    ],
    commercial: [
      ["Top 10 Picks Reviewed", "Product-focused comparison", "Missing pricing details"],
      ["Buyer's Guide", "Decision-focused structure", "Biased toward affiliates"],
      ["Honest Review", "Pros/cons format", "Limited options covered"],
    ],
    transactional: [
      ["Official Product Page", "Direct purchase path", "No comparison context"],
      ["Best Deals & Discounts", "Price-focused", "Missing feature details"],
    ],
    navigational: [
      ["Official Documentation", "Comprehensive reference", "Hard to navigate"],
      ["Getting Started Guide", "Onboarding focus", "Assumes prior knowledge"],
    ],
  };

  const relevant = angles[intent] || angles.informational;
  return relevant.map(([title, angle, gap]) => ({
    title: `${toTitleCase(keyword)}: ${title}`,
    angle,
    gap,
  }));
}

function generateInternalLinks(keyword: string): string[] {
  const words = keyword.split(/\s+/);
  const base = words[words.length - 1] || keyword;
  return [
    `Link to "Getting Started with ${toTitleCase(base)}" guide`,
    `Link to "${toTitleCase(keyword)} pricing" page if it exists`,
    `Link to related blog posts covering ${keyword} subtopics`,
    `Link to your main "${toTitleCase(base)}" category page`,
    `Link to relevant case studies or success stories`,
  ];
}

function estimateDifficulty(keyword: string): string {
  const words = keyword.split(/\s+/).length;
  if (words >= 4) return "Low (long-tail keyword)";
  if (words === 3) return "Medium (mid-tail keyword)";
  if (words === 2) return "Medium-High (competitive)";
  return "High (head term — consider long-tail variants)";
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
