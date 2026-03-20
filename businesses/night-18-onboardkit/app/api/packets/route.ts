import { NextResponse } from "next/server";
import { getPackets } from "@/lib/store";

export async function GET() {
  const packets = getPackets();
  return NextResponse.json(packets);
}
