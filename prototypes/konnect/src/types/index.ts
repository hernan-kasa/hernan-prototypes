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

export interface AmenityEntry {
  code: string;
  value: string | number | boolean; // boolean for toggles, string for option attribute, number for numeric
  isLockedImport: boolean;
}

export interface ChannelSyncStatus {
  channelId: string;
  channelName: string;
  contentSyncEnabled: boolean;
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

export interface RoomType {
  id: string;
  name: string;
}

export interface Property {
  propertyId: string;
  propertyName: string;
  nextpaxPropertyId: string;
  roomTypes: RoomType[];
}
