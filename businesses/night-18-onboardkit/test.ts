import {
  generateWelcomeLetter,
  generateFirstWeekSchedule,
  generateRoleExpectations,
  generateCultureOverview,
  generateITSetupChecklist,
  generateHRFormsChecklist,
  generatePacket,
} from "./lib/generator";
import { CompanyProfile, RoleDetails } from "./lib/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

const testCompany: CompanyProfile = {
  id: "test-company-1",
  name: "TechStart",
  industry: "Technology",
  size: "45",
  cultureValues: "Innovation, Collaboration, Transparency",
  dressCode: "Business Casual",
  toolsUsed: "Slack, GitHub, Notion",
};

const testRole: RoleDetails = {
  title: "Frontend Developer",
  department: "Engineering",
  manager: "Sarah Chen",
  startDate: "2026-04-01",
  responsibilities:
    "Build UI components, Write unit tests, Collaborate with designers, Review pull requests",
};

// --- Welcome Letter Tests ---
console.log("\n=== Welcome Letter Tests ===");

const welcomeLetter = generateWelcomeLetter(testCompany, testRole);

assert(
  welcomeLetter.includes("TECHSTART"),
  "Welcome letter contains uppercase company name"
);
assert(
  welcomeLetter.includes("Frontend Developer"),
  "Welcome letter contains role title"
);
assert(
  welcomeLetter.includes("Engineering"),
  "Welcome letter contains department"
);
assert(
  welcomeLetter.includes("Sarah Chen"),
  "Welcome letter contains manager name"
);
assert(
  welcomeLetter.includes("April"),
  "Welcome letter contains formatted start date month"
);
assert(
  welcomeLetter.includes("Innovation, Collaboration, Transparency"),
  "Welcome letter contains culture values"
);
assert(
  welcomeLetter.includes("Technology"),
  "Welcome letter mentions industry"
);

// --- First Week Schedule Tests ---
console.log("\n=== First Week Schedule Tests ===");

const schedule = generateFirstWeekSchedule(testCompany, testRole);

assert(
  schedule.includes("DAY 1"),
  "Schedule contains Day 1"
);
assert(
  schedule.includes("DAY 5"),
  "Schedule contains Day 5"
);
assert(
  schedule.includes("Sarah Chen"),
  "Schedule references manager"
);
assert(
  schedule.includes("Slack, GitHub, Notion"),
  "Schedule mentions company tools"
);
assert(
  schedule.includes("Engineering"),
  "Schedule mentions department"
);

// --- Role Expectations Tests ---
console.log("\n=== Role Expectations Tests ===");

const expectations = generateRoleExpectations(testCompany, testRole);

assert(
  expectations.includes("Frontend Developer"),
  "Expectations contain role title"
);
assert(
  expectations.includes("Build UI components"),
  "Expectations list first responsibility"
);
assert(
  expectations.includes("Review pull requests"),
  "Expectations list last responsibility"
);
assert(
  expectations.includes("FIRST 30 DAYS"),
  "Expectations include 30-day goals"
);
assert(
  expectations.includes("FIRST 90 DAYS"),
  "Expectations include 90-day goals"
);
assert(
  expectations.includes("Sarah Chen"),
  "Expectations reference manager"
);

// --- Culture Overview Tests ---
console.log("\n=== Culture Overview Tests ===");

const culture = generateCultureOverview(testCompany, testRole);

assert(
  culture.includes("TechStart"),
  "Culture overview contains company name"
);
assert(
  culture.includes("Innovation"),
  "Culture overview lists first value"
);
assert(
  culture.includes("Transparency"),
  "Culture overview lists last value"
);
assert(
  culture.includes("Business Casual"),
  "Culture overview mentions dress code"
);
assert(
  culture.includes("Technology"),
  "Culture overview mentions industry"
);

// --- IT Setup Checklist Tests ---
console.log("\n=== IT Setup Checklist Tests ===");

const itChecklist = generateITSetupChecklist(testCompany, testRole);

assert(
  itChecklist.includes("Slack"),
  "IT checklist lists Slack"
);
assert(
  itChecklist.includes("GitHub"),
  "IT checklist lists GitHub"
);
assert(
  itChecklist.includes("Notion"),
  "IT checklist lists Notion"
);
assert(
  itChecklist.includes("Engineering"),
  "IT checklist references department"
);

// --- HR Forms Checklist Tests ---
console.log("\n=== HR Forms Checklist Tests ===");

const hrChecklist = generateHRFormsChecklist(testCompany, testRole);

assert(
  hrChecklist.includes("W-4"),
  "HR checklist mentions W-4 form"
);
assert(
  hrChecklist.includes("I-9"),
  "HR checklist mentions I-9 form"
);
assert(
  hrChecklist.includes("401(k)"),
  "HR checklist mentions 401k"
);
assert(
  hrChecklist.includes("Engineering"),
  "HR checklist references department"
);
assert(
  hrChecklist.includes("TECHSTART"),
  "HR checklist contains uppercase company name"
);

// --- Full Packet Generation Tests ---
console.log("\n=== Full Packet Generation Tests ===");

const packet = generatePacket(testCompany, testRole);

assert(
  typeof packet.welcomeLetter === "string" && packet.welcomeLetter.length > 0,
  "Packet contains non-empty welcome letter"
);
assert(
  typeof packet.firstWeekSchedule === "string" && packet.firstWeekSchedule.length > 0,
  "Packet contains non-empty first week schedule"
);
assert(
  typeof packet.roleExpectations === "string" && packet.roleExpectations.length > 0,
  "Packet contains non-empty role expectations"
);
assert(
  typeof packet.cultureOverview === "string" && packet.cultureOverview.length > 0,
  "Packet contains non-empty culture overview"
);
assert(
  typeof packet.itSetupChecklist === "string" && packet.itSetupChecklist.length > 0,
  "Packet contains non-empty IT setup checklist"
);
assert(
  typeof packet.hrFormsChecklist === "string" && packet.hrFormsChecklist.length > 0,
  "Packet contains non-empty HR forms checklist"
);

// --- Edge Case: Minimal Company ---
console.log("\n=== Edge Case Tests ===");

const minimalCompany: CompanyProfile = {
  id: "min-1",
  name: "SmallCo",
  industry: "Retail",
  size: "10",
  cultureValues: "Teamwork",
  dressCode: "Casual",
  toolsUsed: "Email",
};

const minimalRole: RoleDetails = {
  title: "Sales Associate",
  department: "Sales",
  manager: "Bob Jones",
  startDate: "",
  responsibilities: "Sell products",
};

const minimalPacket = generatePacket(minimalCompany, minimalRole);

assert(
  minimalPacket.welcomeLetter.includes("SmallCo"),
  "Minimal packet welcome letter contains company name"
);
assert(
  minimalPacket.roleExpectations.includes("Sell products"),
  "Minimal packet contains the single responsibility"
);

// --- Summary ---
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"=".repeat(40)}\n`);

if (failed > 0) {
  process.exit(1);
}
