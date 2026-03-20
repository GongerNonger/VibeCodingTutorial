import { NextRequest, NextResponse } from "next/server";

interface WaitlistConfig {
  productName: string;
  tagline: string;
  description: string;
  features: string[];
  accentColor: string;
  style: "minimal" | "bold" | "gradient";
  ctaText: string;
  socialProof?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateBackground(style: string, accentColor: string): string {
  switch (style) {
    case "bold":
      return `background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);`;
    case "gradient":
      return `background: linear-gradient(135deg, #0a0a0a 0%, ${accentColor}22 30%, #0a0a0a 70%, ${accentColor}11 100%);`;
    case "minimal":
    default:
      return `background: #0a0a0a;`;
  }
}

function generateHTML(config: WaitlistConfig): string {
  const {
    productName,
    tagline,
    description,
    features,
    accentColor,
    style,
    ctaText,
    socialProof,
  } = config;

  const bg = generateBackground(style, accentColor);
  const escapedName = escapeHtml(productName);
  const escapedTagline = escapeHtml(tagline);
  const escapedDescription = escapeHtml(description);
  const escapedCta = escapeHtml(ctaText);

  const featuresHTML = features
    .filter((f) => f.trim())
    .map(
      (f) => `
        <div class="feature-card">
          <div class="feature-icon" style="color: ${accentColor};">&#10003;</div>
          <p>${escapeHtml(f)}</p>
        </div>`
    )
    .join("\n");

  const socialProofHTML = socialProof
    ? `<div class="social-proof">${escapeHtml(socialProof)}</div>`
    : "";

  const boldStyles =
    style === "bold"
      ? `
      .hero-title { font-size: 4rem; font-weight: 900; letter-spacing: -0.03em; }
      .hero-tagline { font-size: 1.5rem; font-weight: 600; }
      `
      : "";

  const gradientTitle =
    style === "gradient"
      ? `background: linear-gradient(90deg, #fff, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedName} - Join the Waitlist</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      ${bg}
      color: #e5e5e5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      max-width: 720px;
      width: 100%;
      padding: 4rem 1.5rem;
      text-align: center;
    }
    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1rem;
      line-height: 1.1;
      ${gradientTitle}
    }
    .hero-tagline {
      font-size: 1.25rem;
      color: #a3a3a3;
      margin-bottom: 1.5rem;
      font-weight: 400;
    }
    .hero-description {
      font-size: 1.1rem;
      color: #737373;
      margin-bottom: 2.5rem;
      line-height: 1.7;
    }
    .social-proof {
      display: inline-block;
      background: ${accentColor}18;
      border: 1px solid ${accentColor}44;
      color: ${accentColor};
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 2.5rem;
    }
    .email-form {
      display: flex;
      gap: 0.75rem;
      max-width: 480px;
      margin: 0 auto 3rem;
    }
    .email-input {
      flex: 1;
      padding: 0.875rem 1.25rem;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 0.75rem;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .email-input:focus {
      border-color: ${accentColor};
    }
    .email-input::placeholder { color: #555; }
    .submit-btn {
      padding: 0.875rem 2rem;
      background: ${accentColor};
      color: #000;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s;
      white-space: nowrap;
    }
    .submit-btn:hover { opacity: 0.85; }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .feature-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: left;
    }
    .feature-icon {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    .feature-card p {
      color: #a3a3a3;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .success-msg {
      display: none;
      color: ${accentColor};
      font-weight: 600;
      margin-top: 1rem;
    }
    ${boldStyles}
    @media (max-width: 600px) {
      .hero-title { font-size: 2rem; }
      .email-form { flex-direction: column; }
      .container { padding: 2rem 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${socialProofHTML}
    <h1 class="hero-title">${escapedName}</h1>
    <p class="hero-tagline">${escapedTagline}</p>
    <p class="hero-description">${escapedDescription}</p>
    <form class="email-form" onsubmit="handleSubmit(event)">
      <input type="email" class="email-input" placeholder="Enter your email" required>
      <button type="submit" class="submit-btn">${escapedCta}</button>
    </form>
    <p class="success-msg" id="successMsg">You're on the list! We'll be in touch soon.</p>
    ${
      features.length > 0
        ? `<div class="features-grid">${featuresHTML}</div>`
        : ""
    }
  </div>
  <script>
    function handleSubmit(e) {
      e.preventDefault();
      const email = e.target.querySelector('input').value;
      e.target.style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
    }
  </script>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      tagline,
      description,
      features,
      accentColor,
      style,
      ctaText,
      socialProof,
    } = body;

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }

    if (!tagline || typeof tagline !== "string" || !tagline.trim()) {
      return NextResponse.json(
        { error: "tagline is required" },
        { status: 400 }
      );
    }

    if (style && !["minimal", "bold", "gradient"].includes(style)) {
      return NextResponse.json(
        { error: "style must be minimal, bold, or gradient" },
        { status: 400 }
      );
    }

    const config: WaitlistConfig = {
      productName: productName.trim(),
      tagline: (tagline || "").trim(),
      description: (description || "").trim(),
      features: Array.isArray(features) ? features : [],
      accentColor: accentColor || "#f59e0b",
      style: style || "minimal",
      ctaText: (ctaText || "Join Waitlist").trim(),
      socialProof: socialProof ? socialProof.trim() : undefined,
    };

    const html = generateHTML(config);

    return NextResponse.json({ html });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
