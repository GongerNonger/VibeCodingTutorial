import { NextResponse } from "next/server";
import { walls, testimonials } from "../../store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wall = walls.get(id);
  if (!wall) {
    return NextResponse.json({ error: "Wall not found" }, { status: 404 });
  }
  return NextResponse.json({ ...wall, testimonials: testimonials.get(id) || [] });
}
