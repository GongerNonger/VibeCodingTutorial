import { CompanyProfile, RFPSection, GeneratedResponse, Tone } from "./types";

const toneStyles: Record<Tone, { opener: string; style: string; closing: string }> = {
  formal: {
    opener: "We respectfully submit",
    style: "professional and measured",
    closing: "We appreciate the opportunity to present our qualifications and look forward to the possibility of contributing to this initiative.",
  },
  persuasive: {
    opener: "We are uniquely positioned to deliver",
    style: "compelling and confident",
    closing: "We are confident that our proven track record and dedicated team make us the ideal partner for this project. We welcome the opportunity to discuss how we can exceed your expectations.",
  },
  technical: {
    opener: "Our technical approach encompasses",
    style: "detailed and precise",
    closing: "Our technical methodology is designed to ensure rigorous adherence to specifications while maintaining efficiency. We are prepared to provide additional technical documentation upon request.",
  },
};

function generateCapabilitiesStatement(profile: CompanyProfile, tone: Tone): string {
  const t = toneStyles[tone];
  return `${profile.name} brings extensive expertise in ${profile.capabilities}. With a dedicated team of ${profile.teamSize} professionals, we have consistently delivered results aligned with client expectations.`;
}

function generateExperienceStatement(profile: CompanyProfile): string {
  if (!profile.pastProjects || !profile.pastProjects.trim()) {
    return `${profile.name} has a strong track record of successful project delivery across diverse engagements.`;
  }
  return `Our relevant experience includes: ${profile.pastProjects}. These engagements demonstrate our capacity to deliver high-quality outcomes on schedule and within budget.`;
}

function generateSectionResponse(
  section: RFPSection,
  profile: CompanyProfile,
  tone: Tone
): string {
  const t = toneStyles[tone];
  const capabilities = generateCapabilitiesStatement(profile, tone);
  const experience = generateExperienceStatement(profile);

  const paragraphs: string[] = [];

  switch (section.type) {
    case "question":
      paragraphs.push(
        `${t.opener} the following response to address "${section.title}".`
      );
      paragraphs.push(
        `${profile.description} ${capabilities}`
      );
      paragraphs.push(experience);
      paragraphs.push(
        `In direct response to the requirements outlined in this section, ${profile.name} will leverage our core competencies to deliver a comprehensive solution. Our approach is ${t.style}, ensuring alignment with the stated objectives while bringing innovative practices refined through our past engagements.`
      );
      break;

    case "requirement":
      paragraphs.push(
        `${profile.name} acknowledges and fully complies with the requirements specified in "${section.title}".`
      );
      paragraphs.push(capabilities);
      paragraphs.push(
        `To satisfy these requirements, we will deploy our proven methodology and dedicated resources. ${experience}`
      );
      paragraphs.push(
        `Our commitment to meeting every stated requirement is backed by our operational processes and quality assurance protocols. We have established procedures to ensure compliance and traceability throughout the project lifecycle.`
      );
      break;

    case "criteria":
      paragraphs.push(
        `Regarding the evaluation criteria outlined in "${section.title}", ${profile.name} demonstrates strong alignment across all dimensions.`
      );
      paragraphs.push(capabilities);
      paragraphs.push(experience);
      paragraphs.push(
        `We believe our qualifications, approach, and demonstrated outcomes position us favorably against the stated criteria. Our team is committed to transparency and measurable deliverables that facilitate objective evaluation.`
      );
      break;

    default:
      paragraphs.push(
        `${t.opener} our response for "${section.title}".`
      );
      paragraphs.push(
        `${profile.description}`
      );
      paragraphs.push(capabilities);
      paragraphs.push(experience);
      break;
  }

  paragraphs.push(t.closing);

  return paragraphs.join("\n\n");
}

export function generateResponses(
  sections: RFPSection[],
  profile: CompanyProfile,
  tone: Tone = "formal"
): GeneratedResponse[] {
  return sections.map((section) => ({
    sectionId: section.id,
    sectionTitle: section.title,
    response: generateSectionResponse(section, profile, tone),
  }));
}
