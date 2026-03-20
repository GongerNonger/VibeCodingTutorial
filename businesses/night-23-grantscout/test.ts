import { grants } from "./lib/grants";
import { matchGrants, filterGrants } from "./lib/matcher";
import { generateDraft } from "./lib/drafter";
import { saveProfile, getProfile, getAllProfiles, deleteProfile, clearProfiles } from "./lib/profiles";
import { BusinessProfile } from "./lib/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message}`);
  }
}

console.log("\n=== GrantScout Tests ===\n");

// --- Grant Database Tests ---
console.log("Grant Database:");
assert(grants.length >= 15, `Should have at least 15 grants (has ${grants.length})`);
assert(grants.every((g) => g.id && g.name && g.agency), "All grants have id, name, agency");
assert(grants.every((g) => g.amountMin > 0), "All grants have positive amountMin");
assert(grants.every((g) => g.amountMax >= g.amountMin), "amountMax >= amountMin for all grants");
assert(grants.every((g) => g.deadline.length === 10), "All grants have YYYY-MM-DD deadline");
assert(grants.every((g) => g.tips.length > 0), "All grants have at least one tip");
assert(grants.every((g) => g.commonQuestions.length > 0), "All grants have common questions");
assert(grants.every((g) => g.url.startsWith("http")), "All grants have valid URLs");

const categories = new Set(grants.map((g) => g.category));
assert(categories.size >= 5, `Should have at least 5 categories (has ${categories.size})`);

const sbaGrants = grants.filter((g) => g.category === "SBA");
assert(sbaGrants.length >= 3, `Should have at least 3 SBA grants (has ${sbaGrants.length})`);

const sbirGrants = grants.filter((g) => g.category === "SBIR/STTR");
assert(sbirGrants.length >= 2, `Should have at least 2 SBIR/STTR grants (has ${sbirGrants.length})`);

// --- Matching Tests ---
console.log("\nGrant Matching:");

const techProfile: BusinessProfile = {
  id: "test-1",
  name: "TechCo",
  industry: "Technology",
  state: "CA",
  employeeCount: 25,
  annualRevenue: 500000,
  minorityOwned: false,
  womenOwned: false,
  veteranOwned: false,
  description: "A tech company",
};

const techMatches = matchGrants(techProfile, grants);
assert(techMatches.length > 0, "Tech company in CA should have grant matches");
assert(techMatches.every((m) => m.score > 0), "All matches should have positive scores");
assert(techMatches.every((m) => m.reasons.length > 0), "All matches should have reasons");

// CA company should match CA state grant
const caMatch = techMatches.find((m) => m.grant.id === "ca-small-biz");
assert(caMatch !== undefined, "CA tech company should match CA state grant");

// TX company should NOT match CA grant
const txProfile: BusinessProfile = {
  ...techProfile,
  id: "test-2",
  state: "TX",
};
const txMatches = matchGrants(txProfile, grants);
const txCaMatch = txMatches.find((m) => m.grant.id === "ca-small-biz");
assert(txCaMatch === undefined, "TX company should NOT match CA state grant");

// TX company should match TX grant
const txTxMatch = txMatches.find((m) => m.grant.id === "tx-enterprise-fund");
assert(txTxMatch !== undefined, "TX company should match TX Enterprise Fund");

// Minority-owned matching
const minorityProfile: BusinessProfile = {
  ...techProfile,
  id: "test-3",
  minorityOwned: true,
};
const minorityMatches = matchGrants(minorityProfile, grants);
const mbdaMatch = minorityMatches.find((m) => m.grant.id === "mbda-grants");
assert(mbdaMatch !== undefined, "Minority-owned business should match MBDA grants");

// Non-minority should NOT match minority-required grants
const nonMinorityMbda = techMatches.find((m) => m.grant.id === "mbda-grants");
assert(nonMinorityMbda === undefined, "Non-minority business should NOT match MBDA grants");

// Women-owned matching
const womenProfile: BusinessProfile = {
  ...techProfile,
  id: "test-4",
  womenOwned: true,
};
const womenMatches = matchGrants(womenProfile, grants);
const amberMatch = womenMatches.find((m) => m.grant.id === "amber-grant");
assert(amberMatch !== undefined, "Women-owned business should match Amber Grant");

// Veteran-owned matching
const vetProfile: BusinessProfile = {
  ...techProfile,
  id: "test-5",
  veteranOwned: true,
};
const vetMatches = matchGrants(vetProfile, grants);
const vetMatch = vetMatches.find((m) => m.grant.id === "vetbiz-boost");
assert(vetMatch !== undefined, "Veteran-owned business should match veteran grants");

// --- Filtering Tests ---
console.log("\nGrant Filtering:");

const techFiltered = filterGrants(grants, { industry: "technology" });
assert(techFiltered.length > 0, "Filtering by technology industry returns results");

const caFiltered = filterGrants(grants, { state: "CA" });
assert(caFiltered.length > 0, "Filtering by CA state returns results");
assert(
  caFiltered.every(
    (g) => g.eligibility.states === "all" || (g.eligibility.states as string[]).includes("CA")
  ),
  "CA filter only returns grants available in CA"
);

const sbaFiltered = filterGrants(grants, { category: "SBA" });
assert(sbaFiltered.length >= 3, "Filtering by SBA category returns SBA grants");

// --- Profile Storage Tests ---
console.log("\nProfile Storage:");

clearProfiles();
assert(getAllProfiles().length === 0, "Profiles empty after clear");

const savedProfile = saveProfile({ ...techProfile, id: "" });
assert(savedProfile.id.length > 0, "Saved profile gets an ID");
assert(getProfile(savedProfile.id)?.name === "TechCo", "Can retrieve saved profile by ID");

const savedProfile2 = saveProfile({ ...txProfile, id: "custom-id" });
assert(savedProfile2.id === "custom-id", "Custom ID is preserved");
assert(getAllProfiles().length === 2, "Two profiles stored");

const deleted = deleteProfile(savedProfile.id);
assert(deleted === true, "Delete returns true for existing profile");
assert(getAllProfiles().length === 1, "One profile remains after deletion");

// --- Draft Generation Tests ---
console.log("\nDraft Generation:");

const sba7a = grants.find((g) => g.id === "sba-7a")!;
const drafts = generateDraft(sba7a, techProfile);
assert(drafts.length === sba7a.commonQuestions.length, "Draft count matches question count");
assert(drafts.every((d) => d.question.length > 0), "All drafts have questions");
assert(drafts.every((d) => d.answer.length > 50), "All drafts have substantial answers");
assert(drafts.some((d) => d.answer.includes("TechCo")), "Drafts include business name");
assert(drafts.some((d) => d.answer.includes("CA")), "Drafts include business state");

// Veteran-specific draft
const vetGrant = grants.find((g) => g.id === "vetbiz-boost")!;
const vetDrafts = generateDraft(vetGrant, vetProfile);
assert(vetDrafts.length > 0, "Veteran grant generates drafts");
assert(vetDrafts.some((d) => d.answer.includes("veteran")), "Veteran draft mentions veteran status");

clearProfiles();

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions ===\n`);
if (failed > 0) process.exit(1);
