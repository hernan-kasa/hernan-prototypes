import { Property, DescriptionEntry, AmenityEntry, ChannelSyncStatus, SyncLogEntry } from '../types';

export const properties: Property[] = [
  {
    propertyId: 'prop-123',
    propertyName: 'Kasa 2nd Street Austin',
    nextpaxPropertyId: 'NP-456',
    roomTypes: [
      {
        id: 'rt-001',
        name: 'Studio Suite',
        internalTitle: 'Studio Apartment A',
        setupInfo: 'Studio',
        maxOccupancy: 2,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-8847231' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
      {
        id: 'rt-002',
        name: 'One Bedroom King',
        internalTitle: '1BR King Suite B',
        nickname: '1BR King',
        setupInfo: '1BR King',
        maxOccupancy: 4,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-8847232' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
      {
        id: 'rt-003',
        name: 'Two Bedroom Suite',
        internalTitle: '2BR Corner Suite C',
        nickname: '2BR Suite',
        setupInfo: '2BR Suite',
        maxOccupancy: 6,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-8847233' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
    ],
  },
  {
    propertyId: 'prop-456',
    propertyName: 'Kasa Downtown Portland',
    nextpaxPropertyId: 'NP-789',
    roomTypes: [
      {
        id: 'rt-004',
        name: 'Studio',
        internalTitle: 'Pearl District Studio',
        setupInfo: 'Studio',
        maxOccupancy: 2,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-9912401' },
          { channel: 'BDC', url: '#' },
        ],
      },
      {
        id: 'rt-005',
        name: 'One Bedroom Queen',
        internalTitle: '1BR Queen Suite',
        nickname: '1BR Queen',
        setupInfo: '1BR Queen',
        maxOccupancy: 3,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-9912402' },
          { channel: 'BDC', url: '#' },
        ],
      },
    ],
  },
  {
    propertyId: 'prop-789',
    propertyName: 'Kasa River North Chicago',
    nextpaxPropertyId: 'NP-012',
    roomTypes: [
      {
        id: 'rt-006',
        name: 'Studio Suite',
        internalTitle: 'River North Studio A',
        setupInfo: 'Studio',
        maxOccupancy: 2,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-7723101' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
      {
        id: 'rt-007',
        name: 'One Bedroom King',
        internalTitle: '1BR King River View',
        nickname: '1BR King',
        setupInfo: '1BR King',
        maxOccupancy: 4,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-7723102' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
      {
        id: 'rt-008',
        name: 'Two Bedroom Penthouse',
        internalTitle: '2BR Penthouse Suite',
        nickname: '2BR Penthouse',
        setupInfo: '2BR Penthouse',
        maxOccupancy: 6,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-7723103' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
    ],
  },
  {
    propertyId: 'prop-999',
    propertyName: 'Kasa Embarcadero San Francisco',
    nextpaxPropertyId: 'NP-555',
    roomTypes: [
      {
        id: 'rt-010',
        name: 'Studio Bay View',
        internalTitle: 'Studio Unit A — Bay Side',
        setupInfo: 'Studio',
        maxOccupancy: 2,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-5501001' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
      {
        id: 'rt-011',
        name: 'One Bedroom King',
        internalTitle: '1BR King — City View',
        nickname: '1BR King',
        setupInfo: '1BR King',
        maxOccupancy: 4,
        channelLinks: [
          { channel: 'Airbnb', url: '#', listingId: 'ABB-5501002' },
          { channel: 'BDC', url: '#' },
          { channel: 'Expedia', url: '#' },
        ],
      },
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
  // — Kasa Embarcadero San Francisco — fully complete property —
  'prop-999': [
    { typeCode: 'house', language: 'EN', text: 'Welcome to Kasa Embarcadero San Francisco, a waterfront apartment community steps from the Ferry Building and the Bay Bridge. Our thoughtfully designed apartments feature modern furnishings, full kitchens, and floor-to-ceiling windows with stunning bay views. Ideal for both business travelers and vacationers exploring the City by the Bay.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Waterfront apartments on the Embarcadero with bay views, full kitchens, and smart home features. Steps from the Ferry Building and BART.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Each apartment features warm hardwood floors, an open-concept living area with designer furniture, and a fully equipped kitchen with quartz countertops and stainless appliances. Large windows frame bay or city views. Smart locks, Nest thermostats, and high-speed WiFi throughout.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'unique-benefits', language: 'EN', text: 'Direct waterfront access along the Embarcadero promenade. Rooftop terrace with panoramic bay and bridge views. On-site fitness center and co-working lounge. Contactless smart lock check-in. Complimentary high-speed WiFi and streaming TV.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'area', language: 'EN', text: 'The Embarcadero is San Francisco\'s premier waterfront district. Walk to the Ferry Building Marketplace (3 min), Oracle Park (10 min), Fisherman\'s Wharf (20 min), and the Financial District (5 min). Embarcadero BART station is a 2-minute walk. Cable car stops nearby.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'environment', language: 'EN', text: 'Situated on the waterfront with views of the Bay Bridge and Treasure Island. The Embarcadero promenade is perfect for morning jogs or evening strolls. The neighborhood is walkable, bike-friendly with Bay Wheels stations, and well-served by Muni and BART.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'remarks', language: 'EN', text: 'Check-in: 4:00 PM | Check-out: 11:00 AM. No smoking on the property. No parties or events. Quiet hours 10 PM – 8 AM. Maximum occupancy must be respected. Pets allowed with prior approval and $50 pet fee per stay.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'fine-print', language: 'EN', text: 'Government-issued photo ID required at check-in. A $250 security deposit hold is placed on the credit card at booking and released within 7 business days after checkout. Free cancellation up to 48 hours before check-in. SF hotel tax included in the nightly rate.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'house-manual', language: 'EN', text: 'Smart lock code is sent 24 hours before arrival. WiFi: KasaGuest — password on the welcome card. Thermostat is a Nest — set to 68°F when leaving. Trash room is at the end of each hallway. Recycling and compost bins in the garage. Building concierge available 7 AM – 10 PM.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'headline', language: 'EN', text: 'Waterfront apartments with bay views on the Embarcadero', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'tips-of-the-owner', language: 'EN', text: 'Saturday mornings at the Ferry Building farmers market are a must. For the best clam chowder, skip Fisherman\'s Wharf and go to Hog Island Oyster Co. inside the Ferry Building. Rent bikes from Bay Wheels and ride across the Golden Gate Bridge. For coffee, try Blue Bottle on the Embarcadero.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'driving-directions', language: 'EN', text: 'From SFO: Take US-101 North to I-80 West, exit at Fremont St. Turn right on Folsom, left on Embarcadero. From Oakland (via Bay Bridge): Exit at Fremont St, turn right to Embarcadero. Parking garage on-site, $35/night.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'distances', language: 'EN', text: 'Ferry Building: 200m. BART Embarcadero Station: 150m. Oracle Park: 1km. Fisherman\'s Wharf: 2.5km. Chinatown: 1km. Union Square: 1.2km. Golden Gate Bridge: 8km. SFO Airport: 21km. Oakland Airport: 24km.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'additional-costs', language: 'EN', text: 'Pet fee: $50 per stay. Parking: $35/night in on-site garage. Early check-in (before 2 PM): $40 if available. Late check-out (after 1 PM): $40 if available.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'arrival-days', language: 'EN', text: 'Arrivals accepted any day. Check-in: 4:00 PM. Early check-in available upon request.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'discounts', language: 'EN', text: 'Weekly stays (7+ nights): 12% discount. Monthly stays (28+ nights): 22% discount. Both applied automatically at booking.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'minimum-stay-length', language: 'EN', text: 'Minimum stay: 2 nights. Holiday weekends and special events: 3-night minimum.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'opening-hours', language: 'EN', text: 'Concierge: 7 AM – 10 PM. Rooftop terrace: 7 AM – 10 PM. Fitness center: 24/7. Co-working lounge: 6 AM – 11 PM.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'optional-costs', language: 'EN', text: 'Mid-stay cleaning: $75 (stays of 5+ nights). Extra towel set: $10. Pack-and-play crib: complimentary upon request.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'price-table', language: 'EN', text: 'Rates vary by season. Studios from $179/night. 1BR Kings from $229/night. Weekly and monthly discounts available. See listing for current pricing.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-winter-text', language: 'EN', text: 'San Francisco\'s mild winters make the Embarcadero perfect year-round. Enjoy fog-free bay views and holiday lights along the waterfront.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'winter-text', language: 'EN', text: 'Winter in San Francisco is the city\'s best-kept secret. Mild temperatures, fewer crowds, and holiday festivities make it an ideal time to visit. The Ferry Building hosts holiday markets, and the waterfront is festive with lights. Union Square ice rink is a short walk away.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'why-this-property', language: 'EN', text: 'Unbeatable waterfront location on the Embarcadero. Bay views from every unit. Steps from BART and the Ferry Building. Rooftop terrace with panoramic views. Full kitchens and smart home features.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T10:00:00Z', lastSyncedAt: '2026-04-01T10:05:00Z', lastSyncStatus: 'success' },
  ],
  'rt-010': [
    { typeCode: 'house', language: 'EN', text: 'The Studio Bay View is a compact yet elegant open-plan apartment with a queen bed, sitting area, and fully equipped kitchenette. Floor-to-ceiling windows frame stunning bay and bridge views. Perfect for solo travelers or couples.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Waterfront studio with bay views, queen bed, kitchenette, and smart home features on the Embarcadero.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Open-concept layout with hardwood floors and oversized windows. Queen bed with premium linens, a compact living area with loveseat and smart TV, and a kitchenette with microwave, mini-fridge, coffee maker, and basic cookware. Modern bathroom with walk-in rainfall shower.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'unique-benefits', language: 'EN', text: 'Direct bay views from the bed. Smart lock and Nest thermostat. Access to rooftop terrace and fitness center. Steps from Ferry Building and BART.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'area', language: 'EN', text: 'Waterfront location on the Embarcadero. Ferry Building (3 min walk), BART (2 min), Financial District (5 min), Oracle Park (10 min).', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'environment', language: 'EN', text: 'Bay-facing unit with views of the Bay Bridge and water. The Embarcadero promenade is right outside for walks and runs.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'remarks', language: 'EN', text: 'Check-in: 4:00 PM | Check-out: 11:00 AM. No smoking. No parties. Quiet hours 10 PM – 8 AM. Max 2 guests.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'fine-print', language: 'EN', text: 'Photo ID required. $250 security hold released after checkout. Free cancellation up to 48 hours before arrival.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'house-manual', language: 'EN', text: 'Smart lock code sent 24 hours before arrival. WiFi: KasaGuest. Trash chute at end of hallway. Concierge 7 AM – 10 PM.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
  ],
  'rt-011': [
    { typeCode: 'house', language: 'EN', text: 'The 1BR King features a separate bedroom with a plush king bed, a spacious living area with city views, and a full kitchen with premium appliances. In-unit washer/dryer and smart home controls throughout. Ideal for couples or business travelers on extended stays.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'short-introduction', language: 'EN', text: 'Spacious 1BR with king bed, full kitchen, city views, and in-unit laundry on the Embarcadero. Steps from BART.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'interior', language: 'EN', text: 'Separate bedroom with king bed, blackout curtains, and walk-in closet. Living room with sectional sofa, work desk, and 55" smart TV. Full kitchen with quartz countertops, dishwasher, oven, and all cooking essentials. In-unit washer/dryer.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'unique-benefits', language: 'EN', text: 'Separate bedroom for privacy. Full kitchen for extended stays. In-unit laundry. Smart home controls. Rooftop terrace and fitness center access.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'area', language: 'EN', text: 'Embarcadero waterfront. Ferry Building (3 min), BART (2 min), Financial District (5 min), Oracle Park (10 min), Union Square (12 min).', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'environment', language: 'EN', text: 'City-view unit overlooking the Financial District skyline. The bustling Embarcadero is at your doorstep. Walkable and bike-friendly neighborhood.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'remarks', language: 'EN', text: 'Check-in: 4:00 PM | Check-out: 11:00 AM. No smoking. No parties. Quiet hours 10 PM – 8 AM. Max 4 guests. Pets with approval.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'fine-print', language: 'EN', text: 'Photo ID required. $250 security hold. Free cancellation up to 48 hours before arrival. SF hotel tax included.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
    { typeCode: 'house-manual', language: 'EN', text: 'Smart lock code sent before arrival. WiFi: KasaGuest. Washer/dryer pods in the cabinet above. Trash chute end of hallway. Concierge 7 AM – 10 PM.', lastModifiedBy: 'mel.baker@kasa.com', lastModifiedAt: '2026-04-01T11:00:00Z', lastSyncedAt: '2026-04-01T11:05:00Z', lastSyncStatus: 'success' },
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
  // — Kasa Embarcadero San Francisco (prop-999) — fully loaded, incl. every
  // PMS-mappable amenity so the Import from PMS preview shows the empty state.
  'prop-999': [
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'E11', attributes: [] },
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
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['Y'] },
    { typeCode: 'P06', attributes: ['42'] },
    { typeCode: 'W01', attributes: [], seededFromPMS: true }, // Laundry
    { typeCode: 'E01', attributes: [] },
    { typeCode: 'C66', attributes: [] },
    { typeCode: 'D08', attributes: [] },
    // PMS-seeded amenities — make the Import from PMS modal show empty state
    { typeCode: 'P05', attributes: ['C'], seededFromPMS: true }, // Outdoor swimming pool
    { typeCode: 'J01', attributes: ['Y'], seededFromPMS: true }, // Jacuzzi
    { typeCode: 'F12', attributes: [], seededFromPMS: true }, // Fitness/Gym
    { typeCode: 'G01', attributes: ['G'], seededFromPMS: true }, // Parking — Garage
    { typeCode: 'B09', attributes: ['Y'], seededFromPMS: true }, // Barbecue
    { typeCode: 'P17', attributes: [], seededFromPMS: true }, // Patio
    { typeCode: 'T02', attributes: [], seededFromPMS: true }, // Terrace (rooftop)
    { typeCode: 'P02', attributes: ['Y'], seededFromPMS: true }, // Pet-friendly
    { typeCode: 'B25', attributes: [], seededFromPMS: true }, // Business center
    { typeCode: 'A62', attributes: [], seededFromPMS: true }, // Bicycles parking
  ],
  'rt-010': [
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'E11', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'W07', attributes: ['Y'] },
    { typeCode: 'A22', attributes: ['Y'] },
    { typeCode: 'W01', attributes: [] },
  ],
  'rt-011': [
    { typeCode: 'B02', attributes: ['1'] },
    { typeCode: 'B17', attributes: ['1'] },
    { typeCode: 'G02', attributes: ['1'] },
    { typeCode: 'B18', attributes: [] },
    { typeCode: 'E11', attributes: [] },
    { typeCode: 'A18', attributes: [] },
    { typeCode: 'A44', attributes: ['P'] },
    { typeCode: 'D06', attributes: ['W'] },
    { typeCode: 'H41', attributes: [] },
    { typeCode: 'B30', attributes: [] },
    { typeCode: 'B01', attributes: ['1'] },
    { typeCode: 'K04', attributes: [] },
    { typeCode: 'M02', attributes: [] },
    { typeCode: 'F04', attributes: ['Y'] },
    { typeCode: 'W07', attributes: ['Y'] },
  ],
};

export const mockSyncStatus: Record<string, ChannelSyncStatus[]> = {
  'prop-123': [
    {
      channelId: 'AIR298',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-15T09:00:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'BOO142',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Pending NextPax field mapping review',
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
  ],
  'prop-789': [
    {
      channelId: 'AIR300',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-20T10:10:00Z',
      lastSyncStatus: 'success',
    },
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
  ],
  'prop-456': [
    {
      channelId: 'AIR299',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-03-14T12:00:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'BOO143',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: false,
      disableReason: 'Pending NextPax field mapping review',
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
  ],
  'prop-999': [
    {
      channelId: 'AIR400',
      channelName: 'Airbnb',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-04-01T10:05:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'BOO200',
      channelName: 'Booking.com',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-04-01T10:05:00Z',
      lastSyncStatus: 'success',
    },
    {
      channelId: 'EXP350',
      channelName: 'Expedia',
      enabled: true,
      contentEnabled: true,
      lastSyncAt: '2026-04-01T10:05:00Z',
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
  'prop-999': [
    { id: 'log-13', timestamp: '2026-04-01T10:05:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Booking.com', result: 'success', nextpaxRequestId: 'NPX-2026-0401-001' },
    { id: 'log-14', timestamp: '2026-04-01T10:05:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Expedia', result: 'success', nextpaxRequestId: 'NPX-2026-0401-002' },
    { id: 'log-15', timestamp: '2026-04-01T10:05:00Z', operator: 'mel.baker@kasa.com', contentType: 'descriptions', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0401-003' },
    { id: 'log-16', timestamp: '2026-04-01T10:03:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Booking.com', result: 'success', nextpaxRequestId: 'NPX-2026-0401-004' },
    { id: 'log-17', timestamp: '2026-04-01T10:03:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Expedia', result: 'success', nextpaxRequestId: 'NPX-2026-0401-005' },
    { id: 'log-18', timestamp: '2026-04-01T10:03:00Z', operator: 'mel.baker@kasa.com', contentType: 'amenities', channel: 'Airbnb', result: 'success', nextpaxRequestId: 'NPX-2026-0401-006' },
  ],
};

// ─── Photos (sourced from Contentful, ordering managed in Konnect) ───────────

export interface MockPhoto {
  id: string;
  imageType: string;
  imageTypeLabel: string;
  caption: string;
  priority: number;
  lastUpdated: string;
  contentfulId: string;
  color: string; // gradient for placeholder
}

const photoColor: Record<string, string> = {
  'exterior': 'linear-gradient(135deg, #8BA4B8, #5A7D9A)',
  'living-room': 'linear-gradient(135deg, #C4A882, #A08060)',
  'bedroom': 'linear-gradient(135deg, #9B8EC4, #7B6FA4)',
  'kitchen': 'linear-gradient(135deg, #7DB88E, #5A9A6C)',
  'bathroom': 'linear-gradient(135deg, #7BC8C4, #5AA8A4)',
  'building': 'linear-gradient(135deg, #8E99A4, #6B7B8A)',
  'view': 'linear-gradient(135deg, #88B4D8, #6898BC)',
  'pool': 'linear-gradient(135deg, #6CB4D8, #4A98BC)',
  'amenity': 'linear-gradient(135deg, #B8A88B, #9A8060)',
};

function ph(id: string, type: string, label: string, caption: string, priority: number, date: string, cId: string): MockPhoto {
  return { id, imageType: type, imageTypeLabel: label, caption, priority, lastUpdated: date, contentfulId: cId, color: photoColor[type] || photoColor['building'] };
}

export const mockPhotos: Record<string, MockPhoto[]> = {
  'prop-123': [
    ph('ph-1', 'exterior', 'Exterior', 'Building facade from 2nd Street', 0, '2026-03-01T10:00:00Z', 'ctfl-a1b2c3'),
    ph('ph-2', 'exterior', 'Exterior', 'Evening view with downtown skyline', 1, '2026-03-01T10:00:00Z', 'ctfl-a1b2c4'),
    ph('ph-3', 'pool', 'Pool', 'Rooftop pool and lounge area', 2, '2026-03-01T10:00:00Z', 'ctfl-a1b2c5'),
    ph('ph-4', 'living-room', 'Living Room', 'Open-concept living area with city views', 3, '2026-03-01T10:00:00Z', 'ctfl-a1b2c6'),
    ph('ph-5', 'living-room', 'Living Room', 'Workspace nook by the window', 4, '2026-03-01T10:00:00Z', 'ctfl-a1b2c7'),
    ph('ph-6', 'bedroom', 'Bedroom', 'King bed with luxury linens', 5, '2026-02-15T10:00:00Z', 'ctfl-a1b2c8'),
    ph('ph-7', 'bedroom', 'Bedroom', 'Bedroom with blackout curtains', 6, '2026-02-15T10:00:00Z', 'ctfl-a1b2c9'),
    ph('ph-8', 'kitchen', 'Kitchen', 'Full kitchen with stainless appliances', 7, '2026-02-15T10:00:00Z', 'ctfl-a1b2d0'),
    ph('ph-9', 'bathroom', 'Bathroom', 'Walk-in rainfall shower', 8, '2026-02-15T10:00:00Z', 'ctfl-a1b2d1'),
    ph('ph-10', 'view', 'View', 'Lady Bird Lake from the balcony', 9, '2026-02-15T10:00:00Z', 'ctfl-a1b2d2'),
    ph('ph-11', 'building', 'Building', 'Lobby and concierge area', 10, '2026-02-15T10:00:00Z', 'ctfl-a1b2d3'),
    ph('ph-12', 'amenity', 'Amenity Area', 'Fitness center', 11, '2026-02-15T10:00:00Z', 'ctfl-a1b2d4'),
  ],
  'rt-001': [
    ph('ph-20', 'bedroom', 'Bedroom', 'Queen bed in Studio Suite', 0, '2026-03-05T10:00:00Z', 'ctfl-s1a1'),
    ph('ph-21', 'living-room', 'Living Room', 'Sitting area with city view', 1, '2026-03-05T10:00:00Z', 'ctfl-s1a2'),
    ph('ph-22', 'kitchen', 'Kitchen', 'Kitchenette with microwave and fridge', 2, '2026-03-05T10:00:00Z', 'ctfl-s1a3'),
    ph('ph-23', 'bathroom', 'Bathroom', 'Modern bathroom with walk-in shower', 3, '2026-03-05T10:00:00Z', 'ctfl-s1a4'),
    ph('ph-24', 'view', 'View', 'Partial city view from the studio', 4, '2026-03-05T10:00:00Z', 'ctfl-s1a5'),
  ],
  'rt-002': [
    ph('ph-30', 'bedroom', 'Bedroom', 'King bed with river view', 0, '2026-03-05T10:00:00Z', 'ctfl-k1a1'),
    ph('ph-31', 'living-room', 'Living Room', 'Spacious living area', 1, '2026-03-05T10:00:00Z', 'ctfl-k1a2'),
    ph('ph-32', 'kitchen', 'Kitchen', 'Full kitchen with island', 2, '2026-03-05T10:00:00Z', 'ctfl-k1a3'),
    ph('ph-33', 'bathroom', 'Bathroom', 'En-suite bathroom', 3, '2026-03-05T10:00:00Z', 'ctfl-k1a4'),
    ph('ph-34', 'living-room', 'Living Room', 'Work desk area', 4, '2026-03-05T10:00:00Z', 'ctfl-k1a5'),
    ph('ph-35', 'view', 'View', 'Downtown Austin skyline', 5, '2026-03-05T10:00:00Z', 'ctfl-k1a6'),
  ],
  'prop-999': [
    ph('ph-40', 'exterior', 'Exterior', 'Embarcadero waterfront facade', 0, '2026-04-01T10:00:00Z', 'ctfl-sf01'),
    ph('ph-41', 'exterior', 'Exterior', 'Building entrance at sunset', 1, '2026-04-01T10:00:00Z', 'ctfl-sf02'),
    ph('ph-42', 'view', 'View', 'Bay Bridge panorama from rooftop', 2, '2026-04-01T10:00:00Z', 'ctfl-sf03'),
    ph('ph-43', 'living-room', 'Living Room', 'Bay-view living area', 3, '2026-04-01T10:00:00Z', 'ctfl-sf04'),
    ph('ph-44', 'bedroom', 'Bedroom', 'King bed facing the bay', 4, '2026-04-01T10:00:00Z', 'ctfl-sf05'),
    ph('ph-45', 'bedroom', 'Bedroom', 'Guest bedroom with city view', 5, '2026-04-01T10:00:00Z', 'ctfl-sf06'),
    ph('ph-46', 'kitchen', 'Kitchen', 'Chef\'s kitchen with quartz counters', 6, '2026-04-01T10:00:00Z', 'ctfl-sf07'),
    ph('ph-47', 'bathroom', 'Bathroom', 'Spa bathroom with soaking tub', 7, '2026-04-01T10:00:00Z', 'ctfl-sf08'),
    ph('ph-48', 'pool', 'Pool', 'Rooftop terrace with bay views', 8, '2026-04-01T10:00:00Z', 'ctfl-sf09'),
    ph('ph-49', 'building', 'Building', 'Co-working lounge', 9, '2026-04-01T10:00:00Z', 'ctfl-sf10'),
  ],
  'rt-010': [
    ph('ph-50', 'bedroom', 'Bedroom', 'Queen bed with bay view', 0, '2026-04-01T11:00:00Z', 'ctfl-sfr1'),
    ph('ph-51', 'living-room', 'Living Room', 'Compact sitting area', 1, '2026-04-01T11:00:00Z', 'ctfl-sfr2'),
    ph('ph-52', 'kitchen', 'Kitchen', 'Kitchenette with coffee station', 2, '2026-04-01T11:00:00Z', 'ctfl-sfr3'),
    ph('ph-53', 'bathroom', 'Bathroom', 'Rainfall shower', 3, '2026-04-01T11:00:00Z', 'ctfl-sfr4'),
    ph('ph-54', 'view', 'View', 'Bay Bridge from the bed', 4, '2026-04-01T11:00:00Z', 'ctfl-sfr5'),
  ],
  'rt-011': [
    ph('ph-60', 'bedroom', 'Bedroom', 'King bed with city skyline', 0, '2026-04-01T11:00:00Z', 'ctfl-sfr6'),
    ph('ph-61', 'living-room', 'Living Room', 'Living room with sectional', 1, '2026-04-01T11:00:00Z', 'ctfl-sfr7'),
    ph('ph-62', 'kitchen', 'Kitchen', 'Full kitchen with dishwasher', 2, '2026-04-01T11:00:00Z', 'ctfl-sfr8'),
    ph('ph-63', 'bathroom', 'Bathroom', 'Double vanity bathroom', 3, '2026-04-01T11:00:00Z', 'ctfl-sfr9'),
    ph('ph-64', 'view', 'View', 'Financial District skyline', 4, '2026-04-01T11:00:00Z', 'ctfl-sfr10'),
    ph('ph-65', 'living-room', 'Living Room', 'Dedicated work desk', 5, '2026-04-01T11:00:00Z', 'ctfl-sfr11'),
  ],
};
