import { CompanyProfile, OnboardingPacket } from "./types";

const companies: Map<string, CompanyProfile> = new Map();
const packets: Map<string, OnboardingPacket> = new Map();

export function getCompanies(): CompanyProfile[] {
  return Array.from(companies.values());
}

export function getCompany(id: string): CompanyProfile | undefined {
  return companies.get(id);
}

export function saveCompany(company: CompanyProfile): CompanyProfile {
  companies.set(company.id, company);
  return company;
}

export function getPackets(): OnboardingPacket[] {
  return Array.from(packets.values());
}

export function getPacket(id: string): OnboardingPacket | undefined {
  return packets.get(id);
}

export function savePacket(packet: OnboardingPacket): OnboardingPacket {
  packets.set(packet.id, packet);
  return packet;
}
