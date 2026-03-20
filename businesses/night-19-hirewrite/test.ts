import { generateJobPosting, detectBias, calculateInclusivityScore, analyzeJobPosting } from "./app/api/generate";
import { JobInput, JobPosting, BiasWarning } from "./app/api/store";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

function makeInput(overrides: Partial<JobInput> = {}): JobInput {
  return {
    title: "Software Engineer",
    company: "TestCo",
    location: "Remote",
    workMode: "remote",
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryRange: "$100,000 - $150,000",
    department: "Engineering",
    notes: "",
    ...overrides,
  };
}

console.log("\n=== HireWrite Test Suite ===\n");

// Test 1: Job generation produces valid output
console.log("Test 1: Job generation produces valid structured output");
{
  const posting = generateJobPosting(makeInput());
  assert(typeof posting.id === "string" && posting.id.length > 0, "Has a valid ID");
  assert(posting.title === "Software Engineer", "Title matches input");
  assert(posting.company === "TestCo", "Company matches input");
  assert(posting.description.length > 0, "Description is non-empty");
  assert(posting.responsibilities.length >= 3, "Has at least 3 responsibilities");
  assert(posting.qualifications.length >= 3, "Has at least 3 qualifications");
  assert(posting.niceToHaves.length >= 1, "Has at least 1 nice-to-have");
  assert(posting.benefits.length >= 3, "Has at least 3 benefits");
  assert(typeof posting.inclusivityScore === "number", "Has inclusivity score");
  assert(Array.isArray(posting.biasWarnings), "Has bias warnings array");
}

// Test 2: Bias detection - gendered language
console.log("\nTest 2: Bias detection flags gendered language");
{
  const warnings = detectBias(
    "We are looking for a rockstar ninja to join our team. Must have manpower management skills.",
    "Developer",
    "mid"
  );
  const terms = warnings.map((w) => w.text.toLowerCase());
  assert(
    terms.some((t) => t.includes("rockstar")),
    "Detects 'rockstar' as biased"
  );
  assert(
    terms.some((t) => t.includes("ninja")),
    "Detects 'ninja' as biased"
  );
  assert(
    terms.some((t) => t.includes("manpower")),
    "Detects 'manpower' as biased"
  );
  assert(
    warnings.every((w) => w.suggestion.length > 0),
    "All warnings have suggestions"
  );
}

// Test 3: Inclusivity scoring
console.log("\nTest 3: Inclusivity scoring works correctly");
{
  // Clean posting - should score high
  const cleanWarnings: BiasWarning[] = [];
  const cleanScore = calculateInclusivityScore(cleanWarnings, {
    salaryRange: "$100k",
    benefits: ["a", "b", "c"],
    workMode: "remote",
  });
  assert(cleanScore > 75, `Clean posting scores high (${cleanScore})`);

  // Biased posting - should score lower
  const biasedWarnings: BiasWarning[] = [
    { text: "a", severity: "high", suggestion: "b", category: "c" },
    { text: "d", severity: "high", suggestion: "e", category: "f" },
    { text: "g", severity: "medium", suggestion: "h", category: "i" },
  ];
  const biasedScore = calculateInclusivityScore(biasedWarnings, {});
  assert(biasedScore < cleanScore, `Biased posting scores lower (${biasedScore} < ${cleanScore})`);
  assert(biasedScore < 75, `Heavily biased posting scores below 75 (${biasedScore})`);
}

// Test 4: Different experience levels produce appropriate qualifications
console.log("\nTest 4: Experience levels produce appropriate qualifications");
{
  const entryPosting = generateJobPosting(makeInput({ experienceLevel: "entry" }));
  const seniorPosting = generateJobPosting(makeInput({ experienceLevel: "senior" }));
  const leadPosting = generateJobPosting(makeInput({ experienceLevel: "lead" }));

  const entryQuals = entryPosting.qualifications.join(" ").toLowerCase();
  const seniorQuals = seniorPosting.qualifications.join(" ").toLowerCase();
  const leadQuals = leadPosting.qualifications.join(" ").toLowerCase();

  assert(
    entryQuals.includes("learn") || entryQuals.includes("willingness"),
    "Entry level mentions learning/willingness"
  );
  assert(
    seniorQuals.includes("7+") || seniorQuals.includes("leadership"),
    "Senior level mentions 7+ years or leadership"
  );
  assert(
    leadQuals.includes("10+") || leadQuals.includes("team"),
    "Lead level mentions 10+ years or team management"
  );
}

// Test 5: Required fields validation (tested via input validation logic)
console.log("\nTest 5: Required fields are present in generated output");
{
  const posting = generateJobPosting(makeInput());
  assert(posting.title.length > 0, "Title is required and present");
  assert(posting.company.length > 0, "Company is required and present");
  assert(posting.location.length > 0, "Location is required and present");
  assert(posting.department.length > 0, "Department is required and present");
  assert(
    ["remote", "hybrid", "onsite"].includes(posting.workMode),
    "Work mode is valid"
  );
  assert(
    ["full-time", "part-time", "contract"].includes(posting.employmentType),
    "Employment type is valid"
  );
  assert(
    ["entry", "mid", "senior", "lead"].includes(posting.experienceLevel),
    "Experience level is valid"
  );
}

// Test 6: Excessive requirements detection
console.log("\nTest 6: Excessive requirements detection for entry-level roles");
{
  const warnings = detectBias(
    "Must have 10+ years of experience in React development",
    "Junior Developer",
    "entry"
  );
  assert(
    warnings.some((w) => w.category === "excessive-requirements"),
    "Flags excessive years for entry-level"
  );
  assert(
    warnings.some((w) => w.severity === "high"),
    "Excessive entry-level requirements are high severity"
  );

  // Mid-level with reasonable requirements should not flag
  const midWarnings = detectBias(
    "Must have 4 years of experience",
    "Developer",
    "mid"
  );
  assert(
    !midWarnings.some((w) => w.category === "excessive-requirements"),
    "Does not flag reasonable mid-level requirements"
  );
}

// Test 7: Analyze existing posting
console.log("\nTest 7: Analyze existing posting works");
{
  const posting = generateJobPosting(
    makeInput({ notes: "Looking for a rockstar ninja" })
  );
  const analysis = analyzeJobPosting(posting);
  assert(typeof analysis.inclusivityScore === "number", "Analysis returns inclusivity score");
  assert(Array.isArray(analysis.biasWarnings), "Analysis returns bias warnings");
  assert(analysis.biasWarnings.length > 0, "Analysis detects bias from notes");
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
