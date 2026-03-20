import { NextRequest, NextResponse } from "next/server";
import { getAllMenus, createMenu } from "../store";

export async function GET() {
  const menus = getAllMenus();
  return NextResponse.json(menus);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.restaurantName || !body.categories) {
      return NextResponse.json({ error: "Missing required fields: restaurantName, categories" }, { status: 400 });
    }
    const menu = createMenu({
      restaurantName: body.restaurantName,
      description: body.description || "",
      theme: body.theme || "modern",
      currency: body.currency || "USD",
      categories: body.categories || [],
    });
    return NextResponse.json(menu, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
