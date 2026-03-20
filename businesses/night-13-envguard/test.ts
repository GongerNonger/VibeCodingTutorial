// EnvGuard Test Suite
// Run: npx tsx test.ts

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
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

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function runTests() {
  console.log("\nEnvGuard Test Suite\n" + "=".repeat(40));

  // Test 1: List scans (should include pre-seeded sample)
  await test("GET /api/scans returns pre-seeded scan", async () => {
    const res = await fetch(`${BASE_URL}/api/scans`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const scans = await res.json();
    assert(Array.isArray(scans), "Response should be an array");
    assert(scans.length >= 1, "Should have at least 1 pre-seeded scan");
    const sample = scans.find(
      (s: { projectName: string }) => s.projectName === "Insecure Demo App"
    );
    assert(sample !== undefined, "Should find pre-seeded 'Insecure Demo App'");
    assert(sample.riskScore === 92, `Expected risk score 92, got ${sample.riskScore}`);
  });

  // Test 2: Create a new scan
  await test("POST /api/scans creates a new scan", async () => {
    const res = await fetch(`${BASE_URL}/api/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: "Test Project",
        fileContent: "API_KEY=sk_live_test123\nDB_HOST=localhost\n",
        fileType: ".env",
      }),
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const scan = await res.json();
    assert(scan.id !== undefined, "Scan should have an id");
    assert(scan.projectName === "Test Project", "Project name should match");
    assert(scan.analysis === null, "Analysis should be null before running");
  });

  // Test 3: Validate required fields
  await test("POST /api/scans validates required fields", async () => {
    const res = await fetch(`${BASE_URL}/api/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectName: "Missing fields" }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const body = await res.json();
    assert(body.error !== undefined, "Should return error message");
  });

  // Test 4: Analyze a scan and detect AWS keys
  await test("POST /api/scans/[id]/analyze detects AWS keys and secrets", async () => {
    // Create a scan with known secrets
    const createRes = await fetch(`${BASE_URL}/api/scans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: "AWS Test",
        fileContent: [
          "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE",
          "AWS_SECRET=short",
          "STRIPE_KEY=sk_live_abc123",
          "DB_URL=postgresql://user:pass@10.0.0.1:5432/db",
          "SAFE_VAR=hello_world",
          "PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----abc",
        ].join("\n"),
        fileType: ".env",
      }),
    });
    const scan = await createRes.json();

    const analyzeRes = await fetch(
      `${BASE_URL}/api/scans/${scan.id}/analyze`,
      { method: "POST" }
    );
    assert(analyzeRes.status === 200, `Expected 200, got ${analyzeRes.status}`);
    const result = await analyzeRes.json();

    assert(result.analysis !== undefined, "Should have analysis");
    assert(result.analysis.findings.length >= 4, `Expected at least 4 findings, got ${result.analysis.findings.length}`);
    assert(result.analysis.riskScore > 0, "Risk score should be > 0");
    assert(result.analysis.stats.totalVars === 6, `Expected 6 total vars, got ${result.analysis.stats.totalVars}`);

    // Check that AWS key was detected as critical
    const awsFinding = result.analysis.findings.find(
      (f: { variable: string }) => f.variable === "AWS_ACCESS_KEY_ID"
    );
    assert(awsFinding !== undefined, "Should detect AWS key");
    assert(awsFinding.severity === "critical", "AWS key should be critical severity");
  });

  // Test 5: Get a specific scan by ID
  await test("GET /api/scans/[id] returns scan details", async () => {
    const res = await fetch(`${BASE_URL}/api/scans/sample-001`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const scan = await res.json();
    assert(scan.id === "sample-001", "Should return correct scan");
    assert(scan.analysis !== null, "Pre-seeded scan should have analysis");
    assert(scan.analysis.findings.length > 0, "Should have findings");
    assert(scan.fileContent.length > 0, "Should include file content");
  });

  // Test 6: 404 for non-existent scan
  await test("GET /api/scans/[id] returns 404 for missing scan", async () => {
    const res = await fetch(`${BASE_URL}/api/scans/nonexistent-id`);
    assert(res.status === 404, `Expected 404, got ${res.status}`);
    const body = await res.json();
    assert(body.error !== undefined, "Should return error message");
  });

  // Summary
  console.log("\n" + "=".repeat(40));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Results: ${passed} passed, ${failed} failed out of ${results.length} tests`);

  if (failed > 0) {
    console.log("\nFailed tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
    process.exit(1);
  } else {
    console.log("\nAll tests passed!");
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
