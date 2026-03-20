import {
  generateProposal,
  assembleFullProposal,
  calculateLineItemTotal,
  calculateTotalPrice,
  formatCurrency,
} from "./lib/generator";
import {
  saveProfile,
  getProfiles,
  getProfile,
  saveProposal,
  getProposals,
} from "./lib/store";
import { FreelancerProfile, GenerateRequest, LineItem } from "./lib/types";

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

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const pass = actual === expected;
  if (!pass) {
    console.log(`    Expected: ${JSON.stringify(expected)}`);
    console.log(`    Actual:   ${JSON.stringify(actual)}`);
  }
  assert(pass, message);
}

// ---- Test Data ----

const testProfile: FreelancerProfile = {
  id: "test-profile-1",
  name: "Jane Smith",
  title: "Full-Stack Developer",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  hourlyRate: 150,
  portfolioUrl: "https://janesmith.dev",
  email: "jane@example.com",
  createdAt: new Date().toISOString(),
};

const testLineItems: LineItem[] = [
  { description: "Frontend Development", quantity: 40, unitPrice: 150, unit: "hours" },
  { description: "Backend API", quantity: 20, unitPrice: 150, unit: "hours" },
  { description: "UI/UX Design", quantity: 1, unitPrice: 2000, unit: "fixed" },
];

const testRequest: GenerateRequest = {
  profile: testProfile,
  project: {
    clientName: "John Doe",
    clientCompany: "Acme Corp",
    projectTitle: "E-Commerce Platform Redesign",
    projectDescription:
      "Complete redesign and rebuild of the existing e-commerce platform with modern technologies.",
    deliverables: [
      "Homepage redesign",
      "Product catalog with search",
      "Shopping cart & checkout",
    ],
    deadline: "2026-06-30",
    pricingModel: "hourly",
    lineItems: testLineItems,
  },
  style: "professional",
};

// ---- Pricing Calculation Tests ----

console.log("\n--- Pricing Calculations ---");

assertEqual(
  calculateLineItemTotal({ description: "Dev", quantity: 10, unitPrice: 100, unit: "hours" }),
  1000,
  "Line item total: 10 x $100 = $1000"
);

assertEqual(
  calculateLineItemTotal({ description: "Design", quantity: 1, unitPrice: 2500, unit: "fixed" }),
  2500,
  "Fixed line item total: 1 x $2500 = $2500"
);

assertEqual(
  calculateLineItemTotal({ description: "Zero", quantity: 0, unitPrice: 100, unit: "hours" }),
  0,
  "Zero quantity line item = $0"
);

assertEqual(
  calculateTotalPrice(testLineItems),
  40 * 150 + 20 * 150 + 2000,
  "Total price sums all line items correctly"
);

assertEqual(
  calculateTotalPrice([]),
  0,
  "Total price of empty line items = $0"
);

assertEqual(
  formatCurrency(1234.56),
  "$1,234.56",
  "Format currency with commas and cents"
);

assertEqual(formatCurrency(0), "$0.00", "Format zero currency");

assertEqual(formatCurrency(99), "$99.00", "Format whole number currency");

// ---- Proposal Generation Tests ----

console.log("\n--- Proposal Generation ---");

const proposal = generateProposal(testRequest);

assert(proposal.id.startsWith("prop_"), "Proposal ID has correct prefix");
assertEqual(proposal.profileId, "test-profile-1", "Proposal links to profile ID");
assertEqual(proposal.clientName, "John Doe", "Proposal has client name");
assertEqual(proposal.projectTitle, "E-Commerce Platform Redesign", "Proposal has project title");
assertEqual(proposal.style, "professional", "Proposal has style");
assertEqual(proposal.totalPrice, 11000, "Proposal total price is correct");
assert(proposal.createdAt.length > 0, "Proposal has createdAt timestamp");

// Cover letter checks
assert(proposal.coverLetter.includes("Dear John Doe"), "Cover letter addresses client");
assert(proposal.coverLetter.includes("Jane Smith"), "Cover letter includes freelancer name");
assert(proposal.coverLetter.includes("Full-Stack Developer"), "Cover letter includes title");
assert(proposal.coverLetter.includes("Acme Corp"), "Cover letter mentions company");

// Project understanding checks
assert(proposal.projectUnderstanding.includes("PROJECT UNDERSTANDING"), "Professional style has correct header");
assert(proposal.projectUnderstanding.includes("Homepage redesign"), "Project understanding lists deliverables");

// Scope of work checks
assert(proposal.scopeOfWork.includes("SCOPE OF WORK"), "Scope of work has header");
assert(proposal.scopeOfWork.includes("Phase 1"), "Scope has phases");
assert(proposal.scopeOfWork.includes("2 rounds of revisions"), "Scope includes revision terms");

// Pricing table checks
assert(proposal.pricingTable.includes("Frontend Development"), "Pricing table includes line items");
assert(proposal.pricingTable.includes("$11,000.00"), "Pricing table shows total");
assert(proposal.pricingTable.includes("Payment Schedule"), "Professional style has payment schedule");

// Terms checks
assert(proposal.termsAndConditions.includes("TERMS & CONDITIONS"), "Terms has header");
assert(proposal.termsAndConditions.includes("30 days"), "Terms mentions validity period");
assert(proposal.termsAndConditions.includes("Signature"), "Terms has signature line");

// Full text assembly
const fullText = assembleFullProposal(proposal);
assert(fullText.includes(proposal.coverLetter), "Full text includes cover letter");
assert(fullText.includes(proposal.pricingTable), "Full text includes pricing table");
assert(fullText.length > 500, "Full text is substantial");

// ---- Style Variants ----

console.log("\n--- Style Variants ---");

const minimalProposal = generateProposal({ ...testRequest, style: "minimal" });
assert(minimalProposal.coverLetter.includes("Best regards"), "Minimal style uses casual sign-off");
assert(minimalProposal.projectUnderstanding.includes("PROJECT OVERVIEW"), "Minimal uses PROJECT OVERVIEW header");

const creativeProposal = generateProposal({ ...testRequest, style: "creative" });
assert(creativeProposal.coverLetter.includes("thrilled"), "Creative style uses enthusiastic language");
assert(creativeProposal.projectUnderstanding.includes("THE VISION"), "Creative uses THE VISION header");

// ---- Profile Store Tests ----

console.log("\n--- Profile Storage ---");

assertEqual(getProfiles().length, 0, "Profiles start empty");

saveProfile(testProfile);
assertEqual(getProfiles().length, 1, "Profile saved successfully");

const retrieved = getProfile("test-profile-1");
assert(retrieved !== undefined, "Can retrieve profile by ID");
assertEqual(retrieved?.name, "Jane Smith", "Retrieved profile has correct name");

const profile2: FreelancerProfile = {
  ...testProfile,
  id: "test-profile-2",
  name: "Bob Jones",
};
saveProfile(profile2);
assertEqual(getProfiles().length, 2, "Multiple profiles stored");

assertEqual(getProfile("nonexistent"), undefined, "Non-existent profile returns undefined");

// ---- Proposal Store Tests ----

console.log("\n--- Proposal Storage ---");

const initialCount = getProposals().length;
saveProposal(proposal);
assertEqual(getProposals().length, initialCount + 1, "Proposal saved to store");

const proposals = getProposals();
assertEqual(proposals[0].id, proposal.id, "Can retrieve saved proposal");

// ---- Summary ----

console.log(`\n${"=".repeat(40)}`);
console.log(`Tests: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"=".repeat(40)}\n`);

if (failed > 0) {
  process.exit(1);
}
