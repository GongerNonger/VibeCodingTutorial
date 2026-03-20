import { NextRequest, NextResponse } from "next/server";
import { generateProposal, assembleFullProposal } from "@/lib/generator";
import { saveProposal } from "@/lib/store";
import { GenerateRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.profile || !body.project) {
      return NextResponse.json(
        { error: "Missing profile or project details" },
        { status: 400 }
      );
    }

    if (!body.project.clientName || !body.project.projectTitle) {
      return NextResponse.json(
        { error: "Client name and project title are required" },
        { status: 400 }
      );
    }

    if (!body.project.lineItems || body.project.lineItems.length === 0) {
      return NextResponse.json(
        { error: "At least one line item is required" },
        { status: 400 }
      );
    }

    const style = body.style || "professional";
    const proposal = generateProposal({ ...body, style });
    const fullText = assembleFullProposal(proposal);

    saveProposal(proposal);

    return NextResponse.json({
      proposal,
      fullText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
