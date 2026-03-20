/**
 * ThumbnailCopy Test Suite
 * Run: npx tsx test.ts
 */

const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function test1_listProjects() {
  console.log("\nTest 1: GET /api/thumbnails - List all projects (includes seed)");
  const res = await fetch(`${BASE_URL}/api/thumbnails`);
  const data = await res.json();
  assert(res.status === 200, "Status is 200");
  assert(Array.isArray(data), "Response is an array");
  assert(data.length >= 1, "At least 1 seed project exists");
  const seed = data.find((p: any) => p.videoTitle === "10 JavaScript Tricks You Didn't Know");
  assert(seed !== undefined, "Seed project '10 JavaScript Tricks You Didn't Know' found");
  assert(seed.niche === "programming", "Seed project niche is programming");
  assert(seed.suggestions.length === 5, "Seed project has 5 suggestions");
}

async function test2_createProject() {
  console.log("\nTest 2: POST /api/thumbnails - Create a new project");
  const res = await fetch(`${BASE_URL}/api/thumbnails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoTitle: "Best Budget Laptops 2025",
      niche: "tech",
      targetEmotion: "excitement",
    }),
  });
  const data = await res.json();
  assert(res.status === 201, "Status is 201 Created");
  assert(data.id !== undefined, "Project has an id");
  assert(data.videoTitle === "Best Budget Laptops 2025", "Video title matches");
  assert(data.niche === "tech", "Niche matches");
  assert(data.targetEmotion === "excitement", "Emotion matches");
  assert(Array.isArray(data.suggestions) && data.suggestions.length === 0, "Starts with empty suggestions");
  return data.id;
}

async function test3_getProject(projectId: string) {
  console.log("\nTest 3: GET /api/thumbnails/[id] - Get specific project");
  const res = await fetch(`${BASE_URL}/api/thumbnails/${projectId}`);
  const data = await res.json();
  assert(res.status === 200, "Status is 200");
  assert(data.id === projectId, "Returned project id matches");
  assert(data.videoTitle === "Best Budget Laptops 2025", "Video title matches");
}

async function test4_generateSuggestions(projectId: string) {
  console.log("\nTest 4: POST /api/thumbnails/[id]/generate - Generate suggestions");
  const res = await fetch(`${BASE_URL}/api/thumbnails/${projectId}/generate`, {
    method: "POST",
  });
  const data = await res.json();
  assert(res.status === 200, "Status is 200");
  assert(data.suggestions.length === 5, "Generated 5 suggestions");
  const s = data.suggestions[0];
  assert(typeof s.primaryText === "string" && s.primaryText.length > 0, "Primary text is non-empty string");
  assert(s.primaryText.split(" ").length <= 5, "Primary text is max 5 words");
  assert(typeof s.colorScheme === "string", "Has color scheme");
  assert(typeof s.fontStyle === "string", "Has font style");
  assert(typeof s.viralScore === "number" && s.viralScore >= 1 && s.viralScore <= 100, "Viral score is 1-100");
}

async function test5_notFoundProject() {
  console.log("\nTest 5: GET /api/thumbnails/nonexistent - 404 for missing project");
  const res = await fetch(`${BASE_URL}/api/thumbnails/nonexistent-id-12345`);
  assert(res.status === 404, "Status is 404");
  const data = await res.json();
  assert(data.error !== undefined, "Error message present");
}

async function test6_validationErrors() {
  console.log("\nTest 6: POST /api/thumbnails - Validation errors");
  // Missing video title
  const res1 = await fetch(`${BASE_URL}/api/thumbnails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ niche: "tech", targetEmotion: "joy" }),
  });
  assert(res1.status === 400, "Missing videoTitle returns 400");

  // Invalid emotion
  const res2 = await fetch(`${BASE_URL}/api/thumbnails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoTitle: "Test", niche: "tech", targetEmotion: "anger" }),
  });
  assert(res2.status === 400, "Invalid emotion returns 400");
}

async function runTests() {
  console.log("🧪 ThumbnailCopy Test Suite\n" + "=".repeat(50));

  try {
    await test1_listProjects();
    const projectId = await test2_createProject();
    await test3_getProject(projectId);
    await test4_generateSuggestions(projectId);
    await test5_notFoundProject();
    await test6_validationErrors();
  } catch (err) {
    console.error("\n💥 Test execution error:", err);
    failed++;
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
