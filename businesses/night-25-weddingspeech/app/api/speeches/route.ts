import { NextResponse } from "next/server";
import { getAllSpeeches } from "../store";

export async function GET() {
  const speeches = getAllSpeeches();
  return NextResponse.json(speeches);
}
