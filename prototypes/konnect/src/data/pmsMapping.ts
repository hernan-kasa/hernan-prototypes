// Portfolio Manager Service (PMS) amenity seed — mock data for Konnect import flow.
// See product-documentation/konnect-content-management/knt-001-amenity-pms-seed-spec.md
//
// This module pairs up:
//   - What PMS reports for a given property (its `amenitiesAndFacilities` payload), and
//   - A static mapping from PMS FacilityType → NextPax amenity { typeCode, attributes[] }
//
// Nothing here calls a real API. It produces the preview the operator reviews
// in the Import from PMS modal. When the operator confirms, the AmenitiesTab
// flips the selected toggles on and tags them `seededFromPMS`.

import { amenityCategoryMap } from './amenityTypes';

export type PmsConfidence = 'high' | 'medium';

/**
 * Shape of a PMS amenity record as it comes back from portfolio-manager-service.
 * Only the fields we use for mapping are typed — real PMS payloads have more.
 */
export interface PmsAmenity {
  facilityType: string;
  location?: 'indoor' | 'outdoor';
  access?: 'free' | 'paid' | 'shared';
  hasPoolHeating?: boolean;
}

/**
 * One row of the static mapping table. Engineers will eventually validate the
 * `nextPaxCode` values against the live NextPax mapping-codes API before ship;
 * for the prototype we target codes that already exist in amenityTypes.ts.
 */
export interface PmsMappingRow {
  pmsFacilityType: string;
  pmsLabel: string; // Source label shown in the modal (e.g. "Parking Garage")
  nextPaxCode: string;
  nextPaxName: string; // Human-readable amenity name — used for the modal row label
  attributeCode?: string; // Attribute to write into the AmenityEntry.attributes[]
  attributeLabel: string; // What we show in the "Attribute" column (— for boolean)
  confidence: PmsConfidence;
  policyWarning?: string; // Rendered as a small info note under the row
}

/**
 * What the mapping engine returns for a row that could not be resolved.
 */
export interface UnmappedPmsAmenity {
  pmsLabel: string;
  reason: string;
}

// ─── Static mapping table ────────────────────────────────────────────────────
// 11 mapped + 3 unmapped (matches the spec's mock data for stakeholder review).

const PMS_MAPPING: PmsMappingRow[] = [
  {
    pmsFacilityType: 'pool',
    pmsLabel: 'Pool',
    nextPaxCode: 'P05', // Outdoor swimming pool
    nextPaxName: 'Outdoor swimming pool (heated)',
    attributeCode: 'C', // 'communal' — default when PMS reports building-wide pool
    attributeLabel: 'Heated, Free',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'hottub',
    pmsLabel: 'Hot Tub',
    nextPaxCode: 'J01', // Jacuzzi
    nextPaxName: 'Hot tub / Jacuzzi',
    attributeCode: 'Y', // 'available'
    attributeLabel: '—',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'gym',
    pmsLabel: 'Gym',
    nextPaxCode: 'F12', // Fitness/Gym (boolean)
    nextPaxName: 'Fitness center',
    attributeLabel: 'Free',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'parkingGarage',
    pmsLabel: 'Parking Garage',
    nextPaxCode: 'G01', // Parking
    nextPaxName: 'Parking',
    attributeCode: 'G', // 'Garage'
    attributeLabel: 'Garage',
    confidence: 'high',
    policyWarning: 'Verify that parking policies are also configured.',
  },
  {
    pmsFacilityType: 'laundry',
    pmsLabel: 'Laundry',
    nextPaxCode: 'W01', // Washing machine (closest NextPax code for on-site laundry)
    nextPaxName: 'Washing machine / Laundry',
    attributeLabel: 'Free',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'bbq',
    pmsLabel: 'BBQ',
    nextPaxCode: 'B09', // Barbecue
    nextPaxName: 'Barbecue',
    attributeCode: 'Y', // 'Available'
    attributeLabel: '—',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'patio',
    pmsLabel: 'Patio',
    nextPaxCode: 'P17', // Patio (boolean)
    nextPaxName: 'Patio / Terrace',
    attributeLabel: '—',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'rooftop',
    pmsLabel: 'Rooftop',
    nextPaxCode: 'T02', // Terrace (closest NextPax match for rooftop)
    nextPaxName: 'Rooftop terrace',
    attributeLabel: '—',
    confidence: 'medium',
  },
  {
    pmsFacilityType: 'petFacilities',
    pmsLabel: 'Pet Facilities',
    nextPaxCode: 'P02', // House is suitable for pets
    nextPaxName: 'Pet-friendly',
    attributeCode: 'Y', // 'Yes' (stronger than 'on request')
    attributeLabel: '—',
    confidence: 'high',
    policyWarning: 'Verify that pet policies are also configured.',
  },
  {
    pmsFacilityType: 'businessCenter',
    pmsLabel: 'Business Center',
    nextPaxCode: 'B25', // Business center (boolean)
    nextPaxName: 'Business center',
    attributeLabel: '—',
    confidence: 'high',
  },
  {
    pmsFacilityType: 'bikeRacks',
    pmsLabel: 'Bike Racks',
    nextPaxCode: 'A62', // Bicycles parking (boolean)
    nextPaxName: 'Bicycle storage',
    attributeLabel: '—',
    confidence: 'medium',
  },
];

// PMS types with no NextPax counterpart — shown in the "could not be mapped" summary.
const PMS_UNMAPPED: UnmappedPmsAmenity[] = [
  { pmsLabel: 'Yoga Studio', reason: 'No matching NextPax amenity code' },
  { pmsLabel: 'Running Track', reason: 'No matching NextPax amenity code' },
  { pmsLabel: 'Concierge Closet', reason: 'No matching NextPax amenity code' },
];

// ─── Mock PMS data per property ──────────────────────────────────────────────
// In prod this comes from `guest-api GET /:propertyId/amenities`. For the
// prototype, every property reports the same bundle — the import flow differs
// only because each property has a different amount of Konnect content already.
// (Austin partial, Portland sparse, Chicago near-complete, SF fully-seeded.)

const DEFAULT_PMS_PAYLOAD: PmsAmenity[] = [
  { facilityType: 'pool', location: 'outdoor', access: 'free', hasPoolHeating: true },
  { facilityType: 'gym', access: 'free' },
  { facilityType: 'parkingGarage', access: 'paid' },
  { facilityType: 'hottub' },
  { facilityType: 'laundry', access: 'free' },
  { facilityType: 'bbq' },
  { facilityType: 'patio' },
  { facilityType: 'rooftop' },
  { facilityType: 'petFacilities' },
  { facilityType: 'businessCenter' },
  { facilityType: 'bikeRacks' },
  { facilityType: 'yogaStudio' },
  { facilityType: 'runningTrack' },
  { facilityType: 'conciergeCloset' },
];

export const mockPmsAmenities: Record<string, PmsAmenity[]> = {
  'prop-123': DEFAULT_PMS_PAYLOAD,
  'prop-456': DEFAULT_PMS_PAYLOAD,
  'prop-789': DEFAULT_PMS_PAYLOAD,
  'prop-999': DEFAULT_PMS_PAYLOAD,
};

// ─── Import history ──────────────────────────────────────────────────────────
// Who last ran "Import from PMS" on this property, and when. Populated with
// one historical entry for Austin so the prototype can demonstrate the
// "Last imported from PMS: ..." state before the operator imports again.

export interface PmsImportHistoryEntry {
  importedAt: string; // ISO date
  importedBy: string; // Display name
}

export const mockPmsImportHistory: Record<string, PmsImportHistoryEntry> = {
  'prop-123': { importedAt: '2026-03-15', importedBy: 'Mel Baker' },
};

// Operator running the current session — used when we append a new import entry.
export const CURRENT_IMPORT_USER = 'Sarah Gordon';
export const CURRENT_IMPORT_DATE = '2026-04-13';

// ─── Mapping engine ──────────────────────────────────────────────────────────

/**
 * One row in the import preview: a PMS amenity we successfully resolved AND
 * that is NOT already toggled on in Konnect.
 */
export interface ProposedImport {
  mapping: PmsMappingRow;
  pmsSource: PmsAmenity;
  konnectCategory: string; // Prototype's own category label for UI grouping
}

/**
 * Runs the mapping against a property's PMS payload and returns:
 *  - `proposals`: mapped entries that don't yet exist in the operator's Konnect state
 *  - `alreadyConfigured`: mapped entries filtered out because the operator has them already
 *  - `unmapped`: PMS types we couldn't resolve
 */
export function buildImportPreview(
  propertyId: string,
  currentlyEnabledCodes: Set<string>,
): { proposals: ProposedImport[]; alreadyConfigured: ProposedImport[]; unmapped: UnmappedPmsAmenity[] } {
  const pmsPayload = mockPmsAmenities[propertyId] || [];
  const proposals: ProposedImport[] = [];
  const alreadyConfigured: ProposedImport[] = [];
  const unmapped: UnmappedPmsAmenity[] = [];

  for (const pms of pmsPayload) {
    const mapping = PMS_MAPPING.find((m) => m.pmsFacilityType === pms.facilityType);
    if (!mapping) {
      // Either an unmapped PMS type from our static unmapped list or a
      // payload entry with no row in the table. Fall back to the static list.
      const known = PMS_UNMAPPED.find(
        (u) => u.pmsLabel.toLowerCase().replace(/\s/g, '') ===
          pms.facilityType.toLowerCase().replace(/\s/g, ''),
      );
      if (known) {
        unmapped.push(known);
      } else {
        unmapped.push({ pmsLabel: pms.facilityType, reason: 'No matching NextPax amenity code' });
      }
      continue;
    }
    const proposal: ProposedImport = {
      mapping,
      pmsSource: pms,
      konnectCategory: amenityCategoryMap[mapping.nextPaxCode] || 'Other',
    };
    if (currentlyEnabledCodes.has(mapping.nextPaxCode)) {
      alreadyConfigured.push(proposal);
    } else {
      proposals.push(proposal);
    }
  }
  return { proposals, alreadyConfigured, unmapped };
}

/**
 * Group proposals by Konnect category in the order categories appear in the
 * main amenity editor, so the modal preview feels like a preview of the very
 * editor the operator is about to update.
 */
export function groupProposalsByCategory(
  proposals: ProposedImport[],
  categoryOrder: readonly string[],
): { category: string; items: ProposedImport[] }[] {
  const byCategory = new Map<string, ProposedImport[]>();
  for (const p of proposals) {
    const list = byCategory.get(p.konnectCategory) || [];
    list.push(p);
    byCategory.set(p.konnectCategory, list);
  }
  const out: { category: string; items: ProposedImport[] }[] = [];
  for (const category of categoryOrder) {
    const items = byCategory.get(category);
    if (items && items.length > 0) {
      out.push({ category, items });
      byCategory.delete(category);
    }
  }
  // Anything left over (e.g. 'Other' from a code not in categoryOrder)
  for (const [category, items] of byCategory) {
    out.push({ category, items });
  }
  return out;
}

/**
 * True if the property has any PMS data available to import — drives the
 * enabled/disabled state and tooltip for the Import from PMS button.
 */
export function hasPmsData(propertyId: string): boolean {
  return (mockPmsAmenities[propertyId] || []).length > 0;
}

/**
 * Pretty "Mar 15, 2026" from an ISO date. Kept simple; the prototype only
 * ever sees YYYY-MM-DD so no TZ fiddling is needed.
 */
export function formatImportDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
