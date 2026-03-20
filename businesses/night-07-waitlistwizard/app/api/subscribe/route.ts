import { NextRequest, NextResponse } from "next/server";

const subscribers: Map<string, Set<string>> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productName } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 }
      );
    }

    const key = productName.trim().toLowerCase();
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(email.trim().toLowerCase());

    return NextResponse.json({
      success: true,
      count: subscribers.get(key)!.size,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productName = searchParams.get("productName");

  if (!productName) {
    return NextResponse.json(
      { error: "productName query parameter is required" },
      { status: 400 }
    );
  }

  const key = productName.trim().toLowerCase();
  const count = subscribers.has(key) ? subscribers.get(key)!.size : 0;

  return NextResponse.json({ count });
}
