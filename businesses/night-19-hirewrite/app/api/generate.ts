import { JobInput, JobPosting, BiasWarning } from "./store";

// --- Bias detection dictionaries ---

const GENDERED_TERMS: Record<string, { replacement: string; severity: "low" | "medium" | "high" }> = {
  ninja: { replacement: "specialist", severity: "medium" },
  rockstar: { replacement: "high-performer", severity: "medium" },
  guru: { replacement: "expert", severity: "medium" },
  wizard: { replacement: "specialist", severity: "medium" },
  hacker: { replacement: "developer", severity: "low" },
  manpower: { replacement: "workforce", severity: "high" },
  chairman: { replacement: "chairperson", severity: "high" },
  salesman: { replacement: "salesperson", severity: "high" },
  congressman: { replacement: "congressperson", severity: "high" },
  fireman: { replacement: "firefighter", severity: "high" },
  policeman: { replacement: "police officer", severity: "high" },
  mankind: { replacement: "humanity", severity: "medium" },
  "man-hours": { replacement: "person-hours", severity: "high" },
  craftsman: { replacement: "craftsperson", severity: "medium" },
  dominant: { replacement: "leading", severity: "low" },
  aggressive: { replacement: "ambitious", severity: "medium" },
  "he/his": { replacement: "they/their", severity: "high" },
  "she/her": { replacement: "they/their", severity: "high" },
};

const EXCLUSIONARY_PHRASES: { pattern: RegExp; message: string; suggestion: string; severity: "low" | "medium" | "high" }[] = [
  {
    pattern: /must be a native English speaker/i,
    message: "\"Must be a native English speaker\" can exclude qualified non-native speakers",
    suggestion: "Use \"Strong English communication skills required\" instead",
    severity: "high",
  },
  {
    pattern: /cultural fit/i,
    message: "\"Cultural fit\" can be used to justify homogeneous hiring",
    suggestion: "Use \"values alignment\" or describe specific values",
    severity: "medium",
  },
  {
    pattern: /young and energetic/i,
    message: "\"Young and energetic\" is age-discriminatory",
    suggestion: "Use \"motivated\" or \"enthusiastic\" instead",
    severity: "high",
  },
  {
    pattern: /digital native/i,
    message: "\"Digital native\" implies age preference",
    suggestion: "Use \"technically proficient\" instead",
    severity: "medium",
  },
  {
    pattern: /fast[- ]paced environment/i,
    message: "\"Fast-paced environment\" may discourage candidates with disabilities",
    suggestion: "Describe the actual work cadence and expectations",
    severity: "low",
  },
  {
    pattern: /work hard,?\s*play hard/i,
    message: "\"Work hard, play hard\" can signal poor work-life balance",
    suggestion: "Describe your team culture more specifically",
    severity: "medium",
  },
];

function detectExcessiveRequirements(
  title: string,
  experienceLevel: string,
  text: string
): BiasWarning[] {
  const warnings: BiasWarning[] = [];
  const yearsMatch = text.match(/(\d+)\+?\s*years?\s*(of\s+)?experience/gi);

  if (yearsMatch) {
    for (const match of yearsMatch) {
      const num = parseInt(match.match(/(\d+)/)?.[1] || "0", 10);
      if (experienceLevel === "entry" && num > 2) {
        warnings.push({
          text: `Requiring ${num}+ years for an entry-level role is excessive`,
          severity: "high",
          suggestion: "Entry-level roles should require 0-2 years of experience",
          category: "excessive-requirements",
        });
      } else if (experienceLevel === "mid" && num > 7) {
        warnings.push({
          text: `Requiring ${num}+ years for a mid-level role is excessive`,
          severity: "medium",
          suggestion: "Mid-level roles typically require 3-6 years of experience",
          category: "excessive-requirements",
        });
      } else if (experienceLevel === "senior" && num > 12) {
        warnings.push({
          text: `Requiring ${num}+ years may unnecessarily limit your candidate pool`,
          severity: "low",
          suggestion: "Consider focusing on skills and accomplishments rather than years",
          category: "excessive-requirements",
        });
      }
    }
  }

  return warnings;
}

export function detectBias(text: string, title: string, experienceLevel: string): BiasWarning[] {
  const warnings: BiasWarning[] = [];
  const lowerText = text.toLowerCase();

  // Check gendered / biased terms
  for (const [term, info] of Object.entries(GENDERED_TERMS)) {
    const regex = new RegExp(`\\b${term.replace("/", "\\/")}\\b`, "gi");
    if (regex.test(lowerText)) {
      warnings.push({
        text: `Found potentially biased term: "${term}"`,
        severity: info.severity,
        suggestion: `Consider using "${info.replacement}" instead`,
        category: "gendered-language",
      });
    }
  }

  // Check exclusionary phrases
  for (const phrase of EXCLUSIONARY_PHRASES) {
    if (phrase.pattern.test(text)) {
      warnings.push({
        text: phrase.message,
        severity: phrase.severity,
        suggestion: phrase.suggestion,
        category: "exclusionary-phrase",
      });
    }
  }

  // Check excessive requirements
  warnings.push(...detectExcessiveRequirements(title, experienceLevel, text));

  return warnings;
}

export function calculateInclusivityScore(warnings: BiasWarning[], posting: Partial<JobPosting>): number {
  let score = 100;

  // Deduct for bias warnings
  for (const w of warnings) {
    if (w.severity === "high") score -= 15;
    else if (w.severity === "medium") score -= 8;
    else score -= 3;
  }

  // Bonus for salary transparency
  if (posting.salaryRange && posting.salaryRange.trim().length > 0) {
    score += 5;
  }

  // Bonus for benefits listed
  if (posting.benefits && posting.benefits.length >= 3) {
    score += 3;
  }

  // Bonus for remote option
  if (posting.workMode === "remote") {
    score += 2;
  }

  return Math.max(0, Math.min(100, score));
}

// --- Content generation (algorithmic, no external API) ---

const RESPONSIBILITY_TEMPLATES: Record<string, string[]> = {
  Engineering: [
    "Design, develop, and maintain high-quality software solutions",
    "Participate in code reviews and contribute to engineering best practices",
    "Collaborate with cross-functional teams to define and implement new features",
    "Write automated tests to ensure code quality and reliability",
    "Troubleshoot and resolve technical issues in a timely manner",
    "Contribute to system architecture and technical design decisions",
    "Document technical specifications and development processes",
  ],
  Marketing: [
    "Develop and execute comprehensive marketing strategies",
    "Analyze market trends and competitive landscape to identify opportunities",
    "Create compelling content for various marketing channels",
    "Manage campaign budgets and track ROI metrics",
    "Collaborate with sales and product teams on go-to-market strategies",
    "Build and maintain brand consistency across all touchpoints",
    "Report on marketing performance to key stakeholders",
  ],
  Design: [
    "Create user-centered designs based on research and data",
    "Develop wireframes, prototypes, and high-fidelity mockups",
    "Conduct usability testing and iterate on designs based on feedback",
    "Collaborate with engineering teams to ensure design feasibility",
    "Maintain and evolve the design system and style guides",
    "Present design concepts to stakeholders and incorporate feedback",
    "Stay current with design trends and emerging technologies",
  ],
  Sales: [
    "Identify and pursue new business opportunities",
    "Build and maintain strong client relationships",
    "Meet or exceed quarterly and annual revenue targets",
    "Prepare and deliver compelling sales presentations",
    "Collaborate with marketing and product teams on customer feedback",
    "Maintain accurate records in CRM system",
    "Develop territory and account strategies",
  ],
  default: [
    "Execute key responsibilities aligned with team objectives",
    "Collaborate with cross-functional teams to achieve business goals",
    "Identify process improvements and contribute to team efficiency",
    "Communicate progress and results to stakeholders",
    "Participate in team meetings and contribute to strategic planning",
    "Maintain documentation and standard operating procedures",
    "Support team members and foster a collaborative environment",
  ],
};

const LEVEL_QUALIFICATIONS: Record<string, string[]> = {
  entry: [
    "Bachelor's degree or equivalent practical experience",
    "Strong willingness to learn and grow professionally",
    "Excellent communication and teamwork skills",
    "Ability to manage time effectively and meet deadlines",
    "Demonstrated problem-solving abilities",
  ],
  mid: [
    "3-5 years of relevant professional experience",
    "Proven track record of delivering results in a similar role",
    "Strong analytical and problem-solving skills",
    "Ability to work independently and manage multiple priorities",
    "Excellent verbal and written communication skills",
  ],
  senior: [
    "7+ years of relevant professional experience",
    "Demonstrated leadership and mentoring capabilities",
    "Deep expertise in relevant domain and technologies",
    "Experience with strategic planning and decision-making",
    "Outstanding communication and stakeholder management skills",
  ],
  lead: [
    "10+ years of relevant professional experience with leadership roles",
    "Proven ability to build, manage, and develop high-performing teams",
    "Strategic thinking with ability to translate vision into execution",
    "Experience driving organizational change and process improvement",
    "Executive-level communication and presentation skills",
  ],
};

const NICE_TO_HAVES: string[] = [
  "Experience working in a startup or high-growth environment",
  "Familiarity with agile methodologies",
  "Experience with remote or distributed team collaboration",
  "Industry-specific certifications or training",
  "Contributions to professional communities or open-source projects",
  "Multilingual abilities",
  "Experience with data-driven decision making",
];

const BENEFITS_POOL: string[] = [
  "Competitive salary and performance bonuses",
  "Comprehensive health, dental, and vision insurance",
  "Flexible work schedule and location",
  "Generous paid time off and holidays",
  "Professional development and learning budget",
  "401(k) or retirement plan with company match",
  "Parental leave for all parents",
  "Mental health and wellness programs",
  "Home office stipend",
  "Team events and company retreats",
  "Employee stock options or equity",
  "Commuter benefits",
];

function pickItems<T>(arr: T[], count: number, seed?: string): T[] {
  // Simple deterministic-ish pick based on seed
  const copy = [...arr];
  const result: T[] = [];
  let hash = 0;
  for (const ch of (seed || "default")) {
    hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  }
  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const idx = Math.abs(hash + i * 7) % copy.length;
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function generateDescription(input: JobInput): string {
  const modeText =
    input.workMode === "remote"
      ? "This is a fully remote position."
      : input.workMode === "hybrid"
      ? "This position offers a flexible hybrid work arrangement."
      : `This position is based in ${input.location}.`;

  const typeText =
    input.employmentType === "full-time"
      ? "full-time"
      : input.employmentType === "part-time"
      ? "part-time"
      : "contract";

  return (
    `We are seeking a talented ${input.title} to join our ${input.department} team at ${input.company}. ` +
    `This ${typeText} role is ideal for a ${input.experienceLevel}-level professional ` +
    `who is passionate about making an impact. ${modeText}` +
    (input.salaryRange ? ` The compensation range for this role is ${input.salaryRange}.` : "") +
    (input.notes ? ` ${input.notes}` : "")
  );
}

export function generateJobPosting(input: JobInput): JobPosting {
  const seed = `${input.title}-${input.company}-${input.department}`;
  const deptKey = Object.keys(RESPONSIBILITY_TEMPLATES).find(
    (k) => k.toLowerCase() === input.department.toLowerCase()
  ) || "default";

  const description = generateDescription(input);
  const responsibilities = pickItems(RESPONSIBILITY_TEMPLATES[deptKey], 5, seed);
  const qualifications = [...LEVEL_QUALIFICATIONS[input.experienceLevel]];
  const niceToHaves = pickItems(NICE_TO_HAVES, 3, seed + "nice");
  const benefits = pickItems(BENEFITS_POOL, 5, seed + "benefits");

  const fullText = [
    description,
    ...responsibilities,
    ...qualifications,
    ...niceToHaves,
    ...benefits,
    input.notes,
  ].join(" ");

  const biasWarnings = detectBias(fullText, input.title, input.experienceLevel);

  const posting: JobPosting = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    company: input.company,
    location: input.location,
    workMode: input.workMode,
    employmentType: input.employmentType,
    experienceLevel: input.experienceLevel,
    salaryRange: input.salaryRange,
    department: input.department,
    description,
    responsibilities,
    qualifications,
    niceToHaves,
    benefits,
    biasWarnings,
    inclusivityScore: 0,
    createdAt: new Date().toISOString(),
  };

  posting.inclusivityScore = calculateInclusivityScore(biasWarnings, posting);

  return posting;
}

export function analyzeJobPosting(posting: JobPosting): { biasWarnings: BiasWarning[]; inclusivityScore: number } {
  const fullText = [
    posting.description,
    ...posting.responsibilities,
    ...posting.qualifications,
    ...posting.niceToHaves,
    ...posting.benefits,
  ].join(" ");

  const biasWarnings = detectBias(fullText, posting.title, posting.experienceLevel);
  const inclusivityScore = calculateInclusivityScore(biasWarnings, posting);

  return { biasWarnings, inclusivityScore };
}
