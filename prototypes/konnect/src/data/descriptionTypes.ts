import { DescriptionType } from '../types';

export const descriptionTypes: DescriptionType[] = [
  // Core descriptions
  { typeCode: 'house', label: 'Property Description', channels: ['BDC', 'Airbnb', 'Expedia'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'short-introduction', label: 'Short Introduction', channels: ['BDC', 'Airbnb'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'interior', label: 'Interior', channels: ['BDC', 'Airbnb'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'unique-benefits', label: 'Unique Benefits', channels: ['BDC', 'Airbnb'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'area', label: 'Area / Neighborhood', channels: ['BDC', 'Airbnb'], bdcComposite: 'neighborhood_info', priority: 'core' },
  { typeCode: 'environment', label: 'Environment', channels: ['BDC', 'Airbnb'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'remarks', label: 'House Rules / Remarks', channels: ['BDC', 'Airbnb', 'Expedia'], bdcComposite: 'welcome_message', priority: 'core' },
  { typeCode: 'fine-print', label: 'Fine Print / Terms', channels: ['BDC', 'Airbnb', 'Expedia'], bdcComposite: 'owner_info', priority: 'core' },
  { typeCode: 'house-manual', label: 'Manual for Guests', channels: ['BDC', 'Airbnb'], bdcComposite: 'owner_info', priority: 'core' },

  // BDC supplementary
  { typeCode: 'headline', label: 'Headline', channels: ['BDC'], bdcComposite: 'welcome_message', priority: 'bdc-supplementary' },
  { typeCode: 'tips-of-the-owner', label: 'Host Tips', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-supplementary' },
  { typeCode: 'driving-directions', label: 'Driving Directions', channels: ['BDC'], bdcComposite: 'neighborhood_info', priority: 'bdc-supplementary' },
  { typeCode: 'distances', label: 'Distances', channels: ['BDC'], bdcComposite: 'neighborhood_info', priority: 'bdc-supplementary' },

  // BDC specialized
  { typeCode: 'additional-costs', label: 'Additional Costs', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'arrival-days', label: 'Arrival Days', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'discounts', label: 'Discounts', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'minimum-stay-length', label: 'Minimum Stay Length', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'opening-hours', label: 'Opening Hours', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'optional-costs', label: 'Optional Costs', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'price-table', label: 'Price Table', channels: ['BDC'], bdcComposite: 'owner_info', priority: 'bdc-specialized' },
  { typeCode: 'short-winter-text', label: 'Short Winter Text', channels: ['BDC'], bdcComposite: 'welcome_message', priority: 'bdc-specialized' },
  { typeCode: 'winter-text', label: 'Winter Text', channels: ['BDC'], bdcComposite: 'welcome_message', priority: 'bdc-specialized' },
  { typeCode: 'why-this-property', label: 'Why This Property', channels: ['BDC'], bdcComposite: 'welcome_message', priority: 'bdc-specialized' },
];

export const compositeLabels: Record<string, string> = {
  welcome_message: 'Welcome Message',
  neighborhood_info: 'Neighborhood Info',
  owner_info: 'Owner Info',
};

export const BDC_COMPOSITE_LIMIT = 1990;
export const AIRBNB_SUMMARY_LIMIT = 500;
