export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: "remote" | "hybrid" | "onsite";
  employmentType: "full-time" | "part-time" | "contract";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  salaryRange: string;
  department: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  niceToHaves: string[];
  benefits: string[];
  biasWarnings: BiasWarning[];
  inclusivityScore: number;
  createdAt: string;
}

export interface BiasWarning {
  text: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
  category: string;
}

export interface JobInput {
  title: string;
  company: string;
  location: string;
  workMode: "remote" | "hybrid" | "onsite";
  employmentType: "full-time" | "part-time" | "contract";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  salaryRange: string;
  department: string;
  notes: string;
}

const store: JobPosting[] = [
  {
    id: "sample-1",
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    workMode: "hybrid",
    employmentType: "full-time",
    experienceLevel: "senior",
    salaryRange: "$150,000 - $200,000",
    department: "Engineering",
    description:
      "We are looking for a skilled Frontend Engineer to join our growing team. You will build modern, accessible web applications using React and TypeScript, collaborating closely with designers and backend engineers to deliver exceptional user experiences.",
    responsibilities: [
      "Design and implement responsive user interfaces using React and TypeScript",
      "Collaborate with product and design teams to translate requirements into technical solutions",
      "Write comprehensive unit and integration tests",
      "Mentor junior engineers and conduct code reviews",
      "Contribute to architectural decisions and technical documentation",
    ],
    qualifications: [
      "5+ years of professional frontend development experience",
      "Strong proficiency in React, TypeScript, and modern CSS",
      "Experience with state management libraries and REST/GraphQL APIs",
      "Solid understanding of web accessibility standards (WCAG)",
      "Excellent communication and collaboration skills",
    ],
    niceToHaves: [
      "Experience with Next.js or similar frameworks",
      "Familiarity with design systems and component libraries",
      "Contributions to open-source projects",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Flexible hybrid work schedule",
      "Health, dental, and vision insurance",
      "Annual learning and development budget",
      "Generous PTO policy",
    ],
    biasWarnings: [],
    inclusivityScore: 92,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "New York, NY",
    workMode: "remote",
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryRange: "$90,000 - $120,000",
    department: "Marketing",
    description:
      "Join our marketing team to develop and execute data-driven campaigns that drive customer acquisition and brand awareness. You will work across channels including content, email, social media, and paid advertising.",
    responsibilities: [
      "Develop and execute multi-channel marketing campaigns",
      "Analyze campaign performance metrics and optimize strategies",
      "Manage content calendar and editorial planning",
      "Collaborate with sales team to align messaging and lead generation",
      "Oversee social media presence and community engagement",
    ],
    qualifications: [
      "3+ years of experience in digital marketing",
      "Proven track record of managing successful campaigns",
      "Strong analytical skills with experience in marketing analytics tools",
      "Excellent written and verbal communication skills",
      "Experience with marketing automation platforms",
    ],
    niceToHaves: [
      "Experience in B2B SaaS marketing",
      "Familiarity with SEO and content strategy",
      "Background in graphic design or video production",
    ],
    benefits: [
      "Fully remote work environment",
      "Competitive compensation package",
      "Health and wellness benefits",
      "Professional development opportunities",
      "Home office stipend",
    ],
    biasWarnings: [],
    inclusivityScore: 88,
    createdAt: new Date().toISOString(),
  },
];

export function getAllJobs(): JobPosting[] {
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getJobById(id: string): JobPosting | undefined {
  return store.find((j) => j.id === id);
}

export function addJob(job: JobPosting): void {
  store.push(job);
}
