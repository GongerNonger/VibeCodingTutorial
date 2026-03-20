const API = "http://localhost:3000/api/entries";
async function run() {
  let p = 0, f = 0;
  const test = async (name: string, fn: () => Promise<string | null>) => {
    try { const e = await fn(); if (e) { console.error(`FAIL: ${name} — ${e}`); f++; } else { console.log(`PASS: ${name}`); p++; } } catch (e) { console.error(`FAIL: ${name} — ${e}`); f++; }
  };
  await test("list seeded entries", async () => {
    const r = await fetch(API); const d = await r.json();
    if (!d.entries || d.entries.length < 3) return `Expected >=3 seeded entries, got ${d.entries?.length}`; return null;
  });
  await test("create feature entry", async () => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "New Dashboard", date: "2026-03-20", version: "v3.0.0", type: "feature", description: "Redesigned dashboard", details: "- New charts\n- Better nav" }) });
    if (r.status !== 201) return `Expected 201, got ${r.status}`; return null;
  });
  await test("reject missing title", async () => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: "2026-03-20", version: "v1.0.0", type: "fix", description: "test" }) });
    if (r.status !== 400) return `Expected 400, got ${r.status}`; return null;
  });
  await test("reject invalid type", async () => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "X", date: "2026-03-20", version: "v1.0.0", type: "invalid", description: "test" }) });
    if (r.status !== 400) return `Expected 400, got ${r.status}`; return null;
  });
  await test("entries sorted by date desc", async () => {
    const r = await fetch(API); const d = await r.json();
    for (let i = 1; i < d.entries.length; i++) { if (d.entries[i].date > d.entries[i-1].date) return "Not sorted descending"; } return null;
  });
  console.log(`\n${p}/${p + f} tests passed`); if (f > 0) process.exit(1);
} run();
