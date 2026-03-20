/**
 * CourseForge Test Suite
 * Run with: npm test (tsx test.ts)
 */

import { store } from "./app/api/store";

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

console.log("CourseForge Test Suite\n");

// Test 1: Pre-seeded sample course exists
console.log("Test 1: Pre-seeded sample course exists");
{
  const courses = store.getAll();
  assert(courses.length >= 1, "Store has at least one course");
  const sample = courses.find((c) => c.topic === "Introduction to TypeScript");
  assert(sample !== undefined, "Sample TypeScript course exists");
  assert(sample!.lessonsGenerated === true, "Sample course has lessons generated");
  assert(sample!.lessons.length === 5, "Sample course has 5 lessons");
}

// Test 2: Create a new course
console.log("\nTest 2: Create a new course");
{
  const newCourse = store.create({
    topic: "Python Basics",
    description: "Learn Python from scratch",
    audienceLevel: "beginner",
  });
  assert(newCourse.id.length > 0, "New course has an ID");
  assert(newCourse.topic === "Python Basics", "New course topic is correct");
  assert(newCourse.audienceLevel === "beginner", "New course audience level is correct");
  assert(newCourse.lessonsGenerated === false, "New course has no lessons generated yet");
  assert(newCourse.lessons.length === 0, "New course has empty lessons array");
}

// Test 3: List all courses
console.log("\nTest 3: List all courses");
{
  const courses = store.getAll();
  assert(courses.length === 2, "Store has 2 courses after creating one");
  const topics = courses.map((c) => c.topic);
  assert(topics.includes("Introduction to TypeScript"), "List includes sample course");
  assert(topics.includes("Python Basics"), "List includes newly created course");
}

// Test 4: Get a specific course by ID
console.log("\nTest 4: Get a specific course by ID");
{
  const sample = store.getById("sample-ts-101");
  assert(sample !== undefined, "Can retrieve sample course by ID");
  assert(sample!.topic === "Introduction to TypeScript", "Retrieved course has correct topic");
  assert(sample!.lessons.length === 5, "Retrieved course has 5 lessons");

  const missing = store.getById("nonexistent-id");
  assert(missing === undefined, "Returns undefined for nonexistent course");
}

// Test 5: Sample course lessons have quizzes with 3 questions each
console.log("\nTest 5: Lesson structure and quiz validation");
{
  const sample = store.getById("sample-ts-101")!;
  const firstLesson = sample.lessons[0];
  assert(firstLesson.title.length > 0, "Lesson has a title");
  assert(firstLesson.content.length > 0, "Lesson has content");
  assert(firstLesson.keyTakeaways.length > 0, "Lesson has key takeaways");
  assert(firstLesson.quiz.length === 3, "Lesson has 3 quiz questions");

  const firstQuestion = firstLesson.quiz[0];
  assert(firstQuestion.options.length === 4, "Quiz question has 4 options");
  assert(
    firstQuestion.correctIndex >= 0 && firstQuestion.correctIndex < 4,
    "Correct index is valid"
  );

  // Check all lessons have quizzes
  for (const lesson of sample.lessons) {
    assert(lesson.quiz.length === 3, `Lesson "${lesson.title}" has 3 quiz questions`);
  }
}

// Test 6: Delete a course
console.log("\nTest 6: Delete a course");
{
  const courses = store.getAll();
  const pythonCourse = courses.find((c) => c.topic === "Python Basics")!;
  const deleted = store.delete(pythonCourse.id);
  assert(deleted === true, "Delete returns true for existing course");
  assert(store.getById(pythonCourse.id) === undefined, "Deleted course no longer retrievable");
  assert(store.getAll().length === 1, "Store has 1 course after deletion");

  const deleteMissing = store.delete("nonexistent-id");
  assert(deleteMissing === false, "Delete returns false for nonexistent course");
}

console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("All tests passed!");
}
