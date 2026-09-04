// =============================================================================
// The Help card's reference data (/help): the phone numbers a visitor needs
// when something has gone wrong, and where a person or a landline can be
// found. Kept as data rather than prose so the page can render each number as
// a one-tap tel: link and the essentials can keep quoting the same values.
//
// Source: the National Park Service's own list in the printed Yosemite Guide,
// the same edition the editorial bulletin condenses (bulletin.json `numbers`).
// Re-check on every edition turn, the same cadence as dining hours. Nothing
// here is derived or inferred: a number that is not printed by the park is
// not on this list, because a wrong number on this page is worse than none.
// =============================================================================

export const HELP_SOURCE = {
  edition: 'August 19 – September 22, 2026',
  url: 'https://www.nps.gov/yose/planyourvisit/guide.htm',
}

export type HelpNumber = {
  id: string
  label: string
  // Dialable digits for the tel: link. 911 stays bare.
  tel: string
  // As the Guide prints it, for the eye.
  display: string
  // One line: what the number is for, or how to use it.
  note?: string
  // 'emergency' renders at the top in the alert tone; 'urgent' is the second
  // block (the clinic, a breakdown, a bear in the campsite); 'info' is the
  // rest.
  tier: 'emergency' | 'urgent' | 'info'
}

export const HELP_NUMBERS: HelpNumber[] = [
  {
    id: 'emergency',
    label: 'Emergency',
    tel: '911',
    display: '911',
    note: 'Call or text. A text needs less signal than a call.',
    tier: 'emergency',
  },
  {
    id: 'clinic',
    label: 'Yosemite Medical Clinic',
    tel: '+12093724637',
    display: '209/372-4637',
    note: 'Yosemite Village. Urgent care, not an emergency room.',
    tier: 'urgent',
  },
  {
    id: 'roadside',
    label: 'Roadside assistance, 24 hr',
    tel: '+12093721060',
    display: '209/372-1060',
    note: 'Towing and breakdowns inside the park.',
    tier: 'urgent',
  },
  {
    id: 'bear',
    label: 'Save-a-Bear hotline',
    tel: '+12093720322',
    display: '209/372-0322',
    note: 'A bear in a campsite, a lot, or a building.',
    tier: 'urgent',
  },
  {
    id: 'road-conditions',
    label: 'Road conditions, recorded',
    tel: '+12093720200',
    display: '209/372-0200',
    note: 'Press 1, then 1.',
    tier: 'info',
  },
  {
    id: 'park-info',
    label: 'Park information',
    tel: '+12093720200',
    display: '209/372-0200',
    tier: 'info',
  },
]

// Text alerts are a number you text, not one you call; kept separate so the
// page can render it as an sms: link with the keyword prefilled.
export const TRAFFIC_TEXT = { keyword: 'ynptraffic', number: '333111' }

// Where a person or a landline is, when the handset has nothing. Names only,
// no coordinates: these are the staffed buildings the Guide lists hours for,
// and a reader in trouble needs the name to ask for, not a pin to walk to.
// Hours are not repeated here because they change by edition; the Guide and
// /essentials/safety-and-help carry the current ones.
export const STAFFED_HELP: { area: string; places: string }[] = [
  {
    area: 'Yosemite Valley',
    places:
      'The Valley Welcome Center and the Valley Wilderness Center at Yosemite Village; the front desks at Yosemite Valley Lodge, Curry Village, and The Ahwahnee; the Medical Clinic on Ahwahnee Drive.',
  },
  {
    area: 'Wawona and the Mariposa Grove',
    places: 'The Wawona Visitor Center and Wilderness Center; the Mariposa Grove Welcome Plaza.',
  },
  {
    area: 'Tioga Road and Tuolumne Meadows',
    places:
      'The Tuolumne Meadows Visitor Center and Wilderness Center in season; the Big Oak Flat Information Station at the Highway 120 west entrance.',
  },
  {
    area: 'Hetch Hetchy',
    places: 'The entrance station on Hetch Hetchy Road, staffed during gate hours.',
  },
]
