import { NextRequest, NextResponse } from "next/server";

interface Tier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

interface RequestBody {
  productName: string;
  tiers: Tier[];
  accentColor: string;
  style: "minimal" | "cards" | "gradient";
}

function validate(body: RequestBody): string | null {
  if (!body.productName || typeof body.productName !== "string" || !body.productName.trim()) {
    return "productName is required.";
  }
  if (!Array.isArray(body.tiers) || body.tiers.length < 1 || body.tiers.length > 4) {
    return "Between 1 and 4 tiers are required.";
  }
  for (let i = 0; i < body.tiers.length; i++) {
    const t = body.tiers[i];
    if (!t.name || typeof t.name !== "string" || !t.name.trim()) {
      return `Tier ${i + 1}: name is required.`;
    }
    if (!t.price || typeof t.price !== "string" || !t.price.trim()) {
      return `Tier ${i + 1}: price is required.`;
    }
  }
  if (!["minimal", "cards", "gradient"].includes(body.style)) {
    return "style must be one of: minimal, cards, gradient.";
  }
  return null;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateHTML(body: RequestBody): string {
  const { productName, tiers, accentColor, style } = body;
  const accent = accentColor || "#8b5cf6";

  const sharedReset = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 60px 20px; }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center; }
    .subtitle { color: #94a3b8; font-size: 1.125rem; margin-bottom: 3rem; text-align: center; }
    .grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; max-width: 1200px; width: 100%; }
    .tier { flex: 1 1 260px; max-width: 300px; padding: 32px 28px; border-radius: 16px; display: flex; flex-direction: column; }
    .tier h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; }
    .price { font-size: 2.5rem; font-weight: 800; margin-bottom: 4px; }
    .period { font-size: 0.875rem; color: #94a3b8; margin-bottom: 24px; }
    .features { list-style: none; flex: 1; margin-bottom: 24px; }
    .features li { padding: 6px 0; font-size: 0.95rem; color: #cbd5e1; display: flex; align-items: center; gap: 8px; }
    .features li::before { content: "\\2713"; color: ${accent}; font-weight: 700; }
    .cta { display: block; text-align: center; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: opacity 0.2s; border: none; }
    .cta:hover { opacity: 0.85; }
  `;

  let styleCSS = "";
  if (style === "minimal") {
    styleCSS = `
      .tier { background: transparent; border: 1px solid #1e293b; }
      .tier.highlighted { border-color: ${accent}; }
      .cta { background: transparent; border: 2px solid ${accent}; color: ${accent}; }
      .tier.highlighted .cta { background: ${accent}; color: #fff; border-color: ${accent}; }
    `;
  } else if (style === "cards") {
    styleCSS = `
      .tier { background: #111827; border: 1px solid #1f2937; box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
      .tier.highlighted { border-color: ${accent}; box-shadow: 0 4px 32px ${accent}33; position: relative; }
      .tier.highlighted::before { content: "Popular"; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: ${accent}; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
      .cta { background: #1f2937; color: #e2e8f0; }
      .tier.highlighted .cta { background: ${accent}; color: #fff; }
    `;
  } else {
    styleCSS = `
      .tier { background: linear-gradient(135deg, #111827 0%, #0f172a 100%); border: 1px solid #1e293b; }
      .tier.highlighted { background: linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%); border-color: ${accent}66; }
      .cta { background: linear-gradient(135deg, ${accent}cc, ${accent}); color: #fff; }
      .tier:not(.highlighted) .cta { background: linear-gradient(135deg, #334155, #1e293b); color: #e2e8f0; }
    `;
  }

  const tierCards = tiers.map((t) => {
    const cls = t.highlighted ? "tier highlighted" : "tier";
    const featureItems = (t.features || [])
      .filter((f) => f.trim())
      .map((f) => `        <li>${esc(f)}</li>`)
      .join("\n");
    return `    <div class="${cls}">
      <h2>${esc(t.name)}</h2>
      <div class="price">${esc(t.price)}</div>
      <div class="period">${esc(t.period || "per month")}</div>
      <ul class="features">
${featureItems}
      </ul>
      <button class="cta">Get Started</button>
    </div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(productName)} - Pricing</title>
  <style>
    ${sharedReset}
    ${styleCSS}
  </style>
</head>
<body>
  <h1>${esc(productName)}</h1>
  <p class="subtitle">Choose the plan that works best for you</p>
  <div class="grid">
${tierCards}
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const error = validate(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    const html = generateHTML(body);
    return NextResponse.json({ html });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
