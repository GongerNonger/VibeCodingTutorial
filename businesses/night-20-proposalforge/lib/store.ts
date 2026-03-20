import { FreelancerProfile, Proposal } from "./types";

const profiles: Map<string, FreelancerProfile> = new Map();
const proposals: Map<string, Proposal> = new Map();

export function getProfiles(): FreelancerProfile[] {
  return Array.from(profiles.values());
}

export function getProfile(id: string): FreelancerProfile | undefined {
  return profiles.get(id);
}

export function saveProfile(profile: FreelancerProfile): FreelancerProfile {
  profiles.set(profile.id, profile);
  return profile;
}

export function getProposals(): Proposal[] {
  return Array.from(proposals.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveProposal(proposal: Proposal): Proposal {
  proposals.set(proposal.id, proposal);
  return proposal;
}
