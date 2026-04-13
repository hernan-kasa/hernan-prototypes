export type Channel = 'BDC' | 'Airbnb' | 'Expedia';

export type DescriptionPriority = 'core' | 'bdc-supplementary' | 'bdc-specialized';

export interface DescriptionType {
  typeCode: string;
  label: string;
  channels: Channel[];
  bdcComposite: 'welcome_message' | 'neighborhood_info' | 'owner_info' | null;
  priority: DescriptionPriority;
}

export interface DescriptionEntry {
  typeCode: string;
  language: string;
  text: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  lastSyncedAt: string | null;
  lastSyncStatus: 'success' | 'failure' | 'pending' | null;
  isDirty?: boolean; // differs from NextPax
}

// Matches NextPax PropertyAmenitiesInformation shape
export interface AmenityEntry {
  typeCode: string;
  attributes: string[]; // boolean: [], options: ['P'], number: ['2']
  seededFromPMS?: boolean; // Imported via the "Import from PMS" flow
}

// Matches channel-management IKasaPropertyChannelSetting shape
export interface ChannelSyncStatus {
  channelId: string;
  channelName: string;
  enabled: boolean;        // channel active for rates/availability
  contentEnabled: boolean; // content sync active (separate from channel enabled)
  disableReason?: string;
  lastSyncAt: string | null;
  lastSyncStatus: 'success' | 'failure' | 'pending' | null;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  contentType: 'descriptions' | 'amenities';
  channel: string;
  result: 'success' | 'failure';
  nextpaxRequestId: string;
}

export interface RoomTypeChannelLink {
  channel: Channel;
  url: string;
  listingId?: string; // For Airbnb — shown as text since users need to log into the right account
}

export interface RoomType {
  id: string;
  name: string; // external/display title
  internalTitle?: string;
  nickname?: string;
  setupInfo: string; // e.g., "Studio", "1BR King"
  maxOccupancy: number;
  channelLinks: RoomTypeChannelLink[];
}

export interface Property {
  propertyId: string;
  propertyName: string;
  nextpaxPropertyId: string;
  roomTypes: RoomType[];
}
