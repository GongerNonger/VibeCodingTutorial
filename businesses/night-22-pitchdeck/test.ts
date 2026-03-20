import { generateDeck } from "./app/api/generate";
import { getAllDecks, getDeckById, addDeck } from "./app/api/store";

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

const sampleInput = {
  companyName: "TestCo",
  industry: "SaaS",
  problem: "Teams waste hours on manual data entry",
  solution: "AI-powered automation that eliminates repetitive work",
  targetMarket: "Mid-market B2B companies",
  businessModel: "SaaS subscription at $99/mo per seat",
  fundingAsk: "$1.5M",
  teamSize: 4,
  stage: "seed",
};

console.log("\nPitchDeck Tests\n" + "=".repeat(40));

// Test 1: Deck generation returns valid structure
console.log("\n1. Deck generation returns valid structure");
const deck1 = generateDeck(sampleInput);
assert(!!deck1.id, "Deck has an id");
assert(deck1.companyName === "TestCo", "Company name matches input");
assert(deck1.industry === "SaaS", "Industry matches input");
assert(Array.isArray(deck1.slides), "Slides is an array");
assert(!!deck1.createdAt, "Deck has createdAt timestamp");

// Test 2: Correct slide count (10-12 slides)
console.log("\n2. Slide count is between 10 and 12");
assert(deck1.slides.length >= 10, "At least 10 slides");
assert(deck1.slides.length <= 12, "At most 12 slides");
assert(deck1.slides.length === 11, "Default generation produces 11 slides");

// Test 3: Market sizing is present and realistic
console.log("\n3. Market sizing is present and realistic");
const marketSlide = deck1.slides.find((s) => s.title === "Market Size");
assert(!!marketSlide, "Market Size slide exists");
assert(marketSlide!.content.includes("TAM"), "Market slide includes TAM");
assert(marketSlide!.content.includes("SAM"), "Market slide includes SAM");
assert(marketSlide!.content.includes("SOM"), "Market slide includes SOM");

// Test 4: Each slide has talking points
console.log("\n4. Each slide has talking points");
const allHaveTalkingPoints = deck1.slides.every(
  (s) => Array.isArray(s.talkingPoints) && s.talkingPoints.length >= 2
);
assert(allHaveTalkingPoints, "All slides have at least 2 talking points");
const slide1Points = deck1.slides[0].talkingPoints.length;
assert(slide1Points >= 3, "Title slide has at least 3 talking points");

// Test 5: Different industries produce different market data
console.log("\n5. Different industries produce different market data");
const fintechDeck = generateDeck({ ...sampleInput, industry: "FinTech" });
const healthDeck = generateDeck({ ...sampleInput, industry: "HealthTech" });
const fintechMarket = fintechDeck.slides.find((s) => s.title === "Market Size")!.content;
const healthMarket = healthDeck.slides.find((s) => s.title === "Market Size")!.content;
assert(fintechMarket !== healthMarket, "FinTech and HealthTech market data differs");
assert(fintechMarket.includes("fintech"), "FinTech deck mentions fintech market");
assert(healthMarket.includes("health"), "HealthTech deck mentions health market");

// Test 6: Required slides are present
console.log("\n6. Required slides are present");
const requiredTitles = [
  "The Problem",
  "Our Solution",
  "Market Size",
  "Business Model",
  "Traction & Milestones",
  "Competitive Landscape",
  "Team",
  "Financial Projections",
  "The Ask",
  "Appendix",
];
for (const title of requiredTitles) {
  const found = deck1.slides.some((s) => s.title === title);
  assert(found, `Required slide "${title}" is present`);
}

// Test 7: Store operations
console.log("\n7. Store operations work correctly");
const initialCount = getAllDecks().length;
assert(initialCount >= 1, "Store has pre-seeded sample deck");
addDeck(deck1);
const afterCount = getAllDecks().length;
assert(afterCount === initialCount + 1, "Deck was added to store");
const fetched = getDeckById(deck1.id);
assert(fetched?.companyName === "TestCo", "getDeckById returns correct deck");
const notFound = getDeckById("nonexistent-id");
assert(notFound === undefined, "getDeckById returns undefined for missing id");

// Summary
console.log("\n" + "=".repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} total`);
if (failed > 0) {
  process.exit(1);
}
