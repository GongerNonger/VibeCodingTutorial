import { NextResponse } from "next/server";
import { personas } from "../store";

export async function GET() {
  return NextResponse.json({ personas });
}
