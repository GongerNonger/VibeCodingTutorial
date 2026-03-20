import { CompanyProfile } from "./types";

const profiles: Map<string, CompanyProfile> = new Map();

export function getAllProfiles(): CompanyProfile[] {
  return Array.from(profiles.values());
}

export function getProfile(id: string): CompanyProfile | undefined {
  return profiles.get(id);
}

export function saveProfile(profile: CompanyProfile): CompanyProfile {
  profiles.set(profile.id, profile);
  return profile;
}

export function deleteProfile(id: string): boolean {
  return profiles.delete(id);
}

export function clearProfiles(): void {
  profiles.clear();
}
