const API_URL = "http://localhost:3000/api/generate";

interface TestCase {
  name: string;
  body: Record<string, unknown>;
  expectStatus: number;
  validate?: (data: Record<string, unknown>) => string | null;
}

const tests: TestCase[] = [
  {
    name: "generates informational brief",
    body: { keyword: "project management software", intent: "informational", wordCount: 2000, audience: "SaaS founders" },
    expectStatus: 200,
    validate: (data) => {
      const brief = data.brief as Record<string, unknown>;
      if (!brief) return "Missing brief";
      if (!brief.title) return "Missing title";
      if (!brief.outline || !Array.isArray(brief.outline) || brief.outline.length === 0) return "Missing or empty outline";
      if (!brief.questionsToAnswer || !Array.isArray(brief.questionsToAnswer)) return "Missing questions";
      if (!brief.relatedKeywords || !Array.isArray(brief.relatedKeywords)) return "Missing related keywords";
      if (!brief.lsiTerms || !Array.isArray(brief.lsiTerms)) return "Missing LSI terms";
      if (!brief.competitors || !Array.isArray(brief.competitors)) return "Missing competitors";
      const meta = brief.meta as Record<string, unknown>;
      if (meta.intent !== "informational") return `Expected informational intent, got ${meta.intent}`;
      if (meta.wordCount !== 2000) return `Expected 2000 word count, got ${meta.wordCount}`;
      return null;
    },
  },
  {
    name: "generates commercial brief",
    body: { keyword: "best crm tools", intent: "commercial", wordCount: 1500, audience: "" },
    expectStatus: 200,
    validate: (data) => {
      const brief = data.brief as Record<string, unknown>;
      const meta = brief.meta as Record<string, unknown>;
      if (meta.intent !== "commercial") return `Expected commercial intent`;
      const outline = brief.outline as Array<Record<string, string>>;
      const hasComparison = outline.some((s) => s.heading.toLowerCase().includes("compar"));
      if (!hasComparison) return "Commercial brief missing comparison section";
      return null;
    },
  },
  {
    name: "generates transactional brief",
    body: { keyword: "buy standing desk", intent: "transactional", wordCount: 1000, audience: "remote workers" },
    expectStatus: 200,
    validate: (data) => {
      const brief = data.brief as Record<string, unknown>;
      const meta = brief.meta as Record<string, unknown>;
      if (meta.intent !== "transactional") return `Expected transactional intent`;
      return null;
    },
  },
  {
    name: "clamps word count to bounds",
    body: { keyword: "test keyword", intent: "informational", wordCount: 99999, audience: "" },
    expectStatus: 200,
    validate: (data) => {
      const brief = data.brief as Record<string, unknown>;
      const meta = brief.meta as Record<string, unknown>;
      if ((meta.wordCount as number) > 5000) return `Word count should be clamped to 5000`;
      return null;
    },
  },
  {
    name: "rejects empty keyword",
    body: { keyword: "", intent: "informational", wordCount: 1500, audience: "" },
    expectStatus: 400,
  },
  {
    name: "rejects invalid intent",
    body: { keyword: "test", intent: "spam", wordCount: 1500, audience: "" },
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

      if (t.expectStatus === 200 && t.validate) {
        const data = await res.json();
        const err = t.validate(data);
        if (err) {
          console.error(`FAIL: ${t.name} — ${err}`);
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
