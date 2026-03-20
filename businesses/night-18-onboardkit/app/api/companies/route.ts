import { NextRequest, NextResponse } from "next/server";
import { CompanyProfile } from "@/lib/types";
import { getCompanies, saveCompany } from "@/lib/store";

export async function GET() {
  const companies = getCompanies();
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const company = body as CompanyProfile;

    if (!company.name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    if (!company.id) {
      company.id = crypto.randomUUID();
    }

    const saved = saveCompany(company);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save company" },
      { status: 500 }
    );
  }
}
