import { generateJobDescription, GenerateInput } from "./lib/generator";
import { detectBias } from "./lib/bias-detector";
import { templates } from "./lib/templates";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message}`);
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  const condition = actual === expected;
  if (!condition) {
    console.log(`    Expected: ${JSON.stringify(expected)}`);
    console.log(`    Actual:   ${JSON.stringify(actual)}`);
  }
  assert(condition, message);
}

// --- Test Data ---
const baseInput: GenerateInput = {
  role: {
    title: "Software Engineer",
    department: "Engineering",
    level: "senior",
    location: "San Francisco, CA",
    workMode: "remote",
  },
  requirements: {
    mustHaveSkills: ["React", "TypeScript"],
    niceToHaveSkills: ["GraphQL", "AWS"],
    experience: "5",
    education: "BS in Computer Science or equivalent experience",
  },
  company: {
    name: "TechCorp",
    mission: "make developer tools accessible to everyone",
    benefits: ["Health insurance", "401k", "Remote work"],
    culture: "We value collaboration and continuous learning.",
  },
  tone: "startup-casual",
  templateId: "tech-startup",
};

// =====================
// JD Generation Tests
// =====================
console.log("\n=== JD Generation Tests ===");

const result = generateJobDescription(baseInput);

assert(result.fullText.length > 0, "Generated JD has non-empty full text");
assert(result.fullText.includes("Software Engineer"), "Full text includes job title");
assert(result.aboutUs.includes("TechCorp"), "About Us includes company name");
assert(result.roleOverview.includes("senior"), "Role overview includes level descriptor");
assert(result.roleOverview.includes("remote"), "Role overview mentions work mode");
assert(result.responsibilities.length > 0, "Has responsibilities listed");
assert(result.mustHaveRequirements.length > 0, "Has must-have requirements");
assert(result.niceToHaveRequirements.length > 0, "Has nice-to-have requirements");
assert(result.benefits.length > 0, "Has benefits listed");
assert(result.howToApply.length > 0, "Has how-to-apply section");

// Check must-have skills appear
assert(
  result.mustHaveRequirements.some((r) => r.includes("React")),
  "Must-have requirements include React"
);
assert(
  result.niceToHaveRequirements.some((r) => r.includes("GraphQL")),
  "Nice-to-have requirements include GraphQL"
);

// Check education appears in requirements
assert(
  result.mustHaveRequirements.some((r) => r.includes("Computer Science")),
  "Education requirement is included"
);

// =====================
// Tone Variation Tests
// =====================
console.log("\n=== Tone Variation Tests ===");

const casualResult = generateJobDescription({ ...baseInput, tone: "startup-casual" });
assert(casualResult.roleOverview.includes("Hey there!"), "Casual tone uses friendly greeting");
assert(casualResult.howToApply.includes("Excited"), "Casual tone how-to-apply is informal");

const formalResult = generateJobDescription({ ...baseInput, tone: "corporate-formal" });
assert(formalResult.roleOverview.includes("pleased to announce"), "Formal tone uses professional language");
assert(formalResult.howToApply.includes("equal opportunity"), "Formal tone includes EEO language");

const creativeResult = generateJobDescription({ ...baseInput, tone: "creative" });
assert(creativeResult.roleOverview.includes("Ready to make an impact"), "Creative tone uses bold opening");

// =====================
// Template Variation Tests
// =====================
console.log("\n=== Template Variation Tests ===");

const healthcareResult = generateJobDescription({ ...baseInput, templateId: "healthcare" });
assert(
  healthcareResult.aboutUs.includes("healthcare"),
  "Healthcare template references healthcare in About Us"
);

const financeResult = generateJobDescription({ ...baseInput, templateId: "finance" });
assert(
  financeResult.aboutUs.includes("financial"),
  "Finance template references finance in About Us"
);

// =====================
// Work Mode Tests
// =====================
console.log("\n=== Work Mode Tests ===");

const hybridResult = generateJobDescription({
  ...baseInput,
  role: { ...baseInput.role, workMode: "hybrid" },
});
assert(hybridResult.roleOverview.includes("hybrid"), "Hybrid mode mentioned in overview");

const onsiteResult = generateJobDescription({
  ...baseInput,
  role: { ...baseInput.role, workMode: "onsite" },
});
assert(onsiteResult.roleOverview.includes("onsite"), "Onsite mode mentioned in overview");

// =====================
// Bias Detection Tests
// =====================
console.log("\n=== Bias Detection Tests ===");

const biasResults1 = detectBias("We need a coding ninja who is aggressive and a rockstar developer");
assert(biasResults1.length >= 3, "Detects multiple biased terms (ninja, aggressive, rockstar)");
assert(
  biasResults1.some((m) => m.term.toLowerCase() === "ninja"),
  "Detects 'ninja' as biased"
);
assert(
  biasResults1.some((m) => m.term.toLowerCase() === "rockstar"),
  "Detects 'rockstar' as biased"
);
assert(
  biasResults1.some((m) => m.category === "Gender-coded"),
  "Categorizes gender-coded language"
);

const biasResults2 = detectBias("Looking for a young digital native");
assert(biasResults2.length >= 2, "Detects age-biased terms");
assert(
  biasResults2.some((m) => m.category === "Age bias"),
  "Categorizes age bias correctly"
);

const biasResults3 = detectBias("Must be a native speaker and culture fit");
assert(biasResults3.length >= 2, "Detects exclusionary terms");
assert(
  biasResults3.some((m) => m.term.toLowerCase() === "culture fit"),
  "Detects 'culture fit' as exclusionary"
);

const cleanResult = detectBias("We are looking for a talented engineer to join our team.");
assert(cleanResult.length === 0, "Clean text has no bias matches");

// Suggestions exist
assert(
  biasResults1.every((m) => m.suggestion.length > 0),
  "All bias matches have suggestions"
);
assert(
  biasResults1.every((m) => m.explanation.length > 0),
  "All bias matches have explanations"
);

// =====================
// Templates Tests
// =====================
console.log("\n=== Templates Tests ===");

assert(templates.length >= 5, "At least 5 industry templates available");
assert(
  templates.every((t) => t.id && t.industry && t.name),
  "All templates have id, industry, and name"
);
assert(
  templates.every((t) => t.responsibilitiesTemplate.length > 0),
  "All templates have responsibilities"
);

// =====================
// Edge Case Tests
// =====================
console.log("\n=== Edge Case Tests ===");

const emptyBenefitsInput: GenerateInput = {
  ...baseInput,
  company: { ...baseInput.company, benefits: [] },
};
const emptyBenefitsResult = generateJobDescription(emptyBenefitsInput);
assert(emptyBenefitsResult.benefits.length > 0, "Falls back to template benefits when none provided");

// =====================
// Summary
// =====================
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"=".repeat(40)}\n`);

if (failed > 0) {
  process.exit(1);
}
