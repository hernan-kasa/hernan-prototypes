import { Property, DescriptionEntry, AmenityEntry, ChannelSyncStatus, SyncLogEntry } from '../types';

export const properties: Property[] = [
  {
    propertyId: 'prop-123',
    propertyName: 'Kasa 2nd Street Austin',
    nextpaxPropertyId: 'NP-456',
    roomTypes: [
      { id: 'rt-001', name: 'Studio Suite' },
      { id: 'rt-002', name: '1BR King' },
      { id: 'rt-003', name: '2BR Suite' },
    ],
  },
  {
    propertyId: 'prop-456',
    propertyName: 'Kasa Downtown Portland',
    nextpaxPropertyId: 'NP-789',
    roomTypes: [
      { id: 'rt-004', name: 'Studio' },
      { id: 'rt-005', name: '1BR Queen' },
    ],
  },
  {
    propertyId: 'prop-789',
    propertyName: 'Kasa River North Chicago',
    nextpaxPropertyId: 'NP-012',
    roomTypes: [
      { id: 'rt-006', name: 'Studio Suite' },
      { id: 'rt-007', name: '1BR King' },
      { id: 'rt-008', name: '2BR Penthouse' },
    ],
  },
];

export const mockDescriptions: Record<string, DescriptionEntry[]> = {
  'prop-123': [
    {
      typeCode: 'house',
      language: 'EN',
      text: 'Welcome to Kasa 2nd Street Austin, a modern apartment community in the heart of downtown Austin. Located steps from Rainey Street and Lady Bird Lake, our fully furnished apartments offer the perfect blend of comfort and convenience for both short and extended stays. Each unit features contemporary furnishings, fully equipped kitchens, and stunning city views.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-10T14:30:00Z',
      lastSyncedAt: '2026-03-10T14:35:00Z',
      lastSyncStatus: 'success',
    },
    {
      typeCode: 'short-introduction',
      language: 'EN',
      text: 'Modern furnished apartments in downtown Austin, steps from Rainey Street and Lady Bird Lake. Fully equipped kitchens, fast WiFi, and stunning city views. Perfect for business or leisure stays.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-10T14:30:00Z',
      lastSyncedAt: '2026-03-10T14:35:00Z',
      lastSyncStatus: 'success',
    },
    {
      typeCode: 'interior',
      language: 'EN',
      text: 'The apartment features hardwood floors throughout, floor-to-ceiling windows, and a modern open-plan layout. The living area includes a comfortable sofa, smart TV, and work desk. The kitchen is equipped with stainless steel appliances, cookware, and all essentials.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-08T10:00:00Z',
      lastSyncedAt: '2026-03-08T10:05:00Z',
      lastSyncStatus: 'success',
    },
    {
      typeCode: 'remarks',
      language: 'EN',
      text: 'Check-in: 4:00 PM | Check-out: 11:00 AM. No smoking. No parties or events. Quiet hours 10 PM – 8 AM. Maximum occupancy must be respected. Pets allowed with prior approval and additional fee.',
      lastModifiedBy: 'carlos.ruiz@kasa.com',
      lastModifiedAt: '2026-03-12T09:00:00Z',
      lastSyncedAt: '2026-03-10T14:35:00Z',
      lastSyncStatus: 'success',
      isDirty: true,
    },
    {
      typeCode: 'fine-print',
      language: 'EN',
      text: 'A valid government-issued photo ID is required at check-in. A security deposit of $250 is authorized on the credit card on file and released within 7 business days after checkout, pending damage inspection. Cancellation policy: free cancellation up to 48 hours before check-in.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-05T16:00:00Z',
      lastSyncedAt: '2026-03-05T16:05:00Z',
      lastSyncStatus: 'success',
    },
    {
      typeCode: 'area',
      language: 'EN',
      text: 'Located in the vibrant 2nd Street District of downtown Austin. Walk to Rainey Street bars and restaurants (5 min), Lady Bird Lake hike and bike trail (3 min), Austin Convention Center (10 min), and South Congress shopping (15 min). Easy access to I-35 and MoPac Expressway.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-10T14:30:00Z',
      lastSyncedAt: '2026-03-10T14:35:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'prop-456': [
    {
      typeCode: 'house',
      language: 'EN',
      text: 'Welcome to Kasa Downtown Portland, a boutique apartment hotel in the Pearl District. Our thoughtfully designed apartments combine Pacific Northwest style with modern amenities. Walking distance to Powell\'s Books, food halls, and the Willamette River waterfront.',
      lastModifiedBy: 'sarah.chen@kasa.com',
      lastModifiedAt: '2026-03-14T11:00:00Z',
      lastSyncedAt: null,
      lastSyncStatus: null,
    },
    {
      typeCode: 'short-introduction',
      language: 'EN',
      text: 'Boutique apartments in Portland\'s Pearl District. Walk to Powell\'s Books and the waterfront. Pacific Northwest style meets modern comfort.',
      lastModifiedBy: 'sarah.chen@kasa.com',
      lastModifiedAt: '2026-03-14T11:00:00Z',
      lastSyncedAt: null,
      lastSyncStatus: null,
    },
  ],
  'rt-001': [
    {
      typeCode: 'house',
      language: 'EN',
      text: 'The Studio Suite offers an efficient open-plan layout with a queen bed, sitting area, and fully equipped kitchenette. Floor-to-ceiling windows provide abundant natural light and partial city views. Ideal for solo travelers or couples.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-10T15:00:00Z',
      lastSyncedAt: '2026-03-10T15:05:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'rt-002': [
    {
      typeCode: 'house',
      language: 'EN',
      text: 'The 1BR King features a separate bedroom with a plush king bed, a spacious living area, and a full kitchen with premium appliances. The open layout and large windows create a bright, airy space perfect for longer stays.',
      lastModifiedBy: 'mel.baker@kasa.com',
      lastModifiedAt: '2026-03-10T15:00:00Z',
      lastSyncedAt: '2026-03-10T15:05:00Z',
      lastSyncStatus: 'success',
    },
  ],
  // — Kasa River North Chicago — fully authored —
  'prop-789': [
    { typeCode: 'house', language: 'EN', text: 'Welcome to Kasa River North Chicago, a modern luxury apartment community in one of Chicago\'s most vibrant neighborhoods. Steps from the Riverwalk, Magnificent Mile, and world-class dining, our fully furnished apartments blend urban sophistication with residential comfort. Floor-to-ceiling windows frame stunning skyline and river views.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Luxury furnished apartments in Chicago\'s River North. Skyline views, full kitchens, rooftop pool. Steps from the Riverwalk and Magnificent Mile.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Each apartment features designer furnishings, hardwood floors, and an open-concept layout. The living area includes a plush sofa, smart TV with streaming, and a dedicated workspace. Kitchens are outfitted with quartz countertops, stainless steel appliances, and all cooking essentials. Bedrooms have premium mattresses with luxury linens.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'unique-benefits', language: 'EN', text: 'Rooftop pool and sun deck with panoramic skyline views. 24/7 fitness center with Peloton bikes. Private resident lounge with co-working space. Contactless check-in via smart lock. Complimentary high-speed WiFi throughout.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'area', language: 'EN', text: 'River North is Chicago\'s premier dining and nightlife district. Walk to the Riverwalk (2 min), Magnificent Mile shopping (5 min), Navy Pier (15 min), and the Art Institute (12 min). Brown and Red Line stations within a 5-minute walk. O\'Hare accessible via Blue Line (45 min).', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'environment', language: 'EN', text: 'The building sits along the north bank of the Chicago River, offering a unique blend of urban energy and waterfront serenity. The neighborhood is walkable and bike-friendly, with Divvy stations nearby.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'remarks', language: 'EN', text: 'Check-in: 4:00 PM | Check-out: 11:00 AM. No smoking anywhere on the property. No parties or events. Quiet hours 10 PM – 8 AM. Maximum occupancy must be respected. Pets welcome with prior approval and $75 pet fee.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'fine-print', language: 'EN', text: 'Government-issued photo ID required at check-in. A $300 security deposit hold is placed on the credit card at booking and released within 7 business days after checkout. Free cancellation up to 72 hours before check-in. Early check-in and late check-out available upon request, subject to availability.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'house-manual', language: 'EN', text: 'Smart lock access code is sent 24 hours before check-in. WiFi network: KasaGuest, password provided at check-in. Thermostat is programmable — please set to 68°F when leaving. Trash chute is at the end of each hallway. Recycling bins are in the parking garage. Building concierge available 8 AM – 10 PM in the lobby.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'headline', language: 'EN', text: 'Luxury River North apartments with skyline views and rooftop pool', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'tips-of-the-owner', language: 'EN', text: 'Try the Chicago Riverwalk for morning coffee at Tiny Tapp. For deep-dish pizza, Lou Malnati\'s on State St is the local favorite (skip Giordano\'s). The architecture boat tour from the dock across the street is a must-do. For groceries, there\'s a Whole Foods on Huron St, 3 blocks away.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'driving-directions', language: 'EN', text: 'From O\'Hare: Take I-90/94 East to Ohio St exit. Turn right on Ohio, left on Wabash. Building is on the right. From Midway: Take I-55 North to I-90/94 East, then follow O\'Hare directions. Valet parking available at the building entrance.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'distances', language: 'EN', text: 'Chicago Riverwalk: 200m. Magnificent Mile: 500m. Navy Pier: 1.5km. Art Institute of Chicago: 1.2km. Willis Tower: 2km. Wrigley Field: 6km. O\'Hare Airport: 27km. Midway Airport: 18km. Chicago Union Station: 1.5km.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'additional-costs', language: 'EN', text: 'Pet fee: $75 per stay. Valet parking: $45/night. Self-park garage: $30/night. Early check-in (before 2 PM): $50 if available. Late check-out (after 1 PM): $50 if available.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'arrival-days', language: 'EN', text: 'Arrivals accepted any day of the week. Check-in time: 4:00 PM. Early check-in may be available upon request.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'discounts', language: 'EN', text: 'Weekly stays (7+ nights): 10% discount applied automatically. Monthly stays (28+ nights): 20% discount applied automatically. Returning guest discount: 5% — contact us directly.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'minimum-stay-length', language: 'EN', text: 'Minimum stay: 2 nights. Holiday periods (Thanksgiving, Christmas, New Year\'s): 3-night minimum.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'opening-hours', language: 'EN', text: 'Building concierge: 8 AM – 10 PM daily. Rooftop pool: 7 AM – 10 PM (Memorial Day – Labor Day). Fitness center: 24/7. Resident lounge: 6 AM – 11 PM.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'optional-costs', language: 'EN', text: 'Mid-stay cleaning: $85 (available for stays of 5+ nights). Extra towel set: $15. Pack-and-play crib rental: complimentary upon request.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'price-table', language: 'EN', text: 'Rates vary by season and unit type. Studio Suites from $159/night. 1BR Kings from $199/night. 2BR Penthouses from $349/night. Weekly and monthly discounts available. See listing for current pricing.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-winter-text', language: 'EN', text: 'Cozy up in our heated apartments with skyline views of Chicago\'s winter wonderland. Steps from Michigan Ave holiday shopping and Christkindlmarket.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'winter-text', language: 'EN', text: 'Chicago winters are iconic — and our River North apartments put you at the center of it. Bundle up for a walk along the frozen Riverwalk, then warm up at one of dozens of neighborhood restaurants. The rooftop is closed for the season, but the fitness center and resident lounge keep you comfortable. Michigan Ave holiday lights and Christkindlmarket are a 10-minute walk.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'why-this-property', language: 'EN', text: 'Best-in-class River North location with direct Riverwalk access. Rooftop pool and full amenity suite. Every unit has skyline or river views. Premium finishes and full-size kitchens in every apartment.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T10:00:00Z', lastSyncedAt: '2026-03-20T10:05:00Z', lastSyncStatus: 'success' },
  ],
  'rt-006': [
    { typeCode: 'house', language: 'EN', text: 'The Studio Suite is a smartly designed open-plan apartment with a queen bed, dedicated living area, and fully equipped kitchenette. Large windows offer city views and fill the space with natural light. Ideal for solo travelers or couples visiting Chicago.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Modern studio with city views in River North. Queen bed, kitchenette, smart TV, and fast WiFi.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Open-concept layout with hardwood floors and floor-to-ceiling windows. Queen bed with premium linens, a compact living area with sofa and smart TV, and a kitchenette with microwave, mini-fridge, coffee maker, and basic cookware.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
  ],
  'rt-007': [
    { typeCode: 'house', language: 'EN', text: 'The 1BR King offers a separate bedroom with a plush king bed, a spacious living room, and a full kitchen with premium appliances. Floor-to-ceiling windows frame river or skyline views. In-unit washer/dryer for added convenience.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Spacious 1BR with king bed, full kitchen, river views, and in-unit laundry in River North Chicago.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Separate bedroom with king bed and blackout curtains. Living room with sectional sofa, work desk, and 55" smart TV. Full kitchen with quartz countertops, dishwasher, oven, and all cooking essentials. In-unit washer and dryer.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
  ],
  'rt-008': [
    { typeCode: 'house', language: 'EN', text: 'The 2BR Penthouse is our flagship unit — a top-floor corner apartment with panoramic skyline views, two bedrooms, two full bathrooms, and a chef\'s kitchen. The wraparound windows and private balcony create an unforgettable Chicago experience.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Top-floor penthouse with panoramic skyline views, 2 bedrooms, private balcony, and chef\'s kitchen in River North.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Corner unit with wraparound floor-to-ceiling windows. Primary bedroom with king bed and en-suite bathroom. Second bedroom with queen bed. Chef\'s kitchen with gas range, double oven, and wine cooler. Spacious living and dining area. Private balcony with skyline views. In-unit washer/dryer.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-03-20T11:00:00Z', lastSyncedAt: '2026-03-20T11:05:00Z', lastSyncStatus: 'success' },
  ],
};

// Amenities enabled for Kasa 2nd Street Austin (prop-123)
// Maps amenity code → { value, isLockedImport }
export const mockPropertyAmenities: Record<string, AmenityEntry[]> = {
  'prop-123': [
    // Bedroom & Sleeping
    { code: 'B02', value: 1, isLockedImport: false },     // Number of bedrooms
    { code: 'B17', value: 2, isLockedImport: false },     // Total number of beds
    { code: 'B18', value: true, isLockedImport: false },   // Bed Linen provided
    { code: 'G02', value: 1, isLockedImport: false },     // Number of king size beds
    { code: 'E11', value: true, isLockedImport: false },   // Essentials (towels, sheets, soap, etc.)
    { code: 'B82', value: true, isLockedImport: false },   // Extra long beds

    // Bathroom
    { code: 'A18', value: true, isLockedImport: false },   // Bath or Shower
    { code: 'A44', value: 'P', isLockedImport: false },    // Bathroom — Private
    { code: 'D06', value: 'W', isLockedImport: false },    // Shower — walk in
    { code: 'H41', value: true, isLockedImport: false },   // Hair dryer
    { code: 'B30', value: true, isLockedImport: false },   // Bathroom amenities (free toiletries)
    { code: 'B01', value: 1, isLockedImport: false },     // Number of bathrooms
    { code: 'T07', value: 1, isLockedImport: false },     // Number of toilets
    { code: 'C34', value: true, isLockedImport: false },   // Shampoo
    { code: 'C35', value: true, isLockedImport: false },   // Conditioner
    { code: 'C36', value: true, isLockedImport: false },   // Body soap
    { code: 'B99', value: true, isLockedImport: false },   // Toilet paper

    // Kitchen & Cooking
    { code: 'K04', value: true, isLockedImport: false },   // Kitchen
    { code: 'C08', value: 'E', isLockedImport: true },     // Kitchen stove — electric
    { code: 'C11', value: 'R', isLockedImport: true },     // Coffee maker — regular
    { code: 'D01', value: true, isLockedImport: true },    // Dishwasher
    { code: 'F04', value: 'Y', isLockedImport: true },     // Fridge — available
    { code: 'M02', value: true, isLockedImport: false },   // Microwave oven
    { code: 'O01', value: 'E', isLockedImport: false },    // Oven — electric
    { code: 'T06', value: true, isLockedImport: false },   // Toaster
    { code: 'E01', value: true, isLockedImport: false },   // Electric kettle
    { code: 'K08', value: true, isLockedImport: false },   // Kitchen utensils
    { code: 'C17', value: true, isLockedImport: false },   // Cooking basics (pots and pans)
    { code: 'A28', value: true, isLockedImport: false },   // Plates and bowls
    { code: 'C31', value: true, isLockedImport: false },   // Wine glasses
    { code: 'C30', value: true, isLockedImport: false },   // Trash cans
    { code: 'B16', value: true, isLockedImport: false },   // Blender

    // Living Space & Furniture
    { code: 'A22', value: 'Y', isLockedImport: false },    // Desk — available
    { code: 'A29', value: 'S', isLockedImport: false },    // Sitting area — with sofa/chair
    { code: 'C44', value: true, isLockedImport: false },   // Dining table
    { code: 'H42', value: true, isLockedImport: false },   // Hangers
    { code: 'A38', value: 'Y', isLockedImport: false },    // Closet — available
    { code: 'B88', value: true, isLockedImport: false },   // Wooden / Parquet floor

    // Climate Control
    { code: 'A01', value: true, isLockedImport: false },   // Airconditioning
    { code: 'H40', value: 'C', isLockedImport: false },    // Heating — central
    { code: 'A46', value: true, isLockedImport: false },   // Self-controlled heating/cooling

    // Entertainment & Technology
    { code: 'W07', value: 'Y', isLockedImport: false },    // WiFi — Free
    { code: 'C66', value: true, isLockedImport: false },   // Smart TV
    { code: 'F10', value: true, isLockedImport: false },   // Flat-screen TV
    { code: 'N07', value: true, isLockedImport: false },   // Netflix
    { code: 'I02', value: 'C', isLockedImport: false },    // Ethernet Internet — cable

    // Laundry & Housekeeping
    { code: 'W01', value: true, isLockedImport: false },   // Washing machine
    { code: 'D08', value: true, isLockedImport: false },   // Dryer
    { code: 'I03', value: true, isLockedImport: false },   // Iron
    { code: 'I04', value: true, isLockedImport: false },   // Ironing board
    { code: 'V03', value: true, isLockedImport: false },   // Vacuum cleaner

    // Safety & Security
    { code: 'S44', value: true, isLockedImport: false },   // Smoke alarm
    { code: 'C18', value: true, isLockedImport: false },   // Carbon monoxide detector
    { code: 'F14', value: true, isLockedImport: false },   // Fire extinguisher
    { code: 'F13', value: true, isLockedImport: false },   // First Aid Kit
    { code: 'S32', value: true, isLockedImport: false },   // Safe
    { code: 'A95', value: true, isLockedImport: false },   // Key card access
    { code: 'A64', value: true, isLockedImport: false },   // CCTV in common areas

    // Parking & Transport
    { code: 'G01', value: 'G', isLockedImport: false },    // Parking — Garage
    { code: 'E03', value: true, isLockedImport: true },    // Elevator
    { code: 'E06', value: true, isLockedImport: false },   // Electric vehicle charging station
    { code: 'P13', value: 2, isLockedImport: false },     // Number of parking lots

    // Outdoor & Garden
    { code: 'B11', value: true, isLockedImport: false },   // Balcony
    { code: 'T02', value: true, isLockedImport: false },   // Terrace

    // Pool, Spa & Wellness
    { code: 'F12', value: true, isLockedImport: false },   // Fitness/Gym

    // Property Details
    { code: 'P06', value: 65, isLockedImport: false },     // Surface area (m2)
    { code: 'R07', value: 3, isLockedImport: false },     // Total number of rooms
    { code: 'D99', value: 12, isLockedImport: false },    // Number of floors
    { code: 'N01', value: true, isLockedImport: false },   // Non-smokers
    { code: 'S37', value: 'N', isLockedImport: false },    // Smoking allowed — No

    // Policies
    { code: 'P02', value: 'R', isLockedImport: false },    // Pets — on request
  ],
  'prop-456': [
    // Fewer amenities — newer property, less populated
    { code: 'B02', value: 1, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'E11', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'Y', isLockedImport: true },
    { code: 'A01', value: true, isLockedImport: false },
    { code: 'H40', value: 'C', isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'F10', value: true, isLockedImport: false },
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
    { code: 'I03', value: true, isLockedImport: false },
    { code: 'S44', value: true, isLockedImport: false },
    { code: 'C18', value: true, isLockedImport: false },
    { code: 'F14', value: true, isLockedImport: false },
    { code: 'E03', value: true, isLockedImport: true },
    { code: 'G01', value: 'S', isLockedImport: false },
    { code: 'N01', value: true, isLockedImport: false },
  ],
  // Room types — Austin
  'rt-001': [ // Studio Suite
    { code: 'B02', value: 0, isLockedImport: false },     // Studio — 0 separate bedrooms
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },     // 1 queen bed
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K03', value: 'Y', isLockedImport: false },   // Kitchenette
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'Y', isLockedImport: true },
    { code: 'A43', value: true, isLockedImport: false },   // Mini-refrigerator
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'P06', value: 35, isLockedImport: false },    // 35 m2
  ],
  'rt-002': [ // 1BR King
    { code: 'B02', value: 1, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'G02', value: 1, isLockedImport: false },     // 1 king bed
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },   // Full kitchen
    { code: 'C08', value: 'E', isLockedImport: true },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'F', isLockedImport: true },    // Fridge with freezer
    { code: 'D01', value: true, isLockedImport: true },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'A22', value: 'Y', isLockedImport: false },
    { code: 'A29', value: 'S', isLockedImport: false },
    { code: 'P06', value: 55, isLockedImport: false },    // 55 m2
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
  ],
  'rt-003': [ // 2BR Suite
    { code: 'B02', value: 2, isLockedImport: false },
    { code: 'B17', value: 3, isLockedImport: false },
    { code: 'G02', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },
    { code: 'S03', value: 1, isLockedImport: false },     // 1 sofa bed
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'B01', value: 2, isLockedImport: false },     // 2 bathrooms
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'C08', value: 'E', isLockedImport: true },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'F', isLockedImport: true },
    { code: 'D01', value: true, isLockedImport: true },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'A22', value: 'Y', isLockedImport: false },
    { code: 'A29', value: 'S', isLockedImport: false },
    { code: 'P06', value: 85, isLockedImport: false },    // 85 m2
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
    { code: 'I03', value: true, isLockedImport: false },
    { code: 'B11', value: true, isLockedImport: false },  // Balcony
  ],
  // — Kasa River North Chicago — fully populated —
  'prop-789': [
    // Bedroom & Sleeping
    { code: 'B02', value: 1, isLockedImport: false },
    { code: 'B17', value: 2, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'G02', value: 1, isLockedImport: false },
    { code: 'E11', value: true, isLockedImport: false },
    { code: 'B82', value: true, isLockedImport: false },
    { code: 'A36', value: true, isLockedImport: false },
    { code: 'C43', value: true, isLockedImport: false },
    { code: 'C48', value: true, isLockedImport: false },
    // Bathroom
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'B01', value: 1, isLockedImport: false },
    { code: 'T07', value: 1, isLockedImport: false },
    { code: 'C34', value: true, isLockedImport: false },
    { code: 'C35', value: true, isLockedImport: false },
    { code: 'C36', value: true, isLockedImport: false },
    { code: 'B99', value: true, isLockedImport: false },
    { code: 'A02', value: true, isLockedImport: false },
    // Kitchen & Cooking
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'C08', value: 'G', isLockedImport: false },
    { code: 'C11', value: 'R', isLockedImport: false },
    { code: 'D01', value: true, isLockedImport: false },
    { code: 'F04', value: 'F', isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'O01', value: 'G', isLockedImport: false },
    { code: 'T06', value: true, isLockedImport: false },
    { code: 'E01', value: true, isLockedImport: false },
    { code: 'K08', value: true, isLockedImport: false },
    { code: 'C17', value: true, isLockedImport: false },
    { code: 'A28', value: true, isLockedImport: false },
    { code: 'C31', value: true, isLockedImport: false },
    { code: 'C30', value: true, isLockedImport: false },
    { code: 'B16', value: true, isLockedImport: false },
    // Living Space & Furniture
    { code: 'A22', value: 'C', isLockedImport: false },
    { code: 'A29', value: 'S', isLockedImport: false },
    { code: 'C44', value: true, isLockedImport: false },
    { code: 'H42', value: true, isLockedImport: false },
    { code: 'A38', value: 'Y', isLockedImport: false },
    { code: 'B88', value: true, isLockedImport: false },
    // Climate Control
    { code: 'A01', value: true, isLockedImport: false },
    { code: 'H40', value: 'C', isLockedImport: false },
    { code: 'A46', value: true, isLockedImport: false },
    // Entertainment & Technology
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'F10', value: true, isLockedImport: false },
    { code: 'N07', value: true, isLockedImport: false },
    { code: 'I02', value: 'C', isLockedImport: false },
    // Laundry & Housekeeping
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
    { code: 'I03', value: true, isLockedImport: false },
    { code: 'I04', value: true, isLockedImport: false },
    { code: 'V03', value: true, isLockedImport: false },
    // Safety & Security
    { code: 'S44', value: true, isLockedImport: false },
    { code: 'C18', value: true, isLockedImport: false },
    { code: 'F14', value: true, isLockedImport: false },
    { code: 'F13', value: true, isLockedImport: false },
    { code: 'S32', value: true, isLockedImport: false },
    { code: 'A95', value: true, isLockedImport: false },
    { code: 'A64', value: true, isLockedImport: false },
    // Parking & Transport
    { code: 'G01', value: 'V', isLockedImport: false },
    { code: 'E03', value: true, isLockedImport: false },
    { code: 'P13', value: 1, isLockedImport: false },
    // Outdoor
    { code: 'B11', value: true, isLockedImport: false },
    // Pool & Wellness
    { code: 'F12', value: true, isLockedImport: false },
    { code: 'S61', value: true, isLockedImport: false },
    // Property Details
    { code: 'P06', value: 70, isLockedImport: false },
    { code: 'R07', value: 3, isLockedImport: false },
    { code: 'D99', value: 42, isLockedImport: false },
    { code: 'N01', value: true, isLockedImport: false },
    { code: 'S37', value: 'N', isLockedImport: false },
    // Policies
    { code: 'P02', value: 'R', isLockedImport: false },
  ],
  'rt-006': [ // Studio Suite — Chicago
    { code: 'B02', value: 0, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K03', value: 'Y', isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'Y', isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'P06', value: 38, isLockedImport: false },
    { code: 'A01', value: true, isLockedImport: false },
    { code: 'H40', value: 'C', isLockedImport: false },
  ],
  'rt-007': [ // 1BR King — Chicago
    { code: 'B02', value: 1, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'G02', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'C08', value: 'G', isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'F', isLockedImport: false },
    { code: 'D01', value: true, isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'A22', value: 'C', isLockedImport: false },
    { code: 'A29', value: 'S', isLockedImport: false },
    { code: 'P06', value: 60, isLockedImport: false },
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
    { code: 'A01', value: true, isLockedImport: false },
    { code: 'H40', value: 'C', isLockedImport: false },
  ],
  'rt-008': [ // 2BR Penthouse — Chicago
    { code: 'B02', value: 2, isLockedImport: false },
    { code: 'B17', value: 2, isLockedImport: false },
    { code: 'G02', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'B01', value: 2, isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'C08', value: 'G', isLockedImport: false },
    { code: 'O01', value: 'G', isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'F', isLockedImport: false },
    { code: 'D01', value: true, isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'A22', value: 'C', isLockedImport: false },
    { code: 'A29', value: 'S', isLockedImport: false },
    { code: 'P06', value: 110, isLockedImport: false },
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
    { code: 'I03', value: true, isLockedImport: false },
    { code: 'B11', value: true, isLockedImport: false },
    { code: 'A01', value: true, isLockedImport: false },
    { code: 'H40', value: 'C', isLockedImport: false },
    { code: 'A02', value: true, isLockedImport: false },
  ],
  // Room types — Portland
  'rt-004': [ // Studio
    { code: 'B02', value: 0, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'K03', value: 'Y', isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'P06', value: 30, isLockedImport: false },
  ],
  'rt-005': [ // 1BR Queen
    { code: 'B02', value: 1, isLockedImport: false },
    { code: 'B17', value: 1, isLockedImport: false },
    { code: 'Q02', value: 1, isLockedImport: false },
    { code: 'B18', value: true, isLockedImport: false },
    { code: 'A18', value: true, isLockedImport: false },
    { code: 'A44', value: 'P', isLockedImport: false },
    { code: 'D06', value: 'W', isLockedImport: false },
    { code: 'H41', value: true, isLockedImport: false },
    { code: 'B30', value: true, isLockedImport: false },
    { code: 'K04', value: true, isLockedImport: false },
    { code: 'M02', value: true, isLockedImport: false },
    { code: 'F04', value: 'Y', isLockedImport: true },
    { code: 'C66', value: true, isLockedImport: false },
    { code: 'W07', value: 'Y', isLockedImport: false },
    { code: 'A22', value: 'Y', isLockedImport: false },
    { code: 'P06', value: 45, isLockedImport: false },
    { code: 'W01', value: true, isLockedImport: false },
    { code: 'D08', value: true, isLockedImport: false },
  ],
};

export const mockSyncStatus: Record<string, ChannelSyncStatus[]> = {
  'prop-123': [
    {
      channelId: 'BOO142',
      channelName: 'Booking.com',
      contentSyncEnabled: false,
      disableReason: 'Duplicate tax issue (Feb 2026)',
      lastSyncAt: '2026-02-01T10:00:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'EXP270',
      channelName: 'Expedia',
      contentSyncEnabled: false,
      disableReason: 'Never enabled',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'AIR298',
      channelName: 'Airbnb',
      contentSyncEnabled: true,
      lastSyncAt: '2026-03-15T09:00:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'prop-789': [
    {
      channelId: 'BOO144',
      channelName: 'Booking.com',
      contentSyncEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'EXP272',
      channelName: 'Expedia',
      contentSyncEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'AIR300',
      channelName: 'Airbnb',
      contentSyncEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'prop-456': [
    {
      channelId: 'BOO143',
      channelName: 'Booking.com',
      contentSyncEnabled: false,
      disableReason: 'Duplicate tax issue (Feb 2026)',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'EXP271',
      channelName: 'Expedia',
      contentSyncEnabled: false,
      disableReason: 'Never enabled',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'AIR299',
      channelName: 'Airbnb',
      contentSyncEnabled: true,
      lastSyncAt: '2026-03-14T12:00:00Z',
      lastSyncStatus: 'success',
    },
  ],
};

export const mockSyncLog: Record<string, SyncLogEntry[]> = {
  'prop-123': [
    { id: 'log-1', timestamp: '2026-03-15T09:00:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0315-001' },
    { id: 'log-2', timestamp: '2026-03-14T16:30:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0314-003' },
    { id: 'log-3', timestamp: '2026-03-12T11:00:00Z', operator: 'carlos.ruiz@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'failure', nextpaxRequestId: 'NPX-2026-0312-001' },
    { id: 'log-4', timestamp: '2026-03-10T14:35:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0310-002' },
    { id: 'log-5', timestamp: '2026-02-01T10:00:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Booking.com', result: 'success', nextpaxRequestId: 'NPX-2026-0201-001' },
  ],
  'prop-456': [
    { id: 'log-6', timestamp: '2026-03-14T12:00:00Z', operator: 'sarah.chen@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0314-004' },
  ],
  'prop-789': [
    { id: 'log-7', timestamp: '2026-03-20T10:10:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Booking.com', result: 'success', nextpaxRequestId: 'NPX-2026-0320-001' },
    { id: 'log-8', timestamp: '2026-03-20T10:10:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Expedia', result: 'success', nextpaxRequestId: 'NPX-2026-0320-002' },
    { id: 'log-9', timestamp: '2026-03-20T10:10:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0320-003' },
    { id: 'log-10', timestamp: '2026-03-20T10:08:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Booking.com', result: 'success', nextpaxRequestId: 'NPX-2026-0320-004' },
    { id: 'log-11', timestamp: '2026-03-20T10:08:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Expedia', result: 'success', nextpaxRequestId: 'NPX-2026-0320-005' },
    { id: 'log-12', timestamp: '2026-03-20T10:08:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0320-006' },
  ],
};
