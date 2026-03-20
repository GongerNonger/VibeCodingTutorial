const BASE_URL = "http://localhost:3000";

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error: message });
    console.log(`  FAIL: ${name} - ${message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log("\nCronSpeak Test Suite\n");

  // Test 1: Generate cron from "every 5 minutes"
  await test("Generate: every 5 minutes", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "every 5 minutes" }),
    });
    assert(res.ok, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.expression === "*/5 * * * *", `Expected '*/5 * * * *', got '${data.expression}'`);
    assert(data.nextRuns.length === 5, `Expected 5 next runs, got ${data.nextRuns.length}`);
    assert(data.breakdown.length === 5, `Expected 5 breakdown fields, got ${data.breakdown.length}`);
  });

  // Test 2: Generate cron from "daily at 9am"
  await test("Generate: daily at 9am", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "daily at 9am" }),
    });
    assert(res.ok, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.expression === "0 9 * * *", `Expected '0 9 * * *', got '${data.expression}'`);
    assert(data.explanation.length > 0, "Expected non-empty explanation");
  });

  // Test 3: Generate returns error for unrecognized input
  await test("Generate: unrecognized input returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "xyzzy gibberish" }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert(data.error !== undefined, "Expected error field in response");
  });

  // Test 4: GET /api/crons returns pre-seeded entries
  await test("GET /api/crons returns pre-seeded data", async () => {
    const res = await fetch(`${BASE_URL}/api/crons`);
    assert(res.ok, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data), "Expected an array");
    assert(data.length >= 5, `Expected at least 5 pre-seeded entries, got ${data.length}`);
  });

  // Test 5: POST /api/crons saves a new expression
  await test("POST /api/crons saves new expression", async () => {
    const res = await fetch(`${BASE_URL}/api/crons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: "*/10 * * * *",
        description: "Every 10 minutes",
        label: "Test Cron",
      }),
    });
    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const data = await res.json();
    assert(data.id !== undefined, "Expected id in response");
    assert(data.expression === "*/10 * * * *", `Expected '*/10 * * * *', got '${data.expression}'`);
  });

  // Test 6: GET /api/crons/[id] returns specific cron
  await test("GET /api/crons/1 returns specific entry", async () => {
    const res = await fetch(`${BASE_URL}/api/crons/1`);
    assert(res.ok, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.id === "1", `Expected id '1', got '${data.id}'`);
    assert(data.expression === "* * * * *", `Expected '* * * * *', got '${data.expression}'`);
  });

  // Summary
  console.log("\n--- Results ---");
  const passed = results.filter((r) => r.passed).length;
  console.log(`${passed}/${results.length} tests passed\n`);

  if (passed < results.length) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
