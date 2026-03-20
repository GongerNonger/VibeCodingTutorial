import { NextRequest, NextResponse } from "next/server";
import { walls, testimonials, newId, type Testimonial } from "../../../store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!walls.has(id)) {
    return NextResponse.json({ error: "Wall not found" }, { status: 404 });
  }
  return NextResponse.json(testimonials.get(id) || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!walls.has(id)) {
    return NextResponse.json({ error: "Wall not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { author, role, company, text, rating, avatarUrl } = body;

    if (!author || typeof author !== "string" || !author.trim()) {
      return NextResponse.json({ error: "author is required" }, { status: 400 });
    }
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
    }

    const testimonial: Testimonial = {
      id: newId(),
      wallId: id,
      author: author.trim(),
      role: (role || "").trim(),
      company: (company || "").trim(),
      text: text.trim(),
      rating: r,
      avatarUrl: avatarUrl || undefined,
      createdAt: new Date().toISOString(),
    };

    const list = testimonials.get(id) || [];
    list.push(testimonial);
    testimonials.set(id, list);

    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
