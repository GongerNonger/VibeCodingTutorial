export interface Newsletter {
  id: string;
  name: string;
  niche: string;
  tone: "casual" | "professional" | "witty";
  createdAt: string;
}

export interface Edition {
  id: string;
  newsletterId: string;
  topics: string[];
  html: string;
  createdAt: string;
}

const newsletters: Newsletter[] = [];
const editions: Edition[] = [];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// --- Newsletter CRUD ---

export function createNewsletter(
  name: string,
  niche: string,
  tone: "casual" | "professional" | "witty"
): Newsletter {
  const newsletter: Newsletter = {
    id: generateId(),
    name,
    niche,
    tone,
    createdAt: new Date().toISOString(),
  };
  newsletters.push(newsletter);
  return newsletter;
}

export function listNewsletters(): Newsletter[] {
  return [...newsletters];
}

export function getNewsletter(id: string): Newsletter | undefined {
  return newsletters.find((n) => n.id === id);
}

export function getEditionsForNewsletter(newsletterId: string): Edition[] {
  return editions.filter((e) => e.newsletterId === newsletterId);
}

// --- Edition Generation ---

function generateGreeting(tone: "casual" | "professional" | "witty"): string {
  switch (tone) {
    case "casual":
      return "Hey there! 👋";
    case "professional":
      return "Dear Reader,";
    case "witty":
      return "Well, well, well... look who opened their email!";
  }
}

function generateSignOff(
  tone: "casual" | "professional" | "witty",
  name: string
): string {
  switch (tone) {
    case "casual":
      return `Catch you next time! ✌️<br/>— The ${name} Team`;
    case "professional":
      return `Best regards,<br/>The ${name} Editorial Team`;
    case "witty":
      return `Until next time, keep being awesome (or at least pretend to be).<br/>— Your friends at ${name}`;
  }
}

function generateTopicSection(
  topic: string,
  tone: "casual" | "professional" | "witty",
  index: number
): string {
  const summaries: Record<string, string[]> = {
    casual: [
      `So here's the deal with <strong>${topic}</strong> — it's been blowing up lately and everyone's talking about it. We dug into the details so you don't have to.`,
      `You've probably seen <strong>${topic}</strong> all over your feed this week. Here's what actually matters and why you should care.`,
      `Let's talk about <strong>${topic}</strong>. It's kind of a big deal right now, and here's the scoop.`,
    ],
    professional: [
      `<strong>${topic}</strong> has emerged as a significant development this week. Industry analysts suggest this could reshape how professionals approach their work in the coming months.`,
      `This week's coverage of <strong>${topic}</strong> highlights several key implications for stakeholders. Here is our analysis of the most impactful developments.`,
      `Our editorial team has identified <strong>${topic}</strong> as a critical area of focus. The following insights summarize the current landscape and projected trajectory.`,
    ],
    witty: [
      `Ah, <strong>${topic}</strong> — the thing everyone suddenly has an opinion about. Let us separate the hot takes from the actual facts.`,
      `<strong>${topic}</strong> walked into the news cycle this week like it owned the place. Spoiler: it kind of does. Here's why.`,
      `Plot twist: <strong>${topic}</strong> is actually important this week. We know, we're as surprised as you are. Here's the breakdown.`,
    ],
  };

  const options = summaries[tone];
  const text = options[index % options.length];

  return `
    <tr>
      <td style="padding: 20px 30px;">
        <h2 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 20px;">${topic}</h2>
        <p style="color: #d1d5db; line-height: 1.7; margin: 0;">${text}</p>
        <p style="color: #9ca3af; font-size: 13px; margin: 10px 0 0 0; font-style: italic;">Key takeaway: Stay informed and watch this space for further developments.</p>
      </td>
    </tr>
    <tr><td style="padding: 0 30px;"><hr style="border: none; border-top: 1px solid #374151;" /></td></tr>`;
}

export function generateEdition(
  newsletterId: string,
  topics: string[]
): Edition | null {
  const newsletter = getNewsletter(newsletterId);
  if (!newsletter) return null;

  const { tone, name, niche } = newsletter;
  const greeting = generateGreeting(tone);
  const signOff = generateSignOff(tone, name);

  const topicSections = topics
    .map((t, i) => generateTopicSection(t, tone, i))
    .join("");

  const ctaText =
    tone === "casual"
      ? "Share this with a friend!"
      : tone === "professional"
        ? "Forward to a colleague"
        : "Spread the word (we dare you)";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030712; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111827; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed, #8b5cf6); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${name}</h1>
              <p style="color: #e0d4fd; margin: 8px 0 0 0; font-size: 14px;">Your ${niche} newsletter</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px 30px 10px;">
              <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0;">${greeting}</p>
              <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin: 10px 0 0 0;">Here's what's happening in <strong style="color: #c4b5fd;">${niche}</strong> this week — ${topics.length} topic${topics.length !== 1 ? "s" : ""} you need to know about.</p>
            </td>
          </tr>
          <tr><td style="padding: 0 30px;"><hr style="border: none; border-top: 1px solid #374151;" /></td></tr>
          ${topicSections}
          <tr>
            <td style="padding: 25px 30px; text-align: center;">
              <a href="#" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600;">${ctaText}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0;">${signOff}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const edition: Edition = {
    id: generateId(),
    newsletterId,
    topics,
    html,
    createdAt: new Date().toISOString(),
  };
  editions.push(edition);
  return edition;
}

// --- Pre-seed data ---

const seed = createNewsletter("Tech Pulse Weekly", "tech", "professional");
generateEdition(seed.id, [
  "AI Code Assistants",
  "Edge Computing Trends",
  "Open Source Sustainability",
]);
