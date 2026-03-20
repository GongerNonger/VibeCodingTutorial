import { templates, JDTemplate } from "./templates";

export interface RoleDetails {
  title: string;
  department: string;
  level: string; // "junior" | "mid" | "senior" | "lead" | "executive"
  location: string;
  workMode: string; // "remote" | "hybrid" | "onsite"
}

export interface Requirements {
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  experience: string; // years
  education: string;
}

export interface CompanyInfo {
  name: string;
  mission: string;
  benefits: string[];
  culture: string;
}

export type Tone = "startup-casual" | "corporate-formal" | "creative";

export interface GenerateInput {
  role: RoleDetails;
  requirements: Requirements;
  company: CompanyInfo;
  tone: Tone;
  templateId?: string;
}

export interface GeneratedJD {
  aboutUs: string;
  roleOverview: string;
  responsibilities: string[];
  mustHaveRequirements: string[];
  niceToHaveRequirements: string[];
  benefits: string[];
  howToApply: string;
  fullText: string;
}

function getToneIntro(tone: Tone): { greeting: string; style: string } {
  switch (tone) {
    case "startup-casual":
      return {
        greeting: "Hey there!",
        style: "We're looking for a talented",
      };
    case "corporate-formal":
      return {
        greeting: "We are pleased to announce an opening for",
        style: "We are seeking a qualified",
      };
    case "creative":
      return {
        greeting: "Ready to make an impact?",
        style: "We're on the hunt for an exceptional",
      };
  }
}

function getLevelDescriptor(level: string): string {
  switch (level.toLowerCase()) {
    case "junior":
      return "early-career";
    case "mid":
      return "mid-level";
    case "senior":
      return "senior";
    case "lead":
      return "lead-level";
    case "executive":
      return "executive-level";
    default:
      return level;
  }
}

function getWorkModeDescription(workMode: string, location: string): string {
  switch (workMode.toLowerCase()) {
    case "remote":
      return "This is a fully remote position, allowing you to work from anywhere.";
    case "hybrid":
      return `This is a hybrid role based in ${location}, combining the flexibility of remote work with in-office collaboration.`;
    case "onsite":
      return `This is an onsite position based in ${location}.`;
    default:
      return `This position is located in ${location}.`;
  }
}

function findTemplate(templateId?: string): JDTemplate {
  if (templateId) {
    const found = templates.find((t) => t.id === templateId);
    if (found) return found;
  }
  return templates[0]; // default to tech-startup
}

export function generateJobDescription(input: GenerateInput): GeneratedJD {
  const template = findTemplate(input.templateId);
  const toneInfo = getToneIntro(input.tone);
  const levelDesc = getLevelDescriptor(input.role.level);
  const workModeDesc = getWorkModeDescription(
    input.role.workMode,
    input.role.location
  );

  // About Us
  const aboutUs = `${input.company.name} - ${template.aboutUsTemplate.replace("{mission}", input.company.mission)}${input.company.culture ? ` ${input.company.culture}` : ""}`;

  // Role Overview
  const roleOverview = `${toneInfo.greeting} ${toneInfo.style} ${levelDesc} ${input.role.title} to join our ${input.role.department} team. ${workModeDesc}`;

  // Responsibilities - merge template with role-specific
  const responsibilities = template.responsibilitiesTemplate.map((r) =>
    r
      .replace("{title}", input.role.title)
      .replace("{department}", input.role.department)
  );

  // Must-have requirements
  const mustHaveRequirements: string[] = [];
  if (input.requirements.experience) {
    mustHaveRequirements.push(
      template.requirementsTemplate[0]
        .replace("{experience}", input.requirements.experience)
        .replace("{skills}", input.requirements.mustHaveSkills.join(", "))
    );
  }
  for (const skill of input.requirements.mustHaveSkills) {
    mustHaveRequirements.push(`Proficiency in ${skill}`);
  }
  if (input.requirements.education) {
    mustHaveRequirements.push(input.requirements.education);
  }
  // Add remaining template requirements
  for (let i = 1; i < template.requirementsTemplate.length; i++) {
    mustHaveRequirements.push(
      template.requirementsTemplate[i]
        .replace("{experience}", input.requirements.experience)
        .replace("{skills}", input.requirements.mustHaveSkills.join(", "))
    );
  }

  // Nice-to-have
  const niceToHaveRequirements = input.requirements.niceToHaveSkills.map(
    (s) => `Experience with ${s}`
  );

  // Benefits
  const benefits =
    input.company.benefits.length > 0
      ? input.company.benefits
      : template.benefitsTemplate;

  // How to Apply
  let howToApply: string;
  if (input.tone === "startup-casual") {
    howToApply = `Excited about this role? We'd love to hear from you! Send us your resume and a brief note about why you're interested in joining ${input.company.name}. We review every application and aim to respond within one week.`;
  } else if (input.tone === "creative") {
    howToApply = `Think you're the perfect fit? Show us what you've got! Submit your resume, portfolio, or anything that showcases your talent. We can't wait to meet you. ${input.company.name} is an equal opportunity employer committed to building a diverse team.`;
  } else {
    howToApply = `Qualified candidates are invited to submit their resume and cover letter for consideration. ${input.company.name} is an equal opportunity employer and values diversity in the workplace. All qualified applicants will receive consideration without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, disability, or veteran status.`;
  }

  // Assemble full text
  const fullText = assembleFullText({
    aboutUs,
    roleOverview,
    responsibilities,
    mustHaveRequirements,
    niceToHaveRequirements,
    benefits,
    howToApply,
    fullText: "",
  }, input.role.title);

  return {
    aboutUs,
    roleOverview,
    responsibilities,
    mustHaveRequirements,
    niceToHaveRequirements,
    benefits,
    howToApply,
    fullText,
  };
}

function assembleFullText(jd: GeneratedJD, title: string): string {
  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push("");
  lines.push("## About Us");
  lines.push(jd.aboutUs);
  lines.push("");
  lines.push("## Role Overview");
  lines.push(jd.roleOverview);
  lines.push("");
  lines.push("## Responsibilities");
  for (const r of jd.responsibilities) {
    lines.push(`- ${r}`);
  }
  lines.push("");
  lines.push("## Requirements");
  lines.push("");
  lines.push("### Must Have");
  for (const r of jd.mustHaveRequirements) {
    lines.push(`- ${r}`);
  }
  if (jd.niceToHaveRequirements.length > 0) {
    lines.push("");
    lines.push("### Nice to Have");
    for (const r of jd.niceToHaveRequirements) {
      lines.push(`- ${r}`);
    }
  }
  lines.push("");
  lines.push("## Benefits");
  for (const b of jd.benefits) {
    lines.push(`- ${b}`);
  }
  lines.push("");
  lines.push("## How to Apply");
  lines.push(jd.howToApply);

  return lines.join("\n");
}
