import { NextRequest, NextResponse } from "next/server";

const STYLE_CONFIGS = {
  modern: {
    hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#667eea",
    accentHover: "#5a6fd6",
    text: "#1a202c",
    muted: "#64748b",
    light: "#f8fafc",
    card: "#ffffff",
    border: "#e2e8f0",
    radius: "12px",
    btnRadius: "8px",
    shadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    heroText: "#ffffff",
    font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bold: {
    hero: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accent: "#00d4ff",
    accentHover: "#00b8e6",
    text: "#ffffff",
    muted: "#94a3b8",
    light: "#0f172a",
    card: "#1e293b",
    border: "#334155",
    radius: "16px",
    btnRadius: "12px",
    shadow: "0 0 30px rgba(0,212,255,0.15)",
    heroText: "#ffffff",
    font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  minimal: {
    hero: "#ffffff",
    accent: "#111111",
    accentHover: "#333333",
    text: "#111111",
    muted: "#6b7280",
    light: "#fafafa",
    card: "#ffffff",
    border: "#e5e5e5",
    radius: "0px",
    btnRadius: "0px",
    shadow: "none",
    heroText: "#111111",
    font: "'Georgia', 'Times New Roman', serif",
  },
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

    const html = generateLandingPage(productName, description, style);

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate landing page" },
      { status: 500 }
    );
  }
}

function extractFeatures(description: string): { title: string; desc: string; icon: string }[] {
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const icons = ["⚡", "🎯", "🔒", "📈", "🚀", "💡"];
  const titlePatterns = [
    { match: /fast|quick|speed|instant|rapid/i, title: "Lightning Fast" },
    { match: /easy|simple|intuitive|effortless/i, title: "Dead Simple" },
    { match: /secur|safe|protect|privacy/i, title: "Secure by Default" },
    { match: /grow|scale|expand|increase/i, title: "Built to Scale" },
    { match: /automat|smart|ai|intellig/i, title: "Smart Automation" },
    { match: /team|collaborat|together|share/i, title: "Team Friendly" },
    { match: /analyt|track|measure|insight/i, title: "Deep Insights" },
    { match: /integrat|connect|sync|api/i, title: "Seamless Integration" },
    { match: /custom|personal|tailor|config/i, title: "Fully Customizable" },
    { match: /save|cost|afford|free/i, title: "Cost Effective" },
    { match: /reliable|uptime|stable|trust/i, title: "Rock Solid" },
    { match: /support|help|service|care/i, title: "World-Class Support" },
  ];

  return sentences.slice(0, 3).map((s, i) => {
    const matched = titlePatterns.find((p) => p.match.test(s));
    return {
      title: matched?.title || generateTitle(s),
      desc: s.charAt(0).toUpperCase() + s.slice(1),
      icon: icons[i % icons.length],
    };
  });
}

function generateTitle(sentence: string): string {
  const words = sentence.split(/\s+/).filter((w) => w.length > 3);
  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return "Key Benefit";
}

function generateLandingPage(
  name: string,
  description: string,
  style: string
): string {
  const c = STYLE_CONFIGS[style as keyof typeof STYLE_CONFIGS] || STYLE_CONFIGS.modern;
  const isDark = style === "bold";
  const isMinimal = style === "minimal";

  const features = extractFeatures(description);
  while (features.length < 3) {
    features.push({
      title: ["Easy Setup", "Always On", "Loved by Users"][features.length] || "Key Benefit",
      desc: description.slice(0, 100),
      icon: ["🔧", "🌐", "❤️"][features.length] || "✨",
    });
  }

  const tagline = description.length > 120
    ? description.slice(0, 120).replace(/\s+\S*$/, "") + "."
    : description;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(name)} - ${esc(tagline.slice(0, 60))}</title>
  <meta name="description" content="${esc(description.slice(0, 160))}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${c.font};
      color: ${c.text};
      line-height: 1.6;
      ${isDark ? `background: #0f172a;` : `background: #fff;`}
    }

    /* Nav */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 16px 24px;
      background: ${isDark ? "rgba(15,23,42,0.9)" : isMinimal ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.95)"};
      backdrop-filter: blur(12px);
      border-bottom: 1px solid ${c.border};
      display: flex; align-items: center; justify-content: space-between;
      max-width: 100%;
    }
    .nav-brand {
      font-size: 1.25rem; font-weight: 700;
      color: ${isDark ? "#fff" : c.text};
      text-decoration: none;
    }
    .nav-brand span { color: ${c.accent}; }
    .nav-cta {
      padding: 8px 20px;
      background: ${c.accent}; color: #fff;
      border-radius: ${c.btnRadius};
      text-decoration: none; font-weight: 600; font-size: 0.9rem;
      transition: background 0.2s;
    }
    .nav-cta:hover { background: ${c.accentHover}; }

    /* Hero */
    .hero {
      padding: 140px 24px 100px;
      text-align: center;
      background: ${c.hero};
      color: ${c.heroText};
      ${isDark ? `position: relative; overflow: hidden;` : ""}
    }
    ${isDark ? `.hero::before {
      content: ''; position: absolute; top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(0,212,255,0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 50%, rgba(118,75,162,0.08) 0%, transparent 50%);
      animation: drift 20s linear infinite;
    }
    @keyframes drift { to { transform: rotate(360deg); } }` : ""}
    .hero-inner { position: relative; max-width: 800px; margin: 0 auto; }
    .hero-badge {
      display: inline-block;
      padding: 6px 16px;
      background: ${isDark ? "rgba(0,212,255,0.1)" : isMinimal ? "#f5f5f5" : "rgba(255,255,255,0.2)"};
      border: 1px solid ${isDark ? "rgba(0,212,255,0.2)" : isMinimal ? "#ddd" : "rgba(255,255,255,0.3)"};
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 24px;
      color: ${isDark ? c.accent : isMinimal ? c.muted : "rgba(255,255,255,0.9)"};
    }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    .hero-highlight { color: ${isDark ? c.accent : isMinimal ? c.accent : "rgba(255,255,255,0.9)"}; ${isMinimal ? `text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 4px;` : ""} }
    .hero p {
      font-size: 1.2rem;
      max-width: 560px;
      margin: 0 auto 40px;
      opacity: 0.85;
      line-height: 1.7;
    }
    .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 16px 36px;
      background: ${isMinimal ? c.accent : "#fff"};
      color: ${isMinimal ? "#fff" : c.accent};
      font-size: 1.05rem; font-weight: 600;
      border-radius: ${c.btnRadius};
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      ${!isMinimal ? `box-shadow: 0 4px 14px rgba(0,0,0,0.15);` : `border: 2px solid ${c.accent};`}
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 16px 36px;
      background: transparent;
      color: ${isMinimal ? c.muted : "rgba(255,255,255,0.9)"};
      font-size: 1.05rem; font-weight: 500;
      border-radius: ${c.btnRadius};
      text-decoration: none;
      border: 1px solid ${isMinimal ? c.border : "rgba(255,255,255,0.3)"};
      transition: background 0.2s, border-color 0.2s;
    }
    .btn-secondary:hover { background: ${isMinimal ? "#f5f5f5" : "rgba(255,255,255,0.1)"}; }

    /* Social Proof */
    .social-proof {
      padding: 40px 24px;
      text-align: center;
      border-bottom: 1px solid ${c.border};
      ${isDark ? `background: #0f172a;` : `background: ${c.light};`}
    }
    .social-proof p {
      font-size: 0.9rem;
      color: ${c.muted};
      margin-bottom: 8px;
    }
    .social-proof .stars { font-size: 1.4rem; letter-spacing: 4px; }

    /* Features */
    .features {
      padding: 100px 24px;
      ${isDark ? `background: #0f172a;` : `background: #fff;`}
    }
    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 60px;
    }
    .section-header h2 {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 16px;
      color: ${isDark ? "#fff" : c.text};
    }
    .section-header p {
      font-size: 1.1rem;
      color: ${c.muted};
    }
    .features-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .feature-card {
      background: ${c.card};
      padding: 32px;
      border-radius: ${c.radius};
      border: 1px solid ${c.border};
      ${c.shadow !== "none" ? `box-shadow: ${c.shadow};` : ""}
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }
    .feature-icon {
      font-size: 2rem;
      margin-bottom: 16px;
      ${isDark ? `filter: grayscale(0);` : ""}
    }
    .feature-card h3 {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${isDark ? "#fff" : c.text};
    }
    .feature-card p {
      color: ${c.muted};
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* How It Works */
    .how-it-works {
      padding: 100px 24px;
      background: ${c.light};
      ${isDark ? `background: #1e293b;` : ""}
    }
    .steps {
      max-width: 700px;
      margin: 0 auto;
      display: flex; flex-direction: column; gap: 40px;
    }
    .step {
      display: flex; gap: 24px; align-items: flex-start;
    }
    .step-num {
      flex-shrink: 0;
      width: 48px; height: 48px;
      border-radius: 50%;
      background: ${c.accent};
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem;
    }
    .step h3 {
      font-size: 1.1rem; font-weight: 600;
      margin-bottom: 4px;
      color: ${isDark ? "#fff" : c.text};
    }
    .step p { color: ${c.muted}; font-size: 0.95rem; }

    /* CTA */
    .cta-section {
      padding: 100px 24px;
      text-align: center;
      ${isDark ? `background: #0f172a;` : `background: #fff;`}
    }
    .cta-section h2 {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 16px;
      color: ${isDark ? "#fff" : c.text};
    }
    .cta-section p {
      color: ${c.muted};
      font-size: 1.1rem;
      margin-bottom: 36px;
      max-width: 500px;
      margin-left: auto; margin-right: auto;
    }
    .cta-btn-big {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 18px 48px;
      background: ${c.accent};
      color: #fff;
      font-size: 1.15rem; font-weight: 700;
      border-radius: ${c.btnRadius};
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 14px ${isDark ? "rgba(0,212,255,0.3)" : "rgba(102,126,234,0.4)"};
    }
    .cta-btn-big:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px ${isDark ? "rgba(0,212,255,0.4)" : "rgba(102,126,234,0.5)"};
    }

    /* Footer */
    footer {
      padding: 40px 24px;
      text-align: center;
      border-top: 1px solid ${c.border};
      ${isDark ? `background: #0f172a;` : ""}
    }
    footer p { color: ${c.muted}; font-size: 0.85rem; }

    /* Responsive */
    @media (max-width: 640px) {
      .hero { padding: 120px 20px 80px; }
      .hero-actions { flex-direction: column; align-items: center; }
      .step { flex-direction: column; gap: 12px; }
    }
  </style>
</head>
<body>

  <nav class="nav">
    <a href="#" class="nav-brand"><span>${esc(name.split(" ")[0])}</span>${esc(name.split(" ").slice(1).join(" "))}</a>
    <a href="#get-started" class="nav-cta">Get Started →</a>
  </nav>

  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">✨ Now available</div>
      <h1>${esc(name)}<br><span class="hero-highlight">for everyone</span></h1>
      <p>${esc(tagline)}</p>
      <div class="hero-actions">
        <a href="#get-started" class="btn-primary">Get Started Free →</a>
        <a href="#features" class="btn-secondary">See Features</a>
      </div>
    </div>
  </section>

  <section class="social-proof">
    <div class="stars">★★★★★</div>
    <p>Trusted by teams everywhere</p>
  </section>

  <section class="features" id="features">
    <div class="section-header">
      <h2>Everything you need</h2>
      <p>Powerful features to help you get more done with less effort.</p>
    </div>
    <div class="features-grid">
      ${features
        .map(
          (f) => `<div class="feature-card">
        <div class="feature-icon">${f.icon}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </section>

  <section class="how-it-works">
    <div class="section-header">
      <h2>How it works</h2>
      <p>Get started in three simple steps.</p>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div>
          <h3>Sign up for free</h3>
          <p>Create your account in seconds. No credit card required.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div>
          <h3>Set up your workspace</h3>
          <p>Configure ${esc(name)} to match your workflow and preferences.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div>
          <h3>Start seeing results</h3>
          <p>Watch your productivity soar from day one.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section" id="get-started">
    <h2>Ready to get started?</h2>
    <p>Join thousands who already use ${esc(name)} to work smarter, not harder.</p>
    <a href="#" class="cta-btn-big">Start Free Trial →</a>
  </section>

  <footer>
    <p>© ${new Date().getFullYear()} ${esc(name)}. All rights reserved.</p>
  </footer>

</body>
</html>`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
