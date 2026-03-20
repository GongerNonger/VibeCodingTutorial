import {
  analyzeSentiment,
  detectStarRating,
  extractThemes,
  extractKeyPhrases,
  analyzeReview,
  generateResponse,
  Tone,
  Length,
  BusinessProfile,
  ReviewAnalysis,
} from "./lib/engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertEq<T>(actual: T, expected: T, message: string) {
  assert(actual === expected, `${message} (got: ${actual}, expected: ${expected})`);
}

function assertIncludes(arr: string[], item: string, message: string) {
  assert(arr.includes(item), `${message} (looking for "${item}" in [${arr.join(", ")}])`);
}

console.log("\n=== ReviewReply Test Suite ===\n");

// --- Sentiment Analysis ---
console.log("Sentiment Analysis:");

assertEq(
  analyzeSentiment("This place is amazing! The food was excellent and the staff was wonderful."),
  "positive",
  "Strongly positive review detected as positive"
);

assertEq(
  analyzeSentiment("Terrible experience. The food was awful and the service was horrible."),
  "negative",
  "Strongly negative review detected as negative"
);

assertEq(
  analyzeSentiment("The food was great but the service was terrible."),
  "mixed",
  "Mixed review detected as mixed"
);

assertEq(
  analyzeSentiment("I went to the store and bought some items."),
  "mixed",
  "Neutral review without strong words defaults to mixed"
);

assertEq(
  analyzeSentiment("Best place ever! Amazing food, perfect atmosphere, love it!"),
  "positive",
  "Multiple positive words = positive"
);

assertEq(
  analyzeSentiment("Worst experience. Disgusting, rude, avoid at all costs."),
  "negative",
  "Multiple negative words = negative"
);

// --- Star Rating Detection ---
console.log("\nStar Rating Detection:");

assertEq(
  detectStarRating("5 stars! Amazing experience!"),
  5,
  "Explicit 5 stars detected"
);

assertEq(
  detectStarRating("I give this place 2/5"),
  2,
  "Explicit 2/5 rating detected"
);

assertEq(
  detectStarRating("1 star. Terrible."),
  1,
  "Explicit 1 star detected"
);

assertEq(
  detectStarRating("Great amazing excellent wonderful fantastic love"),
  5,
  "All positive words infers 5 stars"
);

assertEq(
  detectStarRating("Terrible horrible awful worst hate"),
  1,
  "All negative words infers 1 star"
);

assert(
  detectStarRating("It was okay, nothing special") === 3,
  "Neutral review infers 3 stars"
);

// --- Theme Extraction ---
console.log("\nTheme Extraction:");

const serviceThemes = extractThemes("The staff was incredibly helpful and the manager came to check on us.");
assertIncludes(serviceThemes, "customer service", "Staff/manager mention extracts customer service theme");

const foodThemes = extractThemes("The pasta dish was delicious and the chef clearly knows what he's doing.");
assertIncludes(foodThemes, "food quality", "Food-related words extract food quality theme");

const valueThemes = extractThemes("Way too expensive for what you get. Overpriced and not worth the money.");
assertIncludes(valueThemes, "value", "Price mentions extract value theme");

const waitThemes = extractThemes("We had to wait over an hour for our food. So slow.");
assertIncludes(waitThemes, "wait time", "Wait-related words extract wait time theme");

const cleanThemes = extractThemes("The place was spotless and very clean.");
assertIncludes(cleanThemes, "cleanliness", "Clean-related words extract cleanliness theme");

const defaultThemes = extractThemes("Went there yesterday.");
assertIncludes(defaultThemes, "general experience", "No theme keywords defaults to general experience");

// --- Key Phrase Extraction ---
console.log("\nKey Phrase Extraction:");

const phrases = extractKeyPhrases("The food was amazing. The service was top notch. Will definitely come back.");
assert(phrases.length > 0, "Key phrases are extracted from multi-sentence review");
assert(phrases.length <= 5, "At most 5 key phrases extracted");

const singlePhrase = extractKeyPhrases("Short");
assert(singlePhrase.length > 0, "Even short text returns at least one phrase");

// --- Full Review Analysis ---
console.log("\nFull Review Analysis:");

const fullAnalysis = analyzeReview("5 stars! The food was absolutely delicious and the staff was so friendly. Great atmosphere too!");
assertEq(fullAnalysis.sentiment, "positive", "Full analysis: sentiment is positive");
assertEq(fullAnalysis.starRating, 5, "Full analysis: star rating is 5");
assert(fullAnalysis.themes.length > 0, "Full analysis: themes are extracted");
assert(fullAnalysis.keyPhrases.length > 0, "Full analysis: key phrases are extracted");

// --- Response Generation ---
console.log("\nResponse Generation:");

const testBusiness: BusinessProfile = {
  id: "test-1",
  name: "Mario's Pizzeria",
  type: "restaurant",
  personality: "We deliver authentic Italian dining experiences",
};

const positiveAnalysis: ReviewAnalysis = {
  sentiment: "positive",
  starRating: 5,
  themes: ["food quality", "customer service"],
  keyPhrases: ["The pizza was amazing"],
};

const negativeAnalysis: ReviewAnalysis = {
  sentiment: "negative",
  starRating: 1,
  themes: ["wait time", "customer service"],
  keyPhrases: ["We waited over an hour"],
};

// Test all tones with positive
const tones: Tone[] = ["professional", "friendly", "empathetic", "assertive"];
for (const t of tones) {
  const resp = generateResponse("Amazing pizza!", positiveAnalysis, t, "standard", testBusiness);
  assert(resp.text.length > 50, `${t} tone generates substantial response`);
  assertEq(resp.tone, t, `${t} tone is correctly set in response`);
  assert(resp.text.includes("Mario's Pizzeria"), `${t} response includes business name`);
}

// Test negative response contains apology language
const negResp = generateResponse("Terrible wait time and rude staff.", negativeAnalysis, "empathetic", "standard");
assert(
  negResp.text.toLowerCase().includes("sorry") || negResp.text.toLowerCase().includes("apologize"),
  "Negative empathetic response contains apology language"
);

// Test length variations
const briefResp = generateResponse("Great place!", positiveAnalysis, "professional", "brief", testBusiness);
const detailedResp = generateResponse("Great place!", positiveAnalysis, "professional", "detailed", testBusiness);
assert(detailedResp.text.length > briefResp.text.length, "Detailed response is longer than brief response");

// Test response without business
const noBizResp = generateResponse("Good food!", positiveAnalysis, "friendly", "standard");
assert(!noBizResp.text.includes("Mario"), "Response without business does not include business name");

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed, ${passed + failed} total ===\n`);

if (failed > 0) {
  process.exit(1);
}

console.log("All tests passed!\n");
