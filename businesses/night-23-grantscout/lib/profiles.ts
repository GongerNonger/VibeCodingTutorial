import { BusinessProfile } from "./types";

const profiles: Map<string, BusinessProfile> = new Map();

export function saveProfile(profile: BusinessProfile): BusinessProfile {
  if (!profile.id) {
    profile.id = "profile-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }
  profiles.set(profile.id, profile);
  return profile;
}

export function getProfile(id: string): BusinessProfile | undefined {
  return profiles.get(id);
}

export function getAllProfiles(): BusinessProfile[] {
  return Array.from(profiles.values());
}

export function deleteProfile(id: string): boolean {
  return profiles.delete(id);
}

export function clearProfiles(): void {
  profiles.clear();
}
