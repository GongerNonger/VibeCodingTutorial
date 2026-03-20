import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  senderProduct: string;
  senderDescription: string;
  targetCompany: string;
  targetRole: string;
  tone: "professional" | "casual" | "direct";
  emailCount: number;
}

interface Email {
  subject: string;
  body: string;
  purpose: string;
}

const OPENERS: Record<string, string[]> = {
  professional: [
    "I hope this message finds you well.",
    "I came across {company} and was impressed by what your team is building.",
    "I've been following {company}'s growth and wanted to reach out.",
  ],
  casual: [
    "Hey {firstName} — quick one for you.",
    "Hi {firstName}! Saw what {company} is doing and had to reach out.",
    "Hey {firstName}, I'll keep this short.",
  ],
  direct: [
    "{firstName}, I have an idea that could help {company}.",
    "I'll get straight to the point.",
    "Quick question for you, {firstName}.",
  ],
};

const FOLLOW_UP_ANGLES = [
  { label: "Pain point", key: "pain" },
  { label: "Social proof", key: "proof" },
  { label: "Value add", key: "value" },
  { label: "Breakup", key: "breakup" },
];

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { senderProduct, senderDescription, targetCompany, targetRole, tone, emailCount } = body;

    if (!senderProduct || !senderDescription || !targetCompany || !targetRole) {
      return NextResponse.json(
        { error: "All fields are required: senderProduct, senderDescription, targetCompany, targetRole" },
        { status: 400 }
      );
    }

    if (!["professional", "casual", "direct"].includes(tone)) {
      return NextResponse.json(
        { error: "Tone must be professional, casual, or direct" },
        { status: 400 }
      );
    }

    const count = Math.min(Math.max(emailCount || 1, 1), 5);
    const emails = generateSequence(senderProduct, senderDescription, targetCompany, targetRole, tone, count);

    return NextResponse.json({ emails, meta: { count: emails.length, tone, targetCompany, targetRole } });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate email sequence" },
      { status: 500 }
    );
  }
}

function generateSequence(
  product: string,
  description: string,
  company: string,
  role: string,
  tone: "professional" | "casual" | "direct",
  count: number
): Email[] {
  const firstName = extractFirstName(role);
  const benefits = extractBenefits(description);
  const emails: Email[] = [];

  // Email 1: Initial outreach
  emails.push(generateInitialEmail(product, description, company, role, firstName, tone, benefits));

  // Follow-up emails
  for (let i = 1; i < count; i++) {
    const angle = FOLLOW_UP_ANGLES[(i - 1) % FOLLOW_UP_ANGLES.length];
    emails.push(generateFollowUp(product, company, firstName, tone, benefits, angle, i));
  }

  return emails;
}

function generateInitialEmail(
  product: string,
  description: string,
  company: string,
  role: string,
  firstName: string,
  tone: "professional" | "casual" | "direct",
  benefits: string[]
): Email {
  const opener = pickRandom(OPENERS[tone]).replace(/{company}/g, company).replace(/{firstName}/g, firstName);
  const benefit = benefits[0] || "save time and boost results";

  const subjects: Record<string, string[]> = {
    professional: [
      `Quick idea for ${company}`,
      `${product} + ${company} — a thought`,
      `Helping ${company} ${benefit}`,
    ],
    casual: [
      `${firstName}, thought of ${company} when I saw this`,
      `This might help ${company}`,
      `Quick idea for you, ${firstName}`,
    ],
    direct: [
      `${benefit} for ${company}`,
      `${firstName} — ${product} for ${company}`,
      `Can ${company} ${benefit}?`,
    ],
  };

  const signoff = tone === "casual" ? "Cheers" : tone === "direct" ? "Best" : "Kind regards";

  const body = `${opener}

${getConnectionSentence(product, company, role, tone)}

${description.slice(0, 200)}${description.length > 200 ? "..." : ""}

${getBenefitPitch(benefits, company, tone)}

${getCTA(tone, firstName)}

${signoff},
[Your Name]
[Your Title] at ${product}`;

  return {
    subject: pickRandom(subjects[tone]),
    body,
    purpose: "Initial outreach — introduce yourself and your value proposition",
  };
}

function generateFollowUp(
  product: string,
  company: string,
  firstName: string,
  tone: "professional" | "casual" | "direct",
  benefits: string[],
  angle: { label: string; key: string },
  index: number
): Email {
  const dayLabel = index === 1 ? "3 days" : index === 2 ? "1 week" : index === 3 ? "2 weeks" : "3 weeks";
  const signoff = tone === "casual" ? "Cheers" : tone === "direct" ? "Best" : "Kind regards";
  let subject: string;
  let body: string;
  let purpose: string;

  switch (angle.key) {
    case "pain":
      subject = tone === "casual" ? `Re: Quick idea for ${company}` : `Following up — ${company}`;
      body = `Hi ${firstName},

I wanted to follow up on my previous email.

${getPainPoint(company, benefits, tone)}

${product} was built specifically to solve this. ${benefits[1] ? `Teams using it ${benefits[1]}.` : ""}

Would a quick 15-minute call make sense this week?

${signoff},
[Your Name]`;
      purpose = `Follow-up #${index} (${dayLabel} later) — Address a pain point`;
      break;

    case "proof":
      subject = `How [Similar Company] solved this with ${product}`;
      body = `Hi ${firstName},

Wanted to share a quick example.

A company similar to ${company} was struggling with the same challenges your team likely faces as a ${extractTeamType(company)}.

After implementing ${product}, they saw meaningful improvements — ${benefits[0] || "faster workflows and better results"}.

I'd love to show you how this could work for ${company} specifically.

Open to a brief chat?

${signoff},
[Your Name]`;
      purpose = `Follow-up #${index} (${dayLabel} later) — Social proof angle`;
      break;

    case "value":
      subject = tone === "direct" ? `Free resource for ${company}` : `Thought this might help, ${firstName}`;
      body = `Hi ${firstName},

No pitch this time — just wanted to share something useful.

I put together a quick guide on how teams like ${company} can ${benefits[0] || "improve their workflow"} — even without using ${product}.

Would you like me to send it over? Happy to share regardless.

${signoff},
[Your Name]`;
      purpose = `Follow-up #${index} (${dayLabel} later) — Value-add / give first`;
      break;

    case "breakup":
    default:
      subject = tone === "casual" ? `Last one, ${firstName}` : `Closing the loop — ${company}`;
      body = `Hi ${firstName},

I've reached out a few times and haven't heard back — totally understand you're busy.

I'll assume the timing isn't right and won't send any more emails. But if ${company} ever needs help with ${benefits[0] || "this"}, my door is always open.

Wishing you and the ${company} team all the best.

${signoff},
[Your Name]`;
      purpose = `Follow-up #${index} (${dayLabel} later) — Breakup email (last touch)`;
      break;
  }

  return { subject, body, purpose };
}

function extractFirstName(role: string): string {
  // If role looks like "John, VP of Sales" or "John Smith, CEO"
  const commaMatch = role.match(/^(\w+)/);
  if (commaMatch && commaMatch[1].length > 1 && commaMatch[1][0] === commaMatch[1][0].toUpperCase()) {
    // Check if it's a name (not a title like "VP" or "Head")
    const word = commaMatch[1];
    const titleWords = ["VP", "Head", "Chief", "Director", "Manager", "CEO", "CTO", "COO", "CFO", "CMO", "Senior", "Lead", "Principal"];
    if (!titleWords.includes(word)) {
      return word;
    }
  }
  return "there";
}

function extractBenefits(description: string): string[] {
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  return sentences.map((s) => s.charAt(0).toLowerCase() + s.slice(1));
}

function getConnectionSentence(product: string, company: string, role: string, tone: string): string {
  if (tone === "casual") {
    return `I'm building ${product} and immediately thought of ${company} when thinking about who'd benefit most.`;
  }
  if (tone === "direct") {
    return `I believe ${product} can directly help ${company}'s ${role.includes(",") ? role.split(",").pop()?.trim() || "team" : "team"}.`;
  }
  return `I'm reaching out because I believe there's a strong alignment between what ${product} offers and ${company}'s goals.`;
}

function getBenefitPitch(benefits: string[], company: string, tone: string): string {
  const top = benefits.slice(0, 2);
  if (top.length === 0) return `I think this could be a great fit for ${company}.`;

  if (tone === "casual") {
    return `The big win: ${top[0]}${top[1] ? `. Plus, ${top[1]}` : ""}.`;
  }
  if (tone === "direct") {
    return `Here's what matters:\n→ ${top.join("\n→ ")}`;
  }
  return `Specifically, I think ${company} could benefit from:\n• ${top.map((b) => b.charAt(0).toUpperCase() + b.slice(1)).join("\n• ")}`;
}

function getCTA(tone: string, firstName: string): string {
  if (tone === "casual") {
    return `Got 15 minutes this week for a quick chat, ${firstName}?`;
  }
  if (tone === "direct") {
    return "Worth a 15-minute call? I'm free this week.";
  }
  return `Would you be open to a brief 15-minute conversation this week to explore whether this could be valuable for ${firstName !== "there" ? "your team" : "you"}?`;
}

function getPainPoint(company: string, benefits: string[], tone: string): string {
  const benefit = benefits[0] || "streamline operations";
  if (tone === "casual") {
    return `I keep hearing from teams like ${company} that they struggle to ${benefit}. Sound familiar?`;
  }
  if (tone === "direct") {
    return `Most companies in your space waste hours trying to ${benefit}. ${company} doesn't have to.`;
  }
  return `Many organizations similar to ${company} face challenges when it comes to ${benefit}. It's a common pain point that often goes unaddressed.`;
}

function extractTeamType(company: string): string {
  return `growing company like ${company}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
