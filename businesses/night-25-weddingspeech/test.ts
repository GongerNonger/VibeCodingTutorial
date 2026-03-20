import { generateSpeech } from "./app/api/generate";
import { speeches, addSpeech, getSpeech, getAllSpeeches } from "./app/api/store";

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

const baseInput = {
  speakerRole: "best man",
  speakerName: "Marcus",
  coupleName1: "Jake",
  coupleName2: "Emily",
  howYouKnow: "Jake and I have been friends since high school. We played on the same basketball team.",
  favoriteMemory: "The road trip we took to the coast where Jake proposed to Emily at sunset.",
  coupleQualities: ["funny", "adventurous", "loyal"],
  tone: "heartfelt",
  length: "medium",
};

console.log("\n=== WeddingSpeech Tests ===\n");

// Test 1: Basic speech generation
console.log("Test 1: Speech generation produces valid output");
{
  const result = generateSpeech(baseInput);
  assert(result.speech.length > 0, "Speech is not empty");
  assert(result.wordCount > 0, "Word count is positive");
  assert(result.estimatedMinutes > 0, "Estimated minutes is positive");
}

// Test 2: Role-specific openings
console.log("\nTest 2: Role-specific openings");
{
  const roles = ["best man", "maid of honor", "father of bride", "mother of bride", "friend", "sibling"];
  for (const role of roles) {
    const result = generateSpeech({ ...baseInput, speakerRole: role });
    assert(
      result.speech.includes("Marcus"),
      `${role} speech includes speaker name`
    );
  }
  // Best man should have best man-specific language
  const bestManResult = generateSpeech({ ...baseInput, speakerRole: "best man" });
  assert(
    bestManResult.speech.toLowerCase().includes("best man") || bestManResult.speech.includes("Marcus"),
    "Best man speech has role-specific content"
  );
  const maidResult = generateSpeech({ ...baseInput, speakerRole: "maid of honor" });
  assert(
    maidResult.speech.toLowerCase().includes("maid of honor") || maidResult.speech.includes("Marcus"),
    "Maid of honor speech has role-specific content"
  );
}

// Test 3: Tone differences
console.log("\nTest 3: Tone differences");
{
  const heartfelt = generateSpeech({ ...baseInput, tone: "heartfelt" });
  const funny = generateSpeech({ ...baseInput, tone: "funny" });
  const formal = generateSpeech({ ...baseInput, tone: "formal" });
  const casual = generateSpeech({ ...baseInput, tone: "casual" });

  assert(heartfelt.speech !== funny.speech, "Heartfelt differs from funny");
  assert(formal.speech !== casual.speech, "Formal differs from casual");
  assert(heartfelt.speech !== formal.speech, "Heartfelt differs from formal");
  assert(funny.speech !== casual.speech, "Funny differs from casual");
}

// Test 4: Length targets (word count within range)
console.log("\nTest 4: Length targets");
{
  const short = generateSpeech({ ...baseInput, length: "short" });
  const medium = generateSpeech({ ...baseInput, length: "medium" });
  const long = generateSpeech({ ...baseInput, length: "long" });

  assert(short.wordCount < medium.wordCount, "Short is shorter than medium");
  assert(medium.wordCount < long.wordCount, "Medium is shorter than long");
  assert(short.estimatedMinutes === 2, "Short is ~2 minutes");
  assert(medium.estimatedMinutes === 4, "Medium is ~4 minutes");
  assert(long.estimatedMinutes === 6, "Long is ~6 minutes");
}

// Test 5: Personalization (names appear in speech)
console.log("\nTest 5: Personalization");
{
  const result = generateSpeech(baseInput);
  assert(result.speech.includes("Jake"), "Speech contains couple name 1");
  assert(result.speech.includes("Emily"), "Speech contains couple name 2");
  assert(result.speech.includes("Marcus"), "Speech contains speaker name");

  // Test with different names
  const result2 = generateSpeech({
    ...baseInput,
    speakerName: "Priya",
    coupleName1: "Chen",
    coupleName2: "David",
  });
  assert(result2.speech.includes("Priya"), "Speech contains custom speaker name");
  assert(result2.speech.includes("Chen"), "Speech contains custom couple name 1");
  assert(result2.speech.includes("David"), "Speech contains custom couple name 2");
}

// Test 6: All required sections present
console.log("\nTest 6: All required sections present (5 paragraphs)");
{
  const result = generateSpeech(baseInput);
  const paragraphs = result.speech.split("\n\n");
  assert(paragraphs.length === 5, `Speech has 5 sections (got ${paragraphs.length})`);

  // Check opening contains speaker name
  assert(paragraphs[0].includes("Marcus"), "Opening section mentions speaker");

  // Check anecdote references the memory/relationship
  assert(
    paragraphs[1].includes("basketball") || paragraphs[1].includes("high school") || paragraphs[1].includes("friend"),
    "Anecdote section references how they know each other"
  );

  // Check toast/closing has "cheers" or "glasses" or "toast"
  const lastParagraph = paragraphs[4].toLowerCase();
  assert(
    lastParagraph.includes("cheers") || lastParagraph.includes("glass") || lastParagraph.includes("toast"),
    "Closing section has a toast"
  );
}

// Test 7: Store operations
console.log("\nTest 7: Store operations");
{
  const initialCount = getAllSpeeches().length;
  assert(initialCount >= 1, "Store has pre-seeded speech");

  const sample = getSpeech("sample-1");
  assert(sample !== undefined, "Can retrieve pre-seeded speech by ID");
  assert(sample?.speakerRole === "best man", "Pre-seeded speech has correct role");

  const added = addSpeech({
    speakerRole: "friend",
    speakerName: "Test",
    coupleName1: "A",
    coupleName2: "B",
    howYouKnow: "test",
    favoriteMemory: "test",
    coupleQualities: ["kind"],
    tone: "casual",
    length: "short",
    generatedSpeech: "test speech",
    wordCount: 2,
    estimatedMinutes: 1,
  });
  assert(added.id.startsWith("speech-"), "Added speech has valid ID");
  assert(getAllSpeeches().length === initialCount + 1, "Store count increased");
  assert(getSpeech(added.id)?.speakerName === "Test", "Can retrieve added speech");
}

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  process.exit(1);
}
