import { NextRequest, NextResponse } from "next/server";
import { getMenu, updateMenu } from "../../store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const menu = getMenu(params.id);
  if (!menu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }
  return NextResponse.json(menu);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const menu = updateMenu(params.id, body);
    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
