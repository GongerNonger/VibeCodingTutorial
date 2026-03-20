const BASE_URL = "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  PASS: ${name}`);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error });
    console.log(`  FAIL: ${name} - ${error}`);
  }
}

async function runTests() {
  console.log("\nRegexGenie Test Suite\n" + "=".repeat(40));

  // Test 1: Generate regex for email
  await test("POST /api/generate - email regex", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "email address" }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.regex === "string", "Missing regex field");
    assert(Array.isArray(data.explanation), "Missing explanation array");
    assert(data.explanation.length > 0, "Explanation should not be empty");
    assert(Array.isArray(data.exampleMatches), "Missing exampleMatches");
    // Verify the regex actually works
    const re = new RegExp(data.regex, data.flags || "");
    assert(re.test("user@example.com"), "Regex should match valid email");
    assert(!re.test("not-an-email"), "Regex should not match invalid email");
  });

  // Test 2: Generate regex for phone number
  await test("POST /api/generate - phone number regex", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "phone number" }),
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    const re = new RegExp(data.regex, data.flags || "");
    assert(re.test("5551234567"), "Regex should match phone number");
    assert(re.test("(555) 123-4567"), "Regex should match formatted phone");
  });

  // Test 3: Generate regex returns error for unknown description
  await test("POST /api/generate - unknown description returns 422", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "quantum flux capacitor pattern" }),
    });
    assert(res.status === 422, `Expected 422, got ${res.status}`);
    const data = await res.json();
    assert(typeof data.error === "string", "Should return error message");
  });

  // Test 4: GET /api/patterns returns pre-seeded patterns
  await test("GET /api/patterns - returns pre-seeded patterns", async () => {
    const res = await fetch(`${BASE_URL}/api/patterns`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Response should be an array");
    assert(data.length >= 6, `Expected at least 6 patterns, got ${data.length}`);
    assert(data[0].description, "Pattern should have description");
    assert(data[0].regex, "Pattern should have regex");
  });

  // Test 5: POST /api/patterns - save and retrieve a pattern
  await test("POST /api/patterns - save a new pattern", async () => {
    const res = await fetch(`${BASE_URL}/api/patterns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "Test pattern",
        regex: "^test$",
        flags: "i",
        testStrings: ["test", "TEST", "nope"],
      }),
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const data = await res.json();
    assert(data.id, "Saved pattern should have an id");
    assert(data.description === "Test pattern", "Description mismatch");

    // Retrieve by ID
    const getRes = await fetch(`${BASE_URL}/api/patterns/${data.id}`);
    assert(getRes.status === 200, `Expected 200 for GET by ID, got ${getRes.status}`);
    const retrieved = await getRes.json();
    assert(retrieved.regex === "^test$", "Retrieved regex mismatch");
  });

  // Test 6: POST /api/patterns - reject invalid regex
  await test("POST /api/patterns - rejects invalid regex", async () => {
    const res = await fetch(`${BASE_URL}/api/patterns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "Invalid pattern",
        regex: "[invalid",
        flags: "",
        testStrings: [],
      }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert(data.error.includes("Invalid"), "Should mention invalid regex");
  });

  // Summary
  console.log("\n" + "=".repeat(40));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Results: ${passed} passed, ${failed} failed, ${results.length} total`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
