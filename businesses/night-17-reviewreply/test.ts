import { analyzeSentiment, generateResponse, Sentiment, Tone } from "./app/api/generate";
import { Review } from "./app/api/store";

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

function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: "test-1",
    reviewerName: "Test User",
    rating: 3,
    reviewText: "Average experience.",
    platform: "Google",
    businessName: "Test Biz",
    ...overrides,
  };
}

console.log("\n--- ReviewReply Tests ---\n");

// Test 1: Sentiment analysis - positive review
console.log("Test 1: Sentiment analysis for positive review");
{
  const review = makeReview({ rating: 5, reviewText: "Amazing experience, absolutely wonderful!" });
  const sentiment = analyzeSentiment(review);
  assert(sentiment === "positive", `Expected 'positive', got '${sentiment}'`);
}

// Test 2: Sentiment analysis - negative review
console.log("Test 2: Sentiment analysis for negative review");
{
  const review = makeReview({ rating: 1, reviewText: "Terrible, awful service. Worst place ever." });
  const sentiment = analyzeSentiment(review);
  assert(sentiment === "negative", `Expected 'negative', got '${sentiment}'`);
}

// Test 3: Sentiment analysis - neutral review
console.log("Test 3: Sentiment analysis for neutral review");
{
  const review = makeReview({ rating: 3, reviewText: "It was okay. Nothing special." });
  const sentiment = analyzeSentiment(review);
  assert(sentiment === "neutral", `Expected 'neutral', got '${sentiment}'`);
}

// Test 4: Response generation - professional tone for positive review
console.log("Test 4: Professional response for positive review");
{
  const review = makeReview({
    rating: 5,
    reviewText: "Excellent food and great service!",
    businessName: "The Bistro",
    reviewerName: "Alice",
  });
  const response = generateResponse(review, "professional");
  assert(response.includes("Dear Alice"), `Response should address reviewer by name`);
  assert(response.includes("The Bistro"), `Response should include business name`);
  assert(response.includes("5-star"), `Response should reference the rating`);
}

// Test 5: Response generation - apologetic tone for negative review
console.log("Test 5: Apologetic response for negative review");
{
  const review = makeReview({
    rating: 1,
    reviewText: "Horrible food, rude staff, terrible experience.",
    businessName: "Cafe Luna",
    reviewerName: "Bob",
  });
  const response = generateResponse(review, "apologetic");
  assert(response.includes("Dear Bob"), `Response should address reviewer by name`);
  assert(response.includes("Cafe Luna"), `Response should include business name`);
  assert(
    response.toLowerCase().includes("apolog"),
    `Apologetic tone should include an apology`
  );
}

// Test 6: Response generation - friendly tone for neutral review
console.log("Test 6: Friendly response for neutral review");
{
  const review = makeReview({
    rating: 3,
    reviewText: "Decent place. Average food.",
    businessName: "Grill House",
    reviewerName: "Carol",
  });
  const response = generateResponse(review, "friendly");
  assert(response.includes("Hi Carol!"), `Friendly tone should use casual greeting`);
  assert(response.includes("Grill House"), `Response should include business name`);
}

// Test 7: Star rating boundaries
console.log("Test 7: Star rating boundary handling");
{
  const review4 = makeReview({ rating: 4, reviewText: "Good overall experience." });
  const review2 = makeReview({ rating: 2, reviewText: "Not great, disappointed with the wait." });
  const sentiment4 = analyzeSentiment(review4);
  const sentiment2 = analyzeSentiment(review2);
  assert(sentiment4 === "positive", `4-star should be positive, got '${sentiment4}'`);
  assert(sentiment2 === "negative", `2-star should be negative, got '${sentiment2}'`);
}

// Test 8: Empathetic tone generation
console.log("Test 8: Empathetic tone for negative review");
{
  const review = makeReview({
    rating: 2,
    reviewText: "Waited forever and the food was cold and wrong.",
    businessName: "Pizza Place",
    reviewerName: "Dan",
  });
  const response = generateResponse(review, "empathetic");
  assert(response.includes("Dear Dan"), `Empathetic response should address reviewer`);
  assert(response.includes("Pizza Place"), `Response should include business name`);
  assert(
    response.toLowerCase().includes("understand") || response.toLowerCase().includes("sorry"),
    `Empathetic tone should show understanding`
  );
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
if (failed > 0) process.exit(1);
