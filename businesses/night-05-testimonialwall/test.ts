const BASE = "http://localhost:3000";
async function run() {
  let p = 0, f = 0;
  const test = async (name: string, fn: () => Promise<string | null>) => {
    try { const e = await fn(); if (e) { console.error(`FAIL: ${name} — ${e}`); f++; } else { console.log(`PASS: ${name}`); p++; } } catch (e) { console.error(`FAIL: ${name} — ${e}`); f++; }
  };
  // Create wall
  let wallId = "";
  await test("create wall", async () => {
    const r = await fetch(`${BASE}/api/walls`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Test Wall", description: "A test" }) });
    if (r.status !== 201) return `Expected 201, got ${r.status}`;
    const d = await r.json(); wallId = d.id;
    if (!wallId) return "Missing id"; return null;
  });
  // List walls
  await test("list walls", async () => {
    const r = await fetch(`${BASE}/api/walls`); const d = await r.json();
    if (!Array.isArray(d) || d.length < 1) return "Expected array with wall"; return null;
  });
  // Add testimonial
  await test("add testimonial", async () => {
    const r = await fetch(`${BASE}/api/walls/${wallId}/testimonials`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ author: "Jane", role: "CEO", company: "Acme", text: "Great product!", rating: 5 }) });
    if (r.status !== 201) return `Expected 201, got ${r.status}`; return null;
  });
  // Get wall with testimonials
  await test("get wall", async () => {
    const r = await fetch(`${BASE}/api/walls/${wallId}`); const d = await r.json();
    if (!d.testimonials || d.testimonials.length < 1) return "Missing testimonials"; return null;
  });
  // Reject invalid rating
  await test("reject invalid rating", async () => {
    const r = await fetch(`${BASE}/api/walls/${wallId}/testimonials`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ author: "X", text: "Y", rating: 10 }) });
    if (r.status !== 400) return `Expected 400, got ${r.status}`; return null;
  });
  // Reject missing wall
  await test("reject missing wall", async () => {
    const r = await fetch(`${BASE}/api/walls/nonexistent/testimonials`);
    if (r.status !== 404) return `Expected 404, got ${r.status}`; return null;
  });
  console.log(`\n${p}/${p + f} tests passed`); if (f > 0) process.exit(1);
} run();
