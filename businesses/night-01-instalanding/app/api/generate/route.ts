import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS = {
  modern: `Use a clean, professional design with a gradient hero section, rounded cards, subtle shadows,
    and a blue-to-purple color palette. Use Inter or system fonts. Plenty of whitespace.`,
  bold: `Use a high-contrast design with large typography, bright accent colors (electric blue, neon green),
    dark backgrounds, and strong CTAs. Use bold headlines and dynamic layouts.`,
  minimal: `Use an ultra-clean design with lots of whitespace, black and white with one accent color,
    simple typography, thin borders, and understated elegance.`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, description, style } = body;

    if (!productName || !description) {
      return NextResponse.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    if (!["modern", "bold", "minimal"].includes(style)) {
      return NextResponse.json(
        { error: "Style must be modern, bold, or minimal" },
        { status: 400 }
      );
    }

    const stylePrompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS];

    const html = generateLandingPage(productName, description, stylePrompt, style);

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate landing page" },
      { status: 500 }
    );
  }
}

function generateLandingPage(
  name: string,
  description: string,
  _stylePrompt: string,
  style: string
): string {
  // Extract key points from description for feature sections
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const features = sentences.slice(0, 3).map((s, i) => ({
    title: `Feature ${i + 1}`,
    desc: s,
  }));

  // Fallback features if description is too short
  while (features.length < 3) {
    features.push({
      title: `Benefit ${features.length + 1}`,
      desc: description,
    });
  }

  const colors = {
    modern: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      accent: "#667eea",
      text: "#1a202c",
      light: "#f7fafc",
    },
    bold: {
      bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      accent: "#00d4ff",
      text: "#ffffff",
      light: "#1a1a2e",
    },
    minimal: {
      bg: "#ffffff",
      accent: "#000000",
      text: "#111111",
      light: "#fafafa",
    },
  };

  const c = colors[style as keyof typeof colors] || colors.modern;
  const isMinimal = style === "minimal";
  const isDark = style === "bold";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} - Landing Page</title>
  <meta name="description" content="${escapeHtml(description.slice(0, 160))}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: ${c.text};
      line-height: 1.6;
    }
    .hero {
      background: ${c.bg};
      ${!isMinimal ? `color: white;` : `border-bottom: 1px solid #eee;`}
      padding: 100px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      margin-bottom: 20px;
      ${isDark ? `text-shadow: 0 0 30px rgba(0,212,255,0.3);` : ""}
    }
    .hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto 30px;
      opacity: 0.9;
    }
    .cta-btn {
      display: inline-block;
      padding: 16px 40px;
      background: ${isMinimal ? c.accent : "white"};
      color: ${isMinimal ? "white" : c.accent};
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: ${isMinimal ? "0" : "8px"};
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      ${!isMinimal ? `box-shadow: 0 4px 15px rgba(0,0,0,0.2);` : `border: 2px solid ${c.accent};`}
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      ${!isMinimal ? `box-shadow: 0 6px 20px rgba(0,0,0,0.3);` : ""}
    }
    .features {
      padding: 80px 20px;
      background: ${c.light};
    }
    .features-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }
    .feature-card {
      background: white;
      padding: 30px;
      border-radius: ${isMinimal ? "0" : "12px"};
      ${isMinimal ? `border: 1px solid #eee;` : `box-shadow: 0 2px 10px rgba(0,0,0,0.08);`}
    }
    .feature-card h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: ${isDark ? c.light : c.text};
    }
    .feature-card p {
      color: #666;
      font-size: 0.95rem;
    }
    .cta-section {
      padding: 80px 20px;
      text-align: center;
      ${isDark ? `background: ${c.light}; color: white;` : ""}
    }
    .cta-section h2 {
      font-size: 2rem;
      margin-bottom: 15px;
    }
    .cta-section p {
      color: #666;
      margin-bottom: 30px;
      ${isDark ? `color: #aaa;` : ""}
    }
    footer {
      padding: 30px 20px;
      text-align: center;
      color: #999;
      font-size: 0.85rem;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <section class="hero">
    <h1>${escapeHtml(name)}</h1>
    <p>${escapeHtml(description.slice(0, 200))}</p>
    <a href="#get-started" class="cta-btn">Get Started</a>
  </section>

  <section class="features">
    <div class="features-grid">
      ${features
        .map(
          (f) => `
      <div class="feature-card">
        <h3>${escapeHtml(f.title)}</h3>
        <p>${escapeHtml(f.desc)}</p>
      </div>`
        )
        .join("")}
    </div>
  </section>

  <section class="cta-section" id="get-started">
    <h2>Ready to get started?</h2>
    <p>Join thousands of users already using ${escapeHtml(name)}.</p>
    <a href="#" class="cta-btn" style="background:${c.accent}; color:white;">
      Start Free Trial
    </a>
  </section>

  <footer>
    &copy; ${new Date().getFullYear()} ${escapeHtml(name)}. All rights reserved.
  </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
