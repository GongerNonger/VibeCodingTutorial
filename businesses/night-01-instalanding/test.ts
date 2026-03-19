// Simple test for the landing page generator API
// Run with: npx tsx test.ts

const API_URL = "http://localhost:3000/api/generate";

interface TestCase {
  name: string;
  body: Record<string, unknown>;
  expectStatus: number;
}

const tests: TestCase[] = [
  {
    name: "generates modern landing page",
    body: {
      productName: "TaskFlow Pro",
      description:
        "A fast project management tool that helps teams collaborate easily. Secure and scalable for growing businesses. Integrates with all your favorite tools.",
      style: "modern",
    },
    expectStatus: 200,
  },
  {
    name: "generates bold landing page",
    body: {
      productName: "NeonDash",
      description:
        "Real-time analytics dashboard with smart automation. Track every metric instantly.",
      style: "bold",
    },
    expectStatus: 200,
  },
  {
    name: "generates minimal landing page",
    body: {
      productName: "Clarity",
      description: "Simple note-taking for people who think clearly.",
      style: "minimal",
    },
    expectStatus: 200,
  },
  {
    name: "rejects missing product name",
    body: { description: "A thing", style: "modern" },
    expectStatus: 400,
  },
  {
    name: "rejects invalid style",
    body: {
      productName: "Test",
      description: "A thing",
      style: "neon",
    },
    expectStatus: 400,
  },
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t.body),
      });

      if (res.status !== t.expectStatus) {
        console.error(`FAIL: ${t.name} — expected ${t.expectStatus}, got ${res.status}`);
        failed++;
        continue;
      }

      if (t.expectStatus === 200) {
        const data = await res.json();
        if (!data.html || !data.html.includes("<!DOCTYPE html>")) {
          console.error(`FAIL: ${t.name} — response missing valid HTML`);
          failed++;
          continue;
        }
        if (!data.html.includes(t.body.productName as string)) {
          console.error(`FAIL: ${t.name} — HTML missing product name`);
          failed++;
          continue;
        }
      }

      console.log(`PASS: ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`FAIL: ${t.name} — ${err}`);
      failed++;
    }
  }

  console.log(`\n${passed}/${passed + failed} tests passed`);
  if (failed > 0) process.exit(1);
}

runTests();
