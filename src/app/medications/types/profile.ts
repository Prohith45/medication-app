export type GuardianRelationship =
  | "Father"
  | "Mother"
  | "Son"
  | "Daughter"
  | "Wife"
  | "Husband"
  | "Caregiver";

export interface UserProfile {
  patientName: string;
  guardianName: string;
  guardianRelation: GuardianRelationship;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  patientName: "Rohith",
  guardianName: "Family",
  guardianRelation: "Father",
};

export const GUARDIAN_RELATIONSHIPS: GuardianRelationship[] = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Wife",
  "Husband",
  "Caregiver",
];

export const PROFILE_STORAGE_KEY = "medtracker_user_profile";
