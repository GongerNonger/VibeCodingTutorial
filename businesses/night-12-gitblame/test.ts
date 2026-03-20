import { getAllReviews, getReview, createReview, setAnalysis, type Analysis } from "./app/api/store";

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

console.log("\n=== GitBlame Test Suite ===\n");

// Test 1: Pre-seeded review exists
console.log("Test 1: Pre-seeded review exists with analysis");
const allReviews = getAllReviews();
assert(allReviews.length >= 1, "Should have at least one pre-seeded review");
const seeded = allReviews.find((r) => r.title === "Add user authentication");
assert(seeded !== undefined, "Pre-seeded review should have title 'Add user authentication'");
assert(seeded?.analysis !== null, "Pre-seeded review should have analysis populated");
assert(seeded?.analysis?.riskLevel === "high", "Pre-seeded review risk level should be 'high'");

// Test 2: Create a new review
console.log("\nTest 2: Create a new review");
const newReview = createReview({
  title: "Fix button styling",
  description: "Fixes the hover state on primary buttons",
  diffText: `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index abc1234..def5678 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -5,7 +5,7 @@ export function Button({ children, onClick }) {
   return (
     <button
       onClick={onClick}
-      className="bg-blue-500 text-white px-4 py-2 rounded"
+      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
     >
       {children}
     </button>`,
  baseBranch: "main",
  headBranch: "fix/button-hover",
});
assert(newReview.id.length > 0, "New review should have an ID");
assert(newReview.analysis === null, "New review should not have analysis yet");
assert(newReview.title === "Fix button styling", "New review title should match");

// Test 3: Get review by ID
console.log("\nTest 3: Get review by ID");
const fetched = getReview(newReview.id);
assert(fetched !== undefined, "Should find review by ID");
assert(fetched?.id === newReview.id, "Fetched review ID should match");
assert(fetched?.diffText.includes("Button.tsx"), "Diff text should contain file name");

// Test 4: Set analysis on a review
console.log("\nTest 4: Set analysis on a review");
const mockAnalysis: Analysis = {
  summary: "Minor styling fix to add hover state on Button component.",
  riskLevel: "low",
  focusAreas: [
    { file: "src/components/Button.tsx", concern: "Verify hover state works across browsers", priority: "low" },
  ],
  suggestions: ["Consider adding focus styles for accessibility"],
  stats: { filesChanged: 1, additions: 1, deletions: 1 },
  analyzedAt: new Date().toISOString(),
};
const updated = setAnalysis(newReview.id, mockAnalysis);
assert(updated !== undefined, "setAnalysis should return updated review");
assert(updated?.analysis?.riskLevel === "low", "Analysis risk level should be 'low'");
assert(updated?.analysis?.stats.filesChanged === 1, "Stats should show 1 file changed");

// Test 5: List all reviews returns correct count
console.log("\nTest 5: List all reviews returns correct count");
const allAfter = getAllReviews();
assert(allAfter.length >= 2, "Should have at least 2 reviews after creating one");
const hasNew = allAfter.some((r) => r.id === newReview.id);
assert(hasNew, "New review should appear in the list");
// Reviews should be sorted newest first
assert(allAfter[0].createdAt >= allAfter[allAfter.length - 1].createdAt, "Reviews should be sorted newest first");

// Test 6: Non-existent review returns undefined
console.log("\nTest 6: Non-existent review returns undefined");
const missing = getReview("non-existent-id-12345");
assert(missing === undefined, "Non-existent review should return undefined");
const missingAnalysis = setAnalysis("non-existent-id-12345", mockAnalysis);
assert(missingAnalysis === undefined, "setAnalysis on non-existent review should return undefined");

// Summary
console.log(`\n=== Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions ===\n`);

if (failed > 0) {
  process.exit(1);
}
