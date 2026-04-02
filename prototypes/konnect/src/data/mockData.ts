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
    { typeCode: 'B02', attributes: ['1'] },     // Number of bedrooms
    { typeCode: 'B17', attributes: ['2'] },     // Total number of beds
    { typeCode: 'B18', attributes: [] },   // Bed Linen provided
    { typeCode: 'G02', attributes: ['1'] },     // Number of king size beds
    { typeCode: 'E11', attributes: [] },   // Essentials (towels, sheets, soap, etc.)
    { typeCode: 'B82', attributes: [] },   // Extra long beds

    // Bathroom
    { typeCode: 'A18', attributes: [] },   // Bath or Shower
    { typeCode: 'A44', attributes: ['P'] },    // Bathroom — Private
    { typeCode: 'D06', attributes: ['W'] },    // Shower — walk in
    { typeCode: 'H41', attributes: [] },   // Hair dryer
    { typeCode: 'B30', attributes: [] },   // Bathroom amenities (free toiletries)
    { typeCode: 'B01', attributes: ['1'] },     // Number of bathrooms
    { typeCode: 'T07', attributes: ['1'] },     // Number of toilets
    { typeCode: 'C34', attributes: [] },   // Shampoo
    { typeCode: 'C35', attributes: [] },   // Conditioner
    { typeCode: 'C36', attributes: [] },   // Body soap
    { typeCode: 'B99', attributes: [] },   // Toilet paper

    // Kitchen & Cooking
    { typeCode: 'K04', attributes: [] },   // Kitchen
    { typeCode: 'C08', attributes: ['E'] },     // Kitchen stove — electric
    { typeCode: 'C11', attributes: ['R'] },     // Coffee maker — regular
    { typeCode: 'D01', attributes: [] },    // Dishwasher
    { typeCode: 'F04', attributes: ['Y'] },     // Fridge — available
    { typeCode: 'M02', attributes: [] },   // Microwave oven
    { typeCode: 'O01', attributes: ['E'] },    // Oven — electric
    { typeCode: 'T06', attributes: [] },   // Toaster
    { typeCode: 'E01', attributes: [] },   // Electric kettle
    { typeCode: 'K08', attributes: [] },   // Kitchen utensils
    { typeCode: 'C17', attributes: [] },   // Cooking basics (pots and pans)
    { typeCode: 'A28', attributes: [] },   // Plates and bowls
    { typeCode: 'C31', attributes: [] },   // Wine glasses
    { typeCode: 'C30', attributes: [] },   // Trash cans
    { typeCode: 'B16', attributes: [] },   // Blender

    // Living Space & Furniture
    { typeCode: 'A22', attributes: ['Y'] },    // Desk — available
    { typeCode: 'A29', attributes: ['S'] },    // Sitting area — with sofa/chair
    { typeCode: 'C44', attributes: [] },   // Dining table
    { typeCode: 'H42', attributes: [] },   // Hangers
    { typeCode: 'A38', attributes: ['Y'] },    // Closet — available
    { typeCode: 'B88', attributes: [] },   // Wooden / Parquet floor

    // Climate Control
    { typeCode: 'A01', attributes: [] },   // Airconditioning
    { typeCode: 'H40', attributes: ['C'] },    // Heating — central
    { typeCode: 'A46', attributes: [] },   // Self-controlled heating/cooling

    // Entertainment & Technology
    { typeCode: 'W07', attributes: ['Y'] },    // WiFi — Free
    { typeCode: 'C66', attributes: [] },   // Smart TV
    { typeCode: 'F10', attributes: [] },   // Flat-screen TV
    { typeCode: 'N07', attributes: [] },   // Netflix
    { typeCode: 'I02', attributes: ['C'] },    // Ethernet Internet — cable

    // Laundry & Housekeeping
    { typeCode: 'W01', attributes: [] },   // Washing machine
    { typeCode: 'D08', attributes: [] },   // Dryer
    { typeCode: 'I03', attributes: [] },   // Iron
    { typeCode: 'I04', attributes: [] },   // Ironing board
    { typeCode: 'V03', attributes: [] },   // Vacuum cleaner

    // Safety & Security
    { typeCode: 'S44', attributes: [] },   // Smoke alarm
    { typeCode: 'C18', attributes: [] },   // Carbon monoxide detector
    { typeCode: 'F14', attributes: [] },   // Fire extinguisher
    { typeCode: 'F13', attributes: [] },   // First Aid Kit
    { typeCode: 'S32', attributes: [] },   // Safe
    { typeCode: 'A95', attributes: [] },   // Key card access
    { typeCode: 'A64', attributes: [] },   // CCTV in common areas

    // Parking & Transport
    { typeCode: 'G01', attributes: ['G'] },    // Parking — Garage
    { typeCode: 'E03', attributes: [] },    // Elevator
    { typeCode: 'E06', attributes: [] },   // Electric vehicle charging station
    { typeCode: 'P13', attributes: ['2'] },     // Number of parking lots

    // Outdoor & Garden
    { typeCode: 'B11', attributes: [] },   // Balcony
    { typeCode: 'T02', attributes: [] },   // Terrace

    // Pool, Spa & Wellness
    { typeCode: 'F12', attributes: [] },   // Fitness/Gym

    // Property Details
    { typeCode: 'P06', attributes: ['65'] },     // Surface area (m2)
    { typeCode: 'R07', attributes: ['3'] },     // Total number of rooms
    { typeCode: 'D99', attributes: ['12'] },    // Number of floors
    { typeCode: 'N01', attributes: [] },   // Non-smokers
    { typeCode: 'S37', attributes: ['N'] },    // Smoking allowed — No

    // Policies
    { typeCode: 'P02', attributes: ['R'] },    // Pets — on request
  ],
  'prop-456': [
    // Fewer amenities — newer property, less populated
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'E11', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'A01', attributes: [] },
    { typeCode: 'H40', attributes: ['C'] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'F10', attributes: [] },
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    { typeCode: 'I03', attributes: [] },
    { typeCode: 'S44', attributes: [] },
    { typeCode: 'C18', attributes: [] },
    { typeCode: 'F14', attributes: [] },
    { typeCode: 'E03', attributes: [] },
    { typeCode: 'G01', attributes: ['S'] },
    { typeCode: 'N01', attributes: [] },
  ],
  // Room types — Austin
  'rt-001': [ // Studio Suite
    { typeCode: 'B02', attributes: ['0'] },     // Studio — 0 separate bedrooms
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },     // 1 queen bed
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K03', attributes: ['Y'] },   // Kitchenette
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'A43', attributes: [] },   // Mini-refrigerator
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'P06', attributes: ['35'] },    // 35 m2
  ],
  'rt-002': [ // 1BR King
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'G02', attributes: ['1'] },     // 1 king bed
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },   // Full kitchen
    { typeCode: 'C08', attributes: ['E'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['F'] },    // Fridge with freezer
    { typeCode: 'D01', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['Y'] },
    { typeCode: 'A29', attributes: ['S'] },
    { typeCode: 'P06', attributes: ['55'] },    // 55 m2
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
  ],
  'rt-003': [ // 2BR Suite
    { typeCode: 'B02', attributes: ['2'] },
    { typeCode: 'B17', attributes: ['3'] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },
    { typeCode: 'S03', attributes: ['1'] },     // 1 sofa bed
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'B01', attributes: ['2'] },     // 2 bathrooms
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'C08', attributes: ['E'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['F'] },
    { typeCode: 'D01', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['Y'] },
    { typeCode: 'A29', attributes: ['S'] },
    { typeCode: 'P06', attributes: ['85'] },    // 85 m2
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    { typeCode: 'I03', attributes: [] },
    { typeCode: 'B11', attributes: [] },  // Balcony
  ],
  // — Kasa River North Chicago — fully populated —
  'prop-789': [
    // Bedroom & Sleeping
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['2'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'E11', attributes: [] },
    { typeCode: 'B82', attributes: [] },
    { typeCode: 'A36', attributes: [] },
    { typeCode: 'C43', attributes: [] },
    { typeCode: 'C48', attributes: [] },
    // Bathroom
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'B01', attributes: ['1'] },
    { typeCode: 'T07', attributes: ['1'] },
    { typeCode: 'C34', attributes: [] },
    { typeCode: 'C35', attributes: [] },
    { typeCode: 'C36', attributes: [] },
    { typeCode: 'B99', attributes: [] },
    { typeCode: 'A02', attributes: [] },
    // Kitchen & Cooking
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'C08', attributes: ['G'] },
    { typeCode: 'C11', attributes: ['R'] },
    { typeCode: 'D01', attributes: [] },
    { typeCode: 'F04', attributes: ['F'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'O01', attributes: ['G'] },
    { typeCode: 'T06', attributes: [] },
    { typeCode: 'E01', attributes: [] },
    { typeCode: 'K08', attributes: [] },
    { typeCode: 'C17', attributes: [] },
    { typeCode: 'A28', attributes: [] },
    { typeCode: 'C31', attributes: [] },
    { typeCode: 'C30', attributes: [] },
    { typeCode: 'B16', attributes: [] },
    // Living Space & Furniture
    { typeCode: 'A22', attributes: ['C'] },
    { typeCode: 'A29', attributes: ['S'] },
    { typeCode: 'C44', attributes: [] },
    { typeCode: 'H42', attributes: [] },
    { typeCode: 'A38', attributes: ['Y'] },
    { typeCode: 'B88', attributes: [] },
    // Climate Control
    { typeCode: 'A01', attributes: [] },
    { typeCode: 'H40', attributes: ['C'] },
    { typeCode: 'A46', attributes: [] },
    // Entertainment & Technology
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'F10', attributes: [] },
    { typeCode: 'N07', attributes: [] },
    { typeCode: 'I02', attributes: ['C'] },
    // Laundry & Housekeeping
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    { typeCode: 'I03', attributes: [] },
    { typeCode: 'I04', attributes: [] },
    { typeCode: 'V03', attributes: [] },
    // Safety & Security
    { typeCode: 'S44', attributes: [] },
    { typeCode: 'C18', attributes: [] },
    { typeCode: 'F14', attributes: [] },
    { typeCode: 'F13', attributes: [] },
    { typeCode: 'S32', attributes: [] },
    { typeCode: 'A95', attributes: [] },
    { typeCode: 'A64', attributes: [] },
    // Parking & Transport
    { typeCode: 'G01', attributes: ['V'] },
    { typeCode: 'E03', attributes: [] },
    { typeCode: 'P13', attributes: ['1'] },
    // Outdoor
    { typeCode: 'B11', attributes: [] },
    // Pool & Wellness
    { typeCode: 'F12', attributes: [] },
    { typeCode: 'S61', attributes: [] },
    // Property Details
    { typeCode: 'P06', attributes: ['70'] },
    { typeCode: 'R07', attributes: ['3'] },
    { typeCode: 'D99', attributes: ['42'] },
    { typeCode: 'N01', attributes: [] },
    { typeCode: 'S37', attributes: ['N'] },
    // Policies
    { typeCode: 'P02', attributes: ['R'] },
  ],
  'rt-006': [ // Studio Suite — Chicago
    { typeCode: 'B02', attributes: ['0'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K03', attributes: ['Y'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'P06', attributes: ['38'] },
    { typeCode: 'A01', attributes: [] },
    { typeCode: 'H40', attributes: ['C'] },
  ],
  'rt-007': [ // 1BR King — Chicago
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'C08', attributes: ['G'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['F'] },
    { typeCode: 'D01', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['C'] },
    { typeCode: 'A29', attributes: ['S'] },
    { typeCode: 'P06', attributes: ['60'] },
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    { typeCode: 'A01', attributes: [] },
    { typeCode: 'H40', attributes: ['C'] },
  ],
  'rt-008': [ // 2BR Penthouse — Chicago
    { typeCode: 'B02', attributes: ['2'] },
    { typeCode: 'B17', attributes: ['2'] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'B01', attributes: ['2'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'C08', attributes: ['G'] },
    { typeCode: 'O01', attributes: ['G'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['F'] },
    { typeCode: 'D01', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['C'] },
    { typeCode: 'A29', attributes: ['S'] },
    { typeCode: 'P06', attributes: ['110'] },
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    { typeCode: 'I03', attributes: [] },
    { typeCode: 'B11', attributes: [] },
    { typeCode: 'A01', attributes: [] },
    { typeCode: 'H40', attributes: ['C'] },
    { typeCode: 'A02', attributes: [] },
  ],
  // Room types — Portland
  'rt-004': [ // Studio
    { typeCode: 'B02', attributes: ['0'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'K03', attributes: ['Y'] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'P06', attributes: ['30'] },
  ],
  'rt-005': [ // 1BR Queen
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'Q02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['Y'] },
    { typeCode: 'P06', attributes: ['45'] },
    { typeCode: 'W01', attributes: [] },
    { typeCode: 'D08', attributes: [] },
  ],
};

export const mockSyncStatus: Record<string, ChannelSyncStatus[]> = {
  'prop-123': [
    {
      channelId: 'BOO142',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Duplicate tax issue (Feb 2026)',
      lastSyncAt: '2026-02-01T10:00:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'EXP270',
      channelName: 'Expedia',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Never enabled',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'AIR298',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-15T09:00:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'prop-789': [
    {
      channelId: 'BOO144',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'EXP272',
      channelName: 'Expedia',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'AIR300',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
  ],
  'prop-456': [
    {
      channelId: 'BOO143',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Duplicate tax issue (Feb 2026)',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'EXP271',
      channelName: 'Expedia',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Never enabled',
      lastSyncAt: null,
      lastSyncStatus: null,
    },
    {
      channelId: 'AIR299',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
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
