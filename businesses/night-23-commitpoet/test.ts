import { parseDiff, generateMessages, type DiffAnalysis } from "./app/api/generate";

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.error(`  FAIL: ${name}`);
    failed++;
  }
}

console.log("CommitPoet Tests\n================\n");

// Test 1: Diff parsing - file detection
console.log("Test 1: Diff parsing detects files");
{
  const diff = `diff --git a/src/auth.ts b/src/auth.ts
index 1234567..abcdefg 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -10,6 +10,10 @@
+import { verify } from 'jsonwebtoken';
+export function validateToken(token: string) {
+  return verify(token, SECRET);
+}
-const OLD_FUNC = true;`;

  const analysis = parseDiff(diff);
  assert(analysis.filesChanged.length === 1, "Detects 1 file changed");
  assert(analysis.filesChanged[0] === "src/auth.ts", "Correct file path");
  assert(analysis.linesAdded === 4, "Counts 4 lines added");
  assert(analysis.linesRemoved === 1, "Counts 1 line removed");
  assert(analysis.languages.includes("TypeScript"), "Detects TypeScript language");
}

// Test 2: Diff parsing - new file detection
console.log("\nTest 2: Diff parsing detects new files");
{
  const diff = `diff --git a/src/utils.py b/src/utils.py
new file mode 100644
index 0000000..abcdefg
--- /dev/null
+++ b/src/utils.py
@@ -0,0 +1,5 @@
+def hello():
+    print("hello world")
+
+def goodbye():
+    print("goodbye world")`;

  const analysis = parseDiff(diff);
  assert(analysis.changeTypes.includes("new_file"), "Detects new file change type");
  assert(analysis.filesChanged[0] === "src/utils.py", "Correct new file path");
  assert(analysis.languages.includes("Python"), "Detects Python language");
}

// Test 3: Persona generation produces messages for all personas
console.log("\nTest 3: Generates messages for all personas");
{
  const diff = `diff --git a/index.ts b/index.ts
--- a/index.ts
+++ b/index.ts
@@ -1,3 +1,5 @@
+import express from 'express';
+const app = express();
 console.log("hello");`;

  const { messages } = generateMessages(diff, null);
  assert(messages.length === 6, "Generates messages for all 6 personas");
  const personaIds = messages.map((m) => m.personaId);
  assert(personaIds.includes("professional"), "Includes Professional");
  assert(personaIds.includes("pirate"), "Includes Pirate");
  assert(personaIds.includes("shakespeare"), "Includes Shakespeare");
  assert(personaIds.includes("emoji-master"), "Includes Emoji Master");
  assert(personaIds.includes("haiku"), "Includes Haiku");
  assert(personaIds.includes("senior-dev"), "Includes Senior Dev");
}

// Test 4: Professional persona follows conventional commit format
console.log("\nTest 4: Professional persona uses conventional commits");
{
  const diff = `diff --git a/src/feature.ts b/src/feature.ts
new file mode 100644
--- /dev/null
+++ b/src/feature.ts
@@ -0,0 +1,10 @@
+export function newFeature() {
+  return true;
+}
+export function anotherFeature() {
+  return false;
+}`;

  const { messages } = generateMessages(diff, "professional");
  assert(messages.length === 1, "Single persona returns 1 message");
  const msg = messages[0].message;
  assert(
    /^(feat|fix|refactor|docs|test|chore):/.test(msg),
    `Conventional commit prefix found in: "${msg}"`
  );
}

// Test 5: Different change types produce different analyses
console.log("\nTest 5: Different change types detected correctly");
{
  const deletionDiff = `diff --git a/old.js b/old.js
deleted file mode 100644
index abcdefg..0000000
--- a/old.js
+++ /dev/null
@@ -1,3 +0,0 @@
-console.log("old");
-console.log("code");
-console.log("removed");`;

  const analysis = parseDiff(deletionDiff);
  assert(analysis.changeTypes.includes("deletion"), "Detects deletion change type");
  assert(analysis.linesRemoved === 3, "Counts 3 lines removed in deletion");
  assert(analysis.linesAdded === 0, "No lines added in deletion");
}

// Test 6: Messages are unique per persona
console.log("\nTest 6: Messages are unique per persona");
{
  const diff = `diff --git a/app.js b/app.js
--- a/app.js
+++ b/app.js
@@ -5,3 +5,8 @@
+function processData(input) {
+  const result = input.map(x => x * 2);
+  return result.filter(x => x > 10);
+}
+module.exports = { processData };`;

  const { messages } = generateMessages(diff, null);
  const messageTexts = messages.map((m) => m.message);
  const uniqueMessages = new Set(messageTexts);
  assert(
    uniqueMessages.size === messages.length,
    `All ${messages.length} messages are unique (got ${uniqueMessages.size} unique)`
  );
}

// Test 7: Function name detection in diff
console.log("\nTest 7: Detects function names from diff");
{
  const diff = `diff --git a/math.ts b/math.ts
--- a/math.ts
+++ b/math.ts
@@ -1,2 +1,6 @@
+function calculateTotal(items: number[]): number {
+  return items.reduce((sum, item) => sum + item, 0);
+}
+const formatCurrency = (amount: number) => {
+}`;

  const analysis = parseDiff(diff);
  assert(
    analysis.detectedChanges.includes("function:calculateTotal"),
    "Detects calculateTotal function"
  );
  assert(
    analysis.detectedChanges.includes("function:formatCurrency"),
    "Detects formatCurrency function"
  );
}

// Test 8: Haiku persona produces multi-line output
console.log("\nTest 8: Haiku persona produces multi-line output");
{
  const diff = `diff --git a/fix.ts b/fix.ts
--- a/fix.ts
+++ b/fix.ts
@@ -1,2 +1,2 @@
-const broken = true;
+const broken = false;`;

  const { messages } = generateMessages(diff, "haiku");
  assert(messages.length === 1, "Single persona for haiku");
  const lines = messages[0].message.split("\n");
  assert(lines.length === 3, `Haiku has 3 lines (got ${lines.length})`);
}

console.log(`\n================`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);

if (failed > 0) {
  console.error("\nSome tests failed!");
  process.exit(1);
} else {
  console.log("\nAll tests passed!");
}
