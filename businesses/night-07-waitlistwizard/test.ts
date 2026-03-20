const BASE = "http://localhost:3000";
async function run() {
  let p = 0, f = 0;
  const test = async (name: string, fn: () => Promise<string | null>) => {
    try { const e = await fn(); if (e) { console.error(`FAIL: ${name} — ${e}`); f++; } else { console.log(`PASS: ${name}`); p++; } } catch (e) { console.error(`FAIL: ${name} — ${e}`); f++; }
  };
  await test("generate minimal waitlist page", async () => {
    const r = await fetch(`${BASE}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName: "TestApp", tagline: "The best app", description: "Great app", features: ["Fast", "Easy"], accentColor: "#f59e0b", style: "minimal", ctaText: "Join" }) });
    if (r.status !== 200) return `Expected 200, got ${r.status}`;
    const d = await r.json(); if (!d.html || !d.html.includes("TestApp")) return "Missing product name in HTML"; return null;
  });
  await test("generate bold page with social proof", async () => {
    const r = await fetch(`${BASE}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName: "BoldApp", tagline: "Bold", description: "Desc", features: [], accentColor: "#f59e0b", style: "bold", ctaText: "Sign Up", socialProof: "1000 users" }) });
    if (r.status !== 200) return `Expected 200`; const d = await r.json(); if (!d.html.includes("1000 users")) return "Missing social proof"; return null;
  });
  await test("reject missing productName", async () => {
    const r = await fetch(`${BASE}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tagline: "x", style: "minimal" }) });
    if (r.status !== 400) return `Expected 400, got ${r.status}`; return null;
  });
  await test("subscribe endpoint", async () => {
    const r = await fetch(`${BASE}/api/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "test@example.com", productName: "TestApp" }) });
    if (r.status !== 200) return `Expected 200`; const d = await r.json(); if (!d.success || d.count < 1) return "Missing success/count"; return null;
  });
  await test("get subscriber count", async () => {
    const r = await fetch(`${BASE}/api/subscribe?productName=TestApp`); const d = await r.json();
    if (d.count < 1) return `Expected count >= 1`; return null;
  });
  console.log(`\n${p}/${p + f} tests passed`); if (f > 0) process.exit(1);
} run();
