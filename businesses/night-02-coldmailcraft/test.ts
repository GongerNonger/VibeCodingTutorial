const API_URL = "http://localhost:3000/api/generate";

interface TestCase {
  name: string;
  body: Record<string, unknown>;
  expectStatus: number;
  validate?: (data: Record<string, unknown>) => string | null;
}

const tests: TestCase[] = [
  {
    name: "generates professional 3-email sequence",
    body: {
      senderProduct: "TaskFlow Pro",
      senderDescription: "A fast project management tool that helps teams collaborate easily. Secure and scalable.",
      targetCompany: "Acme Corp",
      targetRole: "Sarah, VP of Marketing",
      tone: "professional",
      emailCount: 3,
    },
    expectStatus: 200,
    validate: (data) => {
      const emails = data.emails as Array<{ subject: string; body: string; purpose: string }>;
      if (!Array.isArray(emails) || emails.length !== 3) return `Expected 3 emails, got ${Array.isArray(emails) ? emails.length : "non-array"}`;
      for (const e of emails) {
        if (!e.subject || !e.body || !e.purpose) return "Email missing subject, body, or purpose";
      }
      return null;
    },
  },
  {
    name: "generates casual single email",
    body: {
      senderProduct: "DesignBot",
      senderDescription: "AI design tool for marketers.",
      targetCompany: "Startup Inc",
      targetRole: "Head of Design",
      tone: "casual",
      emailCount: 1,
    },
    expectStatus: 200,
    validate: (data) => {
      const emails = data.emails as Array<Record<string, string>>;
      if (emails.length !== 1) return `Expected 1 email, got ${emails.length}`;
      return null;
    },
  },
  {
    name: "generates direct 5-email sequence",
    body: {
      senderProduct: "MetricsPro",
      senderDescription: "Real-time analytics. Track everything instantly.",
      targetCompany: "BigCo",
      targetRole: "CTO",
      tone: "direct",
      emailCount: 5,
    },
    expectStatus: 200,
    validate: (data) => {
      const emails = data.emails as Array<Record<string, string>>;
      if (emails.length !== 5) return `Expected 5 emails, got ${emails.length}`;
      return null;
    },
  },
  {
    name: "rejects missing fields",
    body: { senderProduct: "Test", tone: "casual", emailCount: 1 },
    expectStatus: 400,
  },
  {
    name: "rejects invalid tone",
    body: {
      senderProduct: "Test",
      senderDescription: "A thing",
      targetCompany: "Corp",
      targetRole: "CEO",
      tone: "aggressive",
      emailCount: 1,
    },
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
