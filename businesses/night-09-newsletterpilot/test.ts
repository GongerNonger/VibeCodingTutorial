/**
 * NewsletterPilot Test Suite
 * Run: npx tsx test.ts
 */

const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.log(`  FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n=== NewsletterPilot Test Suite ===\n");

  // Test 1: GET /api/newsletters returns pre-seeded data
  console.log("Test 1: List newsletters (pre-seeded data)");
  {
    const res = await fetch(`${BASE_URL}/api/newsletters`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/newsletters returns 200");
    assert(Array.isArray(data) && data.length >= 1, "Returns at least 1 pre-seeded newsletter");
    assert(
      data.some((n: { name: string }) => n.name === "Tech Pulse Weekly"),
      "Pre-seeded newsletter 'Tech Pulse Weekly' exists"
    );
  }

  // Test 2: POST /api/newsletters creates a new newsletter
  console.log("\nTest 2: Create a new newsletter");
  let newId: string;
  {
    const res = await fetch(`${BASE_URL}/api/newsletters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Fitness Friday",
        niche: "fitness",
        tone: "casual",
      }),
    });
    const data = await res.json();
    assert(res.status === 201, "POST /api/newsletters returns 201");
    assert(data.name === "Fitness Friday", "Newsletter name matches");
    assert(data.tone === "casual", "Newsletter tone matches");
    newId = data.id;
  }

  // Test 3: POST /api/newsletters validates required fields
  console.log("\nTest 3: Validation - missing required fields");
  {
    const res = await fetch(`${BASE_URL}/api/newsletters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Incomplete" }),
    });
    assert(res.status === 400, "Missing fields returns 400");
  }

  // Test 4: GET /api/newsletters/[id] returns newsletter with editions
  console.log("\nTest 4: Get newsletter by ID with editions");
  {
    const listRes = await fetch(`${BASE_URL}/api/newsletters`);
    const list = await listRes.json();
    const techPulse = list.find(
      (n: { name: string }) => n.name === "Tech Pulse Weekly"
    );
    const res = await fetch(`${BASE_URL}/api/newsletters/${techPulse.id}`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/newsletters/[id] returns 200");
    assert(
      Array.isArray(data.editions) && data.editions.length >= 1,
      "Pre-seeded newsletter has at least 1 edition"
    );
  }

  // Test 5: POST /api/newsletters/[id]/generate creates an edition
  console.log("\nTest 5: Generate newsletter edition");
  {
    const res = await fetch(
      `${BASE_URL}/api/newsletters/${newId}/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: ["Morning Routines", "Protein Myths"],
        }),
      }
    );
    const data = await res.json();
    assert(res.status === 201, "POST generate returns 201");
    assert(
      typeof data.html === "string" && data.html.includes("Morning Routines"),
      "Generated HTML contains topic content"
    );
    assert(
      data.html.includes("<!DOCTYPE html"),
      "Generated HTML is a full email document"
    );
  }

  // Test 6: Generate validates empty topics
  console.log("\nTest 6: Generate validation - empty topics");
  {
    const res = await fetch(
      `${BASE_URL}/api/newsletters/${newId}/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics: [] }),
      }
    );
    assert(res.status === 400, "Empty topics returns 400");
  }

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
