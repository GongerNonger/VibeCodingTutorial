import { analyzeLease } from "./app/api/analyze";

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

console.log("LeaseEye Tests\n");

// Test 1: Rent extraction
console.log("Test 1: Rent Extraction");
const r1 = analyzeLease("The monthly rent shall be $1,500/month due on the 1st of each month.");
assert(r1.monthlyRent === "$1,500", `Expected rent $1,500, got ${r1.monthlyRent}`);

const r1b = analyzeLease("Monthly rent of $2,200 is due on the first.");
assert(r1b.monthlyRent === "$2,200", `Expected rent $2,200, got ${r1b.monthlyRent}`);

// Test 2: Red flag detection
console.log("\nTest 2: Red Flag Detection");
const r2 = analyzeLease("Landlord may enter premises without notice at any time. Tenant waives right to jury trial. The lease will automatically renew for another 12 months.");
assert(r2.redFlags.length >= 2, `Expected at least 2 red flags, got ${r2.redFlags.length}`);
const flagTitles = r2.redFlags.map((f) => f.title);
assert(flagTitles.some((t) => /entry/i.test(t)), "Should detect unreasonable entry rights");
assert(flagTitles.some((t) => /waive|legal|right/i.test(t)), "Should detect waived rights");
assert(flagTitles.some((t) => /auto.*renew/i.test(t)), "Should detect auto-renewal");

// Test 3: Risk scoring
console.log("\nTest 3: Risk Scoring");
const r3low = analyzeLease("Monthly rent is $1,000/month. Lease term is 12 months. Landlord provides 48 hours notice before entry.");
assert(r3low.riskScore < 30, `Low risk lease should score < 30, got ${r3low.riskScore}`);

const r3high = analyzeLease("Landlord may enter without notice. Tenant waives right to legal action. Non-refundable fee of $500. Penalty of 3 months rent for early termination.");
assert(r3high.riskScore > 50, `High risk lease should score > 50, got ${r3high.riskScore}`);

// Test 4: Pet policy detection
console.log("\nTest 4: Pet Policy Detection");
const r4a = analyzeLease("Pets are allowed with a $300 pet deposit. Monthly rent is $900/month.");
assert(r4a.petPolicy !== null && /allowed/i.test(r4a.petPolicy!) && /300/.test(r4a.petPolicy!), `Expected pet allowed with deposit, got ${r4a.petPolicy}`);

const r4b = analyzeLease("No pets allowed on the premises. Monthly rent is $800/month.");
assert(r4b.petPolicy === "Not allowed", `Expected 'Not allowed', got ${r4b.petPolicy}`);

// Test 5: Clause categorization
console.log("\nTest 5: Clause Categorization");
const r5 = analyzeLease("Monthly rent is $1,200/month. Tenant is responsible for lawn maintenance. No smoking on premises. Early termination requires 30 days notice.");
const categories = r5.clauses.map((c) => c.category);
assert(categories.includes("financial"), "Should have financial clause");
assert(categories.includes("maintenance"), "Should have maintenance clause");
assert(categories.includes("termination"), "Should have termination clause");

// Test 6: Security deposit parsing
console.log("\nTest 6: Security Deposit Parsing");
const r6 = analyzeLease("A security deposit of $2,500 is required prior to move-in. Monthly rent is $1,200/month.");
assert(r6.securityDeposit === "$2,500", `Expected $2,500, got ${r6.securityDeposit}`);

const r6b = analyzeLease("$1,800 security deposit due at lease signing. Rent is $900/month.");
assert(r6b.securityDeposit === "$1,800", `Expected $1,800, got ${r6b.securityDeposit}`);

// Summary
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
if (failed > 0) {
  console.error("\nSome tests FAILED!");
  process.exit(1);
} else {
  console.log("\nAll tests PASSED!");
}
