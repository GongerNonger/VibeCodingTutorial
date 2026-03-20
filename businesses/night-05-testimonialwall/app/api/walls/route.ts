import { NextRequest, NextResponse } from "next/server";
import { walls, testimonials, newId, type Wall } from "../store";

export async function GET() {
  return NextResponse.json(Array.from(walls.values()));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const wall: Wall = {
      id: newId(),
      name: name.trim(),
      description: (description || "").trim(),
      createdAt: new Date().toISOString(),
    };

    walls.set(wall.id, wall);
    testimonials.set(wall.id, []);

    return NextResponse.json(wall, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
