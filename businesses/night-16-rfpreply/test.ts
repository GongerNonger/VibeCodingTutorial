import { analyzeRFP } from "./lib/analyzer";
import { generateResponses } from "./lib/generator";
import { getAllProfiles, saveProfile, getProfile, deleteProfile, clearProfiles } from "./lib/store";
import { CompanyProfile, RFPSection, Tone } from "./lib/types";

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

function section(name: string) {
  console.log(`\n--- ${name} ---`);
}

const sampleProfile: CompanyProfile = {
  id: "test-1",
  name: "Acme Solutions",
  description: "Acme Solutions is a technology consulting firm with 15 years of experience.",
  capabilities: "cloud migration, data analytics, software development, cybersecurity",
  pastProjects: "Migrated Fortune 500 company to AWS, Built analytics platform for healthcare provider",
  teamSize: 25,
  createdAt: new Date().toISOString(),
};

// ========== Analyzer Tests ==========
section("Analyzer - Empty/Invalid Input");
assert(analyzeRFP("").length === 0, "Empty string returns no sections");
assert(analyzeRFP("   ").length === 0, "Whitespace-only returns no sections");

section("Analyzer - Numbered Sections");
const numberedRFP = `1. Company Qualifications
Describe your company's relevant experience and qualifications for this project.

2. Technical Approach
Provide a detailed technical approach for the proposed solution.

3. Past Performance
List three relevant past projects with references.`;

const numberedSections = analyzeRFP(numberedRFP);
assert(numberedSections.length >= 2, "Parses numbered sections (found " + numberedSections.length + ")");
assert(numberedSections[0].title.length > 0, "First section has a title");

section("Analyzer - Header-Based Sections");
const headerRFP = `PROJECT OVERVIEW
This RFP seeks proposals for a new data management system.

REQUIREMENTS:
The vendor must provide a cloud-based solution with 99.9% uptime.

EVALUATION CRITERIA:
Proposals will be scored on technical merit, cost, and past performance.

SUBMISSION DEADLINE:
All proposals must be submitted by March 30, 2026.`;

const headerSections = analyzeRFP(headerRFP);
assert(headerSections.length >= 3, "Parses header-based sections (found " + headerSections.length + ")");

section("Analyzer - Section Type Classification");
const questionRFP = `Questions:
Describe your team's experience with similar projects?

Requirements:
The vendor shall provide 24/7 technical support.

Evaluation Criteria:
Scoring will be weighted as follows.`;

const typedSections = analyzeRFP(questionRFP);
assert(typedSections.length >= 1, "Parses mixed-type sections");

const hasQuestion = typedSections.some(s => s.type === "question");
const hasRequirement = typedSections.some(s => s.type === "requirement");
assert(hasQuestion || hasRequirement, "Classifies section types correctly");

section("Analyzer - Paragraph Fallback");
const paragraphRFP = `We need a vendor who can provide comprehensive IT support services.

The ideal candidate will have experience with government contracts and security clearances.

Please include pricing for a 3-year contract term.`;

const paraSections = analyzeRFP(paragraphRFP);
assert(paraSections.length >= 2, "Falls back to paragraph splitting (found " + paraSections.length + ")");
assert(paraSections[0].id.length > 0, "Sections have IDs");

section("Analyzer - Section Properties");
const singleSection = analyzeRFP("SCOPE OF WORK:\nProvide managed IT services for our 500-person office.");
assert(singleSection.length >= 1, "Parses single section");
if (singleSection.length > 0) {
  assert(typeof singleSection[0].id === "string", "Section has string id");
  assert(typeof singleSection[0].title === "string", "Section has string title");
  assert(typeof singleSection[0].content === "string", "Section has string content");
  assert(["question", "requirement", "criteria", "general"].includes(singleSection[0].type), "Section type is valid");
}

// ========== Generator Tests ==========
section("Generator - Basic Response Generation");
const testSections: RFPSection[] = [
  { id: "s1", title: "Company Qualifications", content: "Describe your qualifications.", type: "question" },
  { id: "s2", title: "Technical Requirements", content: "The vendor must provide 99.9% uptime.", type: "requirement" },
  { id: "s3", title: "Evaluation Criteria", content: "Scoring will be weighted.", type: "criteria" },
];

const formalResponses = generateResponses(testSections, sampleProfile, "formal");
assert(formalResponses.length === 3, "Generates response for each section");
assert(formalResponses[0].sectionId === "s1", "Response has correct section ID");
assert(formalResponses[0].sectionTitle === "Company Qualifications", "Response has correct section title");
assert(formalResponses[0].response.includes("Acme Solutions"), "Response includes company name");
assert(formalResponses[0].response.length > 100, "Response is substantial (>100 chars)");

section("Generator - Tone Variations");
const persuasiveResponses = generateResponses(testSections.slice(0, 1), sampleProfile, "persuasive");
assert(persuasiveResponses[0].response.includes("uniquely positioned"), "Persuasive tone uses persuasive language");

const technicalResponses = generateResponses(testSections.slice(0, 1), sampleProfile, "technical");
assert(technicalResponses[0].response.includes("technical"), "Technical tone uses technical language");

const formalCheck = generateResponses(testSections.slice(0, 1), sampleProfile, "formal");
assert(formalCheck[0].response.includes("respectfully"), "Formal tone uses formal language");

section("Generator - Profile Integration");
assert(formalResponses[0].response.includes("cloud migration") || formalResponses[0].response.includes("cybersecurity"), "Response includes capabilities");
assert(formalResponses[0].response.includes("25") || formalResponses[0].response.includes("team"), "Response references team size");

section("Generator - Section Type Handling");
const reqResponse = formalResponses.find(r => r.sectionId === "s2");
assert(reqResponse !== undefined && reqResponse.response.includes("complies"), "Requirement response addresses compliance");

const criteriaResponse = formalResponses.find(r => r.sectionId === "s3");
assert(criteriaResponse !== undefined && criteriaResponse.response.includes("alignment"), "Criteria response addresses alignment");

// ========== Profile Store Tests ==========
section("Profile Store");
clearProfiles();
assert(getAllProfiles().length === 0, "Store starts empty after clear");

saveProfile(sampleProfile);
assert(getAllProfiles().length === 1, "Profile saved successfully");

const retrieved = getProfile("test-1");
assert(retrieved !== undefined, "Profile retrieved by ID");
assert(retrieved?.name === "Acme Solutions", "Retrieved profile has correct name");

const profile2: CompanyProfile = {
  id: "test-2",
  name: "Beta Corp",
  description: "A second company.",
  capabilities: "consulting",
  pastProjects: "",
  teamSize: 5,
  createdAt: new Date().toISOString(),
};
saveProfile(profile2);
assert(getAllProfiles().length === 2, "Multiple profiles stored");

deleteProfile("test-1");
assert(getAllProfiles().length === 1, "Profile deleted successfully");
assert(getProfile("test-1") === undefined, "Deleted profile not found");

clearProfiles();
assert(getAllProfiles().length === 0, "Clear removes all profiles");

// ========== Summary ==========
console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
