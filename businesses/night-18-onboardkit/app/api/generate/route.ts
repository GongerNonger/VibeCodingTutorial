import { NextRequest, NextResponse } from "next/server";
import { CompanyProfile, RoleDetails, OnboardingPacket } from "@/lib/types";
import { generatePacket } from "@/lib/generator";
import { saveCompany, savePacket } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, role } = body as {
      company: CompanyProfile;
      role: RoleDetails;
    };

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role details are required" },
        { status: 400 }
      );
    }

    if (!company.name || !role.title) {
      return NextResponse.json(
        { error: "Company name and role title are required" },
        { status: 400 }
      );
    }

    // Ensure company has an ID
    if (!company.id) {
      company.id = crypto.randomUUID();
    }

    // Save company profile
    saveCompany(company);

    // Generate packet
    const sections = generatePacket(company, role);
    const packet: OnboardingPacket = {
      id: crypto.randomUUID(),
      companyId: company.id,
      companyName: company.name,
      roleTitle: role.title,
      createdAt: new Date().toISOString(),
      sections,
    };

    // Save packet
    savePacket(packet);

    return NextResponse.json(packet, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate onboarding packet" },
      { status: 500 }
    );
  }
}
