import { createNewsletter, listNewsletters } from "../store";

export async function GET() {
  const newsletters = listNewsletters();
  return Response.json(newsletters);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, niche, tone } = body;

  if (!name || !niche || !tone) {
    return Response.json(
      { error: "name, niche, and tone are required" },
      { status: 400 }
    );
  }

  if (!["casual", "professional", "witty"].includes(tone)) {
    return Response.json(
      { error: "tone must be casual, professional, or witty" },
      { status: 400 }
    );
  }

  const newsletter = createNewsletter(name, niche, tone);
  return Response.json(newsletter, { status: 201 });
}
