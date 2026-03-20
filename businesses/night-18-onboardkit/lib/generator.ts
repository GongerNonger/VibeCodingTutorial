import { CompanyProfile, RoleDetails, PacketSections } from "./types";

export function generateWelcomeLetter(
  company: CompanyProfile,
  role: RoleDetails
): string {
  const startDateFormatted = role.startDate
    ? new Date(role.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "your start date";

  return `WELCOME TO ${company.name.toUpperCase()}!

Dear New Team Member,

We are thrilled to welcome you to ${company.name} as our new ${role.title} in the ${role.department} department! Your first day is ${startDateFormatted}, and we could not be more excited to have you join our team.

At ${company.name}, we are proud to be a leader in the ${company.industry} industry, and your skills and experience will be a valuable addition to our organization of ${company.size} employees.

Your manager, ${role.manager}, is looking forward to meeting you and helping you get settled in. They will be your primary point of contact during your first few weeks as you get oriented.

We believe in ${company.cultureValues}, and we know you will fit right in with our team culture.

Once again, welcome aboard! We are confident that you will thrive here at ${company.name}.

Warm regards,
The ${company.name} Team`;
}

export function generateFirstWeekSchedule(
  company: CompanyProfile,
  role: RoleDetails
): string {
  return `FIRST WEEK SCHEDULE — ${role.title}

DAY 1 (${role.startDate || "Start Date"})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
09:00 AM - Welcome & Building Tour
09:30 AM - IT Setup & Equipment Collection
10:30 AM - HR Orientation & Paperwork
11:30 AM - Meet Your Manager: ${role.manager}
12:00 PM - Team Lunch (on us!)
01:00 PM - Department Overview with ${role.department} Team
02:30 PM - Review Company Tools: ${company.toolsUsed}
03:30 PM - Workstation Setup & Account Access
04:30 PM - Day 1 Check-in with ${role.manager}

DAY 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
09:00 AM - Morning Check-in with ${role.manager}
09:30 AM - Deep Dive: Company Policies & Handbook
10:30 AM - ${role.department} Team Introductions
11:30 AM - Role-Specific Training Session 1
12:00 PM - Lunch with Team Members
01:00 PM - Shadow a Team Member
03:00 PM - Review Current Projects & Priorities
04:30 PM - End of Day Recap

DAY 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
09:00 AM - Morning Standup with ${role.department}
09:30 AM - Role-Specific Training Session 2
11:00 AM - Cross-Department Introductions
12:00 PM - Lunch
01:00 PM - Begin First Assignment
03:00 PM - 1:1 with ${role.manager}
04:30 PM - Self-Study: Company Resources

DAY 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
09:00 AM - Morning Standup
09:30 AM - Continue First Assignment
12:00 PM - Lunch with Cross-Functional Team
01:00 PM - Benefits Enrollment Review (HR)
02:00 PM - Continue First Assignment
04:00 PM - Progress Check with ${role.manager}

DAY 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
09:00 AM - Morning Standup
09:30 AM - Week in Review with ${role.manager}
10:30 AM - Goal Setting for Week 2
11:30 AM - Complete Outstanding Training Modules
12:00 PM - Team Lunch (Friday Tradition at ${company.name})
01:00 PM - Continue Project Work
03:00 PM - First Week Feedback Session
04:00 PM - Plan for Next Week`;
}

export function generateRoleExpectations(
  company: CompanyProfile,
  role: RoleDetails
): string {
  const responsibilities = role.responsibilities
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const responsibilitiesList = responsibilities
    .map((r, i) => `${i + 1}. ${r}`)
    .join("\n");

  return `ROLE EXPECTATIONS — ${role.title}

POSITION: ${role.title}
DEPARTMENT: ${role.department}
REPORTS TO: ${role.manager}
COMPANY: ${company.name}

KEY RESPONSIBILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${responsibilitiesList}

FIRST 30 DAYS — LEARNING & ONBOARDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Complete all onboarding training modules
• Understand team processes and workflows
• Build relationships with key stakeholders
• Shadow experienced team members
• Complete first small project or task independently
• Master core tools: ${company.toolsUsed}

FIRST 60 DAYS — CONTRIBUTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Take ownership of assigned responsibilities
• Contribute meaningfully in team meetings
• Begin independent project work
• Identify areas for process improvement
• Build cross-functional relationships

FIRST 90 DAYS — PERFORMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Fully own your role responsibilities
• Deliver measurable results
• Mentor newer team members if applicable
• Propose improvements to ${role.department} workflows
• Complete 90-day performance review with ${role.manager}

PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your performance will be evaluated based on:
• Quality and timeliness of deliverables
• Collaboration with ${role.department} team and cross-functional partners
• Alignment with company values: ${company.cultureValues}
• Professional growth and skill development
• Initiative and problem-solving ability`;
}

export function generateCultureOverview(
  company: CompanyProfile,
  _role: RoleDetails
): string {
  const values = company.cultureValues
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  const valuesList = values
    .map(
      (v) =>
        `★ ${v.charAt(0).toUpperCase() + v.slice(1)}\n  This is at the heart of everything we do at ${company.name}.`
    )
    .join("\n\n");

  return `COMPANY CULTURE OVERVIEW — ${company.name}

WHO WE ARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${company.name} is a ${company.size}-person company in the ${company.industry} industry. We are united by our shared values and commitment to excellence.

OUR CORE VALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${valuesList}

DRESS CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our dress code is: ${company.dressCode}
We want you to feel comfortable while maintaining a professional environment that aligns with our ${company.industry} industry standards.

COMMUNICATION CULTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• We value open, honest, and respectful communication
• Regular team standups and all-hands meetings keep everyone aligned
• We use ${company.toolsUsed} for day-to-day collaboration
• Feedback is given constructively and received with an open mind
• We celebrate wins — big and small

WORK-LIFE BALANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• We respect personal time and boundaries
• Flexible scheduling where possible
• Mental health and wellness are priorities
• Team social events and bonding activities

GROWTH & DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Regular 1:1s with your manager
• Access to learning resources and training
• Clear career progression paths
• Internal mobility opportunities
• Mentorship programs available`;
}

export function generateITSetupChecklist(
  company: CompanyProfile,
  role: RoleDetails
): string {
  const tools = company.toolsUsed
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const toolsList = tools.map((t) => `☐ ${t} — Account created and access verified`).join("\n");

  return `IT SETUP CHECKLIST — ${role.title}

HARDWARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Laptop/Desktop assigned and configured
☐ Monitor(s) set up at workstation
☐ Keyboard and mouse provided
☐ Headset/webcam for video calls
☐ Phone/extension assigned (if applicable)
☐ Access badge/key card issued

ACCOUNTS & ACCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Company email account created (${role.title.toLowerCase().replace(/\s+/g, ".")}@${company.name.toLowerCase().replace(/\s+/g, "")}.com)
☐ Password manager set up
☐ Multi-factor authentication (MFA) enabled
☐ VPN access configured (if applicable)
☐ Company intranet/wiki access
☐ ${role.department} shared drive access

SOFTWARE & TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${toolsList}

SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Security awareness training completed
☐ Data handling policies reviewed
☐ Acceptable use policy signed
☐ Device encryption verified
☐ Antivirus/endpoint protection installed
☐ Emergency IT contact information saved

NETWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Wi-Fi access configured
☐ Printer access set up
☐ File sharing permissions verified
☐ Calendar integrated and shared with ${role.department} team

IT SUPPORT CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For any IT issues during onboarding, contact:
• IT Help Desk: helpdesk@${company.name.toLowerCase().replace(/\s+/g, "")}.com
• Hours: Monday-Friday, 8:00 AM - 6:00 PM`;
}

export function generateHRFormsChecklist(
  company: CompanyProfile,
  role: RoleDetails
): string {
  return `HR FORMS & COMPLIANCE CHECKLIST — ${role.title}

PRE-START DATE (Complete Before Day 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Signed offer letter returned
☐ Background check authorization
☐ Tax withholding forms (W-4 / applicable forms)
☐ Direct deposit enrollment form
☐ Emergency contact information form
☐ Photo ID submitted for records

DAY 1 — ORIENTATION PAPERWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Employee handbook acknowledgment
☐ Code of conduct agreement
☐ Confidentiality/NDA agreement
☐ Non-compete agreement (if applicable)
☐ Intellectual property assignment agreement
☐ At-will employment acknowledgment
☐ I-9 Employment Eligibility Verification

BENEFITS ENROLLMENT (Complete Within 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Health insurance plan selection
☐ Dental insurance enrollment
☐ Vision insurance enrollment
☐ Life insurance beneficiary designation
☐ 401(k)/retirement plan enrollment
☐ HSA/FSA enrollment (if applicable)
☐ Commuter benefits (if applicable)
☐ Employee assistance program (EAP) information reviewed

COMPANY POLICIES TO REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ PTO and leave policy
☐ Remote work policy
☐ Expense reimbursement policy
☐ Travel policy
☐ Anti-harassment and discrimination policy
☐ Social media policy
☐ Data privacy policy
☐ Safety and workplace policies

${role.department} DEPARTMENT-SPECIFIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Department-specific training certifications
☐ Role-specific compliance requirements
☐ ${role.department} team directory received
☐ Reporting structure and org chart reviewed

HR CONTACT AT ${company.name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For questions about forms, benefits, or policies, contact:
• HR Department: hr@${company.name.toLowerCase().replace(/\s+/g, "")}.com
• Benefits questions: benefits@${company.name.toLowerCase().replace(/\s+/g, "")}.com`;
}

export function generatePacket(
  company: CompanyProfile,
  role: RoleDetails
): PacketSections {
  return {
    welcomeLetter: generateWelcomeLetter(company, role),
    firstWeekSchedule: generateFirstWeekSchedule(company, role),
    roleExpectations: generateRoleExpectations(company, role),
    cultureOverview: generateCultureOverview(company, role),
    itSetupChecklist: generateITSetupChecklist(company, role),
    hrFormsChecklist: generateHRFormsChecklist(company, role),
  };
}
