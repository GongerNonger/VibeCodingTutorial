export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  cultureValues: string;
  dressCode: string;
  toolsUsed: string;
}

export interface RoleDetails {
  title: string;
  department: string;
  manager: string;
  startDate: string;
  responsibilities: string;
}

export interface OnboardingPacket {
  id: string;
  companyId: string;
  companyName: string;
  roleTitle: string;
  createdAt: string;
  sections: PacketSections;
}

export interface PacketSections {
  welcomeLetter: string;
  firstWeekSchedule: string;
  roleExpectations: string;
  cultureOverview: string;
  itSetupChecklist: string;
  hrFormsChecklist: string;
}
