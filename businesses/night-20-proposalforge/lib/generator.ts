import { GenerateRequest, LineItem, Proposal } from "./types";

function generateId(): string {
  return "prop_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function calculateLineItemTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function calculateTotalPrice(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generateCoverLetter(req: GenerateRequest): string {
  const { profile, project, style } = req;

  if (style === "minimal") {
    return [
      `Dear ${project.clientName},`,
      "",
      `Thank you for considering me for "${project.projectTitle}". I am a ${profile.title} with expertise in ${profile.skills.slice(0, 3).join(", ")}.`,
      "",
      `I have reviewed the project requirements and am confident I can deliver high-quality results within the specified timeframe.`,
      "",
      `Please find the detailed proposal below.`,
      "",
      `Best regards,`,
      `${profile.name}`,
      profile.email,
    ].join("\n");
  }

  if (style === "creative") {
    return [
      `Hello ${project.clientName}!`,
      "",
      `I'm thrilled about the opportunity to bring "${project.projectTitle}" to life! As a passionate ${profile.title}, I specialize in ${profile.skills.join(", ")} — and this project is right in my wheelhouse.`,
      "",
      `I've put together a comprehensive proposal that outlines exactly how I'll transform your vision into reality. From initial concept to final delivery, every detail has been carefully considered to ensure we exceed expectations.`,
      "",
      `Let's create something amazing together!`,
      "",
      `Warmly,`,
      `${profile.name}`,
      `${profile.title}`,
      profile.email,
      profile.portfolioUrl ? `Portfolio: ${profile.portfolioUrl}` : "",
    ].filter(Boolean).join("\n");
  }

  // professional (default)
  return [
    `Dear ${project.clientName},`,
    "",
    `Thank you for the opportunity to submit this proposal for "${project.projectTitle}"${project.clientCompany ? ` at ${project.clientCompany}` : ""}. As a ${profile.title} with specialized expertise in ${profile.skills.join(", ")}, I am well-positioned to deliver exceptional results for this project.`,
    "",
    `I have thoroughly reviewed the project requirements and prepared this detailed proposal outlining my approach, timeline, and investment. My goal is to ensure complete alignment with your objectives and deliver maximum value.`,
    "",
    `I look forward to discussing this proposal with you and answering any questions you may have.`,
    "",
    `Sincerely,`,
    `${profile.name}`,
    `${profile.title}`,
    profile.email,
    profile.portfolioUrl ? `Portfolio: ${profile.portfolioUrl}` : "",
  ].filter(Boolean).join("\n");
}

function generateProjectUnderstanding(req: GenerateRequest): string {
  const { project, style } = req;
  const sections: string[] = [];

  if (style === "minimal") {
    sections.push("PROJECT OVERVIEW");
    sections.push("");
    sections.push(project.projectDescription);
    sections.push("");
    sections.push("Key Deliverables:");
    project.deliverables.forEach((d) => sections.push(`  - ${d}`));
    if (project.deadline) {
      sections.push("");
      sections.push(`Target Completion: ${formatDate(project.deadline)}`);
    }
  } else if (style === "creative") {
    sections.push("=== THE VISION ===");
    sections.push("");
    sections.push(project.projectDescription);
    sections.push("");
    sections.push("What We're Building Together:");
    project.deliverables.forEach((d, i) => sections.push(`  ${i + 1}. ${d}`));
    if (project.deadline) {
      sections.push("");
      sections.push(`Launch Date: ${formatDate(project.deadline)}`);
    }
  } else {
    sections.push("PROJECT UNDERSTANDING");
    sections.push("─".repeat(40));
    sections.push("");
    sections.push(`Client: ${project.clientName}${project.clientCompany ? ` (${project.clientCompany})` : ""}`);
    sections.push(`Project: ${project.projectTitle}`);
    sections.push(`Date: ${today()}`);
    sections.push("");
    sections.push("Description:");
    sections.push(project.projectDescription);
    sections.push("");
    sections.push("Deliverables:");
    project.deliverables.forEach((d, i) => sections.push(`  ${i + 1}. ${d}`));
    if (project.deadline) {
      sections.push("");
      sections.push(`Target Deadline: ${formatDate(project.deadline)}`);
    }
  }

  return sections.join("\n");
}

function generateScopeOfWork(req: GenerateRequest): string {
  const { project, profile, style } = req;
  const sections: string[] = [];
  const header = style === "creative" ? "=== SCOPE OF WORK ===" : "SCOPE OF WORK";

  sections.push(header);
  if (style === "professional") sections.push("─".repeat(40));
  sections.push("");

  sections.push("This engagement covers the following work:");
  sections.push("");

  project.deliverables.forEach((d, i) => {
    const phase = `Phase ${i + 1}: ${d}`;
    sections.push(style === "creative" ? `>> ${phase}` : phase);
    sections.push(`  - Requirements analysis and planning`);
    sections.push(`  - Implementation and development`);
    sections.push(`  - Quality assurance and testing`);
    sections.push(`  - Client review and revisions`);
    sections.push("");
  });

  sections.push("Included in scope:");
  sections.push(`  - Up to 2 rounds of revisions per deliverable`);
  sections.push(`  - Regular progress updates`);
  sections.push(`  - Final delivery in agreed-upon formats`);
  sections.push("");
  sections.push("Out of scope (available as add-ons):");
  sections.push(`  - Additional revision rounds beyond the included 2`);
  sections.push(`  - Scope changes after project kickoff`);
  sections.push(`  - Ongoing maintenance and support`);

  return sections.join("\n");
}

function generateTimeline(req: GenerateRequest): string {
  const { project, style } = req;
  const sections: string[] = [];
  const header = style === "creative" ? "=== TIMELINE & MILESTONES ===" : "TIMELINE & MILESTONES";

  sections.push(header);
  if (style === "professional") sections.push("─".repeat(40));
  sections.push("");

  const deliverableCount = project.deliverables.length;
  let deadlineDate: Date | null = null;
  if (project.deadline) {
    deadlineDate = new Date(project.deadline);
  }

  const startDate = new Date();
  const totalDays = deadlineDate
    ? Math.max(Math.ceil((deadlineDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), deliverableCount * 7)
    : deliverableCount * 14;

  const daysPerPhase = Math.floor(totalDays / (deliverableCount + 1)); // +1 for review phase

  project.deliverables.forEach((d, i) => {
    const phaseStart = new Date(startDate);
    phaseStart.setDate(phaseStart.getDate() + i * daysPerPhase);
    const phaseEnd = new Date(phaseStart);
    phaseEnd.setDate(phaseEnd.getDate() + daysPerPhase - 1);

    const marker = style === "creative" ? `>> ` : `  `;
    sections.push(`${marker}Milestone ${i + 1}: ${d}`);
    sections.push(`    Start: ${formatDate(phaseStart.toISOString())}`);
    sections.push(`    End: ${formatDate(phaseEnd.toISOString())}`);
    sections.push("");
  });

  sections.push(`${style === "creative" ? ">> " : "  "}Final Review & Delivery`);
  const finalStart = new Date(startDate);
  finalStart.setDate(finalStart.getDate() + deliverableCount * daysPerPhase);
  sections.push(`    Start: ${formatDate(finalStart.toISOString())}`);
  if (deadlineDate) {
    sections.push(`    End: ${formatDate(deadlineDate.toISOString())}`);
  } else {
    const finalEnd = new Date(finalStart);
    finalEnd.setDate(finalEnd.getDate() + daysPerPhase - 1);
    sections.push(`    End: ${formatDate(finalEnd.toISOString())}`);
  }

  return sections.join("\n");
}

function generatePricingTable(req: GenerateRequest): string {
  const { project, style } = req;
  const sections: string[] = [];
  const header = style === "creative" ? "=== INVESTMENT ===" : "PRICING";

  sections.push(header);
  if (style === "professional") sections.push("─".repeat(40));
  sections.push("");

  sections.push(`Pricing Model: ${project.pricingModel === "hourly" ? "Hourly Rate" : "Fixed Price"}`);
  sections.push("");

  // Table header
  const pad = (s: string, len: number) => s.padEnd(len);
  sections.push(`  ${pad("Item", 35)} ${pad("Qty", 6)} ${pad("Unit", 8)} ${pad("Rate", 12)} ${pad("Total", 12)}`);
  sections.push(`  ${"─".repeat(35)} ${"─".repeat(6)} ${"─".repeat(8)} ${"─".repeat(12)} ${"─".repeat(12)}`);

  project.lineItems.forEach((item) => {
    const total = calculateLineItemTotal(item);
    sections.push(
      `  ${pad(item.description, 35)} ${pad(String(item.quantity), 6)} ${pad(item.unit, 8)} ${pad(formatCurrency(item.unitPrice), 12)} ${pad(formatCurrency(total), 12)}`
    );
  });

  const totalPrice = calculateTotalPrice(project.lineItems);
  sections.push(`  ${"─".repeat(75)}`);
  sections.push(`  ${pad("", 63)} ${pad("TOTAL", 0)} ${formatCurrency(totalPrice)}`);

  if (style === "professional") {
    sections.push("");
    sections.push("Payment Schedule:");
    sections.push(`  - 50% upfront deposit: ${formatCurrency(totalPrice * 0.5)}`);
    sections.push(`  - 25% at midpoint milestone: ${formatCurrency(totalPrice * 0.25)}`);
    sections.push(`  - 25% upon final delivery: ${formatCurrency(totalPrice * 0.25)}`);
  } else if (style === "creative") {
    sections.push("");
    sections.push("Payment Milestones:");
    sections.push(`  - Kickoff: ${formatCurrency(totalPrice * 0.5)} (50%)`);
    sections.push(`  - Delivery: ${formatCurrency(totalPrice * 0.5)} (50%)`);
  } else {
    sections.push("");
    sections.push(`Payment: 50% upfront, 50% on delivery`);
  }

  return sections.join("\n");
}

function generateTerms(req: GenerateRequest): string {
  const { style } = req;
  const sections: string[] = [];
  const header = style === "creative" ? "=== TERMS & CONDITIONS ===" : "TERMS & CONDITIONS";

  sections.push(header);
  if (style === "professional") sections.push("─".repeat(40));
  sections.push("");

  const terms = [
    "This proposal is valid for 30 days from the date of issue.",
    "Work will commence upon receipt of signed agreement and initial deposit.",
    "Client agrees to provide all necessary content, assets, and feedback in a timely manner.",
    "Delays in client feedback may extend the project timeline accordingly.",
    "Two (2) rounds of revisions are included per deliverable. Additional revisions will be billed at the agreed hourly rate.",
    "All intellectual property rights transfer to the client upon final payment.",
    "Either party may terminate this agreement with 14 days written notice. Client will be invoiced for work completed to date.",
    "Confidentiality: Both parties agree to keep project details and proprietary information confidential.",
  ];

  terms.forEach((t, i) => {
    sections.push(`  ${i + 1}. ${t}`);
  });

  sections.push("");
  sections.push("By accepting this proposal, you agree to the terms outlined above.");
  sections.push("");
  sections.push("─".repeat(40));
  sections.push("Signature: ____________________________    Date: __________");
  sections.push("");
  sections.push("─".repeat(40));
  sections.push("Client Signature: _____________________    Date: __________");

  return sections.join("\n");
}

export function generateProposal(req: GenerateRequest): Proposal {
  const totalPrice = calculateTotalPrice(req.project.lineItems);

  return {
    id: generateId(),
    profileId: req.profile.id,
    clientName: req.project.clientName,
    projectTitle: req.project.projectTitle,
    style: req.style,
    coverLetter: generateCoverLetter(req),
    projectUnderstanding: generateProjectUnderstanding(req),
    scopeOfWork: generateScopeOfWork(req),
    timeline: generateTimeline(req),
    pricingTable: generatePricingTable(req),
    termsAndConditions: generateTerms(req),
    totalPrice,
    createdAt: new Date().toISOString(),
  };
}

export function assembleFullProposal(proposal: Proposal): string {
  const divider = "\n\n" + "═".repeat(60) + "\n\n";
  return [
    proposal.coverLetter,
    proposal.projectUnderstanding,
    proposal.scopeOfWork,
    proposal.timeline,
    proposal.pricingTable,
    proposal.termsAndConditions,
  ].join(divider);
}
