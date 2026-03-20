import { Grant, BusinessProfile } from "./types";

export function generateDraft(
  grant: Grant,
  profile: BusinessProfile
): { question: string; answer: string }[] {
  const drafts: { question: string; answer: string }[] = [];

  for (const question of grant.commonQuestions) {
    const answer = generateAnswer(question, grant, profile);
    drafts.push({ question, answer });
  }

  return drafts;
}

function generateAnswer(
  question: string,
  grant: Grant,
  profile: BusinessProfile
): string {
  const qLower = question.toLowerCase();

  // Business description questions
  if (
    qLower.includes("describe your business") ||
    qLower.includes("tell us about your business") ||
    qLower.includes("primary products or services")
  ) {
    return `${profile.name} is a ${profile.industry.toLowerCase()} company based in ${profile.state} with ${profile.employeeCount} employees and approximately $${formatMoney(profile.annualRevenue)} in annual revenue. ${profile.description} Our team is dedicated to delivering exceptional value to our customers while contributing to the economic vitality of our local community.${getDemographicStatement(profile)}`;
  }

  // Funding purpose questions
  if (
    qLower.includes("purpose of the requested funding") ||
    qLower.includes("how will") && qLower.includes("funds be used") ||
    qLower.includes("what will the grant funds be used for")
  ) {
    return `The requested funding from the ${grant.name} program will be strategically deployed to accelerate ${profile.name}'s growth trajectory. Specifically, we plan to invest in expanding our operational capacity, enhancing our ${profile.industry.toLowerCase()} capabilities, and strengthening our market position. With funding in the range of $${formatMoney(grant.amountMin)} to $${formatMoney(grant.amountMax)}, we will be able to hire additional team members, invest in critical infrastructure, and expand our service offerings to meet growing demand.`;
  }

  // Financial projection questions
  if (
    qLower.includes("financial projection") ||
    qLower.includes("financial") && qLower.includes("plan")
  ) {
    const year1 = Math.round(profile.annualRevenue * 1.3);
    const year2 = Math.round(profile.annualRevenue * 1.7);
    const year3 = Math.round(profile.annualRevenue * 2.2);
    return `Based on current market trends and our growth strategy, ${profile.name} projects the following revenue trajectory: Year 1: $${formatMoney(year1)} (30% growth), Year 2: $${formatMoney(year2)} (70% cumulative growth), Year 3: $${formatMoney(year3)} (120% cumulative growth). These projections are supported by our expanding customer base, strategic market positioning in the ${profile.industry.toLowerCase()} sector, and the operational investments this funding will enable. Our current revenue of $${formatMoney(profile.annualRevenue)} provides a strong foundation for sustainable growth.`;
  }

  // Community impact questions
  if (
    qLower.includes("community") ||
    qLower.includes("economic impact") ||
    qLower.includes("serve the local")
  ) {
    return `${profile.name} is deeply committed to making a positive impact in our ${profile.state} community. Our operations directly support ${profile.employeeCount} jobs locally, and we work with numerous local suppliers and partners. Through this grant, we aim to expand our workforce, create additional employment opportunities, and contribute to the economic resilience of our region. We believe that a thriving local business ecosystem benefits everyone, and we are proud to be an active participant in our community's growth.`;
  }

  // Innovation/technology questions
  if (
    qLower.includes("innovation") ||
    qLower.includes("technical") ||
    qLower.includes("technology")
  ) {
    return `${profile.name} is at the forefront of innovation in the ${profile.industry.toLowerCase()} sector. Our approach combines deep domain expertise with modern technology to solve critical challenges faced by our customers. We are developing solutions that not only address current market needs but also anticipate future trends. Our team of ${profile.employeeCount} professionals brings diverse expertise and a commitment to pushing the boundaries of what is possible in our field. This funding will enable us to accelerate our R&D efforts and bring our innovations to market more quickly.`;
  }

  // Military/veteran questions
  if (
    qLower.includes("military") ||
    qLower.includes("veteran") ||
    qLower.includes("service")
  ) {
    return `As a veteran-owned business, ${profile.name} was founded on the principles of discipline, leadership, and mission-focused execution that were developed through military service. These values are embedded in every aspect of our operations, from our commitment to quality and reliability to our team-oriented culture. Our military experience has equipped us with unique skills in strategic planning, risk management, and adaptive problem-solving that directly translate to business success in the ${profile.industry.toLowerCase()} sector.`;
  }

  // Experience/background questions
  if (
    qLower.includes("experience") ||
    qLower.includes("background") ||
    qLower.includes("inspired") ||
    qLower.includes("what inspired")
  ) {
    return `${profile.name} was born from a deep passion for the ${profile.industry.toLowerCase()} industry and a recognition of unmet needs in the market. Our founding team brings extensive experience in the field, and we have built a company culture that values innovation, customer service, and continuous improvement. Since our founding, we have grown to ${profile.employeeCount} employees and $${formatMoney(profile.annualRevenue)} in annual revenue, demonstrating strong market validation for our products and services.`;
  }

  // Market/commercialization questions
  if (
    qLower.includes("market") ||
    qLower.includes("commercial") ||
    qLower.includes("target") ||
    qLower.includes("go-to-market") ||
    qLower.includes("competitive")
  ) {
    return `${profile.name} operates in a growing segment of the ${profile.industry.toLowerCase()} market. Our target customers value quality, reliability, and innovation — all hallmarks of our brand. Our competitive advantage lies in our deep understanding of customer needs, our agile approach to product development, and our strong relationships within the industry. With current revenue of $${formatMoney(profile.annualRevenue)}, we have demonstrated product-market fit and are well-positioned for accelerated growth through the support of the ${grant.name} program.`;
  }

  // Repayment/sustainability questions
  if (
    qLower.includes("repay") ||
    qLower.includes("sustainability") ||
    qLower.includes("sustain")
  ) {
    return `${profile.name} has a clear path to financial sustainability and growth. Our current revenue of $${formatMoney(profile.annualRevenue)} provides a solid foundation, and our growth projections indicate significant revenue increases over the coming years. We maintain disciplined financial management practices and have built strong relationships with our customers that ensure recurring revenue streams. The funding from ${grant.name} will accelerate our trajectory while maintaining the financial prudence that has characterized our operations.`;
  }

  // Job creation questions
  if (
    qLower.includes("job") && (qLower.includes("creation") || qLower.includes("create"))
  ) {
    const newJobs = Math.max(3, Math.round(profile.employeeCount * 0.5));
    return `${profile.name} plans to create ${newJobs} new full-time positions within 18 months of receiving funding. These roles will span key areas including operations, customer service, and business development. We are committed to hiring locally and providing competitive wages, benefits, and professional development opportunities. Our goal is not just to grow our business but to contribute meaningfully to employment and economic development in ${profile.state}.`;
  }

  // Partnership/collaboration questions
  if (
    qLower.includes("partner") ||
    qLower.includes("collaboration") ||
    qLower.includes("research institution")
  ) {
    return `${profile.name} values strategic partnerships as a key driver of innovation and growth. We actively collaborate with industry partners, research institutions, and community organizations to enhance our capabilities and impact. These partnerships enable us to access cutting-edge research, share best practices, and deliver more comprehensive solutions to our customers. We are open to expanding these collaborative relationships through the ${grant.name} program.`;
  }

  // Milestone/goals questions
  if (
    qLower.includes("milestone") ||
    qLower.includes("goal") ||
    qLower.includes("next 12 months")
  ) {
    return `In the next 12 months, ${profile.name} aims to achieve several key milestones: expanding our team from ${profile.employeeCount} to ${profile.employeeCount + Math.max(2, Math.round(profile.employeeCount * 0.3))} employees, increasing revenue by 30%, launching new product offerings in the ${profile.industry.toLowerCase()} space, and deepening our market presence in ${profile.state}. The ${grant.name} funding will be instrumental in helping us reach these goals on an accelerated timeline.`;
  }

  // Traction/results questions
  if (
    qLower.includes("traction") ||
    qLower.includes("results") ||
    qLower.includes("early")
  ) {
    return `${profile.name} has demonstrated strong early traction with $${formatMoney(profile.annualRevenue)} in annual revenue and a growing customer base. Our team of ${profile.employeeCount} is lean and efficient, allowing us to deliver outstanding results while maintaining healthy margins. Customer satisfaction rates remain high, and we continue to see growing demand for our ${profile.industry.toLowerCase()} solutions. This traction validates our business model and positions us well for the accelerated growth that ${grant.name} funding would enable.`;
  }

  // Default catch-all
  return `${profile.name} is a ${profile.industry.toLowerCase()} business based in ${profile.state} with ${profile.employeeCount} employees generating $${formatMoney(profile.annualRevenue)} in annual revenue. ${profile.description} We are applying to the ${grant.name} program because we believe our business aligns well with the program's mission and that this funding will enable us to achieve our growth objectives while making a positive impact in our community and industry.`;
}

function getDemographicStatement(profile: BusinessProfile): string {
  const demos: string[] = [];
  if (profile.minorityOwned) demos.push("minority-owned");
  if (profile.womenOwned) demos.push("women-owned");
  if (profile.veteranOwned) demos.push("veteran-owned");
  if (demos.length === 0) return "";
  return ` As a ${demos.join(", ")} business, we bring diverse perspectives and a strong commitment to inclusive economic growth.`;
}

function formatMoney(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "M";
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + "K";
  }
  return amount.toString();
}
