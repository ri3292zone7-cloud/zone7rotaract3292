/*
 * DRAFT PLACEHOLDER COPY — written to fit the club's voice, playful but
 * professional. Every string here should be reviewed against reality:
 * field notes checked with project leads, quotes replaced with real ones,
 * "~" impact figures confirmed or removed.
 */
const F = '/media/sukedhara/field/';

export const FIELD_PHOTOS = {
  esrag: Array.from({ length: 10 }, (_, i) => `${F}esrag-${String(i + 1).padStart(2, '0')}.jpg`),
  eye: Array.from({ length: 6 }, (_, i) => `${F}eye-0${i + 1}.jpg`),
  meet: ['meet-01', 'meet-02', 'meet-03', 'meet-04'].map((n) => `${F}${n}.jpg`),
  blood: [`${F}blood-01.jpg`]
};

/* Keyed by exact project title in photos.js PROJECTS. */
export const FIELD_NOTES = {
  'ESRAG Grant: Waste Segregation & WASH Awareness Program': {
    note: 'Bins in every classroom, soap at every tap — the students of Sunakothi now run the segregation rota themselves.',
    impact: '~whole school segregating'
  },
  'Free Eye Camp at Shree Balkumari School': {
    note: 'A morning of screenings, clear sight and wide smiles — and a queue that kept growing till lunch.',
    impact: '~100+ students screened'
  },
  'Project TEACH: Feel it, Deal it, Heal it': {
    note: 'An afternoon on big feelings and resilience with the students of Trikon — feel it, deal it, heal it.',
    impact: '~one brave classroom'
  },
  'Club COTS': {
    note: 'Club officer training, virtual edition — new leaders, fresh plans, and a great many Meet tiles.',
    impact: '~full officer team trained'
  },
  'Library Set-up at The Orphans Home': {
    note: 'Shelf by shelf, a library rose in Nakkhu — readers already negotiating over the comics.',
    impact: '~hundreds of books shelved'
  },
  'Digital Privacy & Security Awareness Session': {
    note: 'Passwords, privacy settings and staying safe online — a virtual crash course for the club and friends.',
    impact: '~safer inboxes all round'
  },
  'Changing the Narrative on Suicide': {
    note: 'An honest evening conversation about mental health — quiet, brave, and much needed.',
    impact: '~one stigma lighter'
  },
  'Gift of Hope 2.0: Stationery Donation to Shree Hira Devi School': {
    note: 'Stationery kits packed and handed over in Melamchi — new notebooks, new term, new beginnings.',
    impact: '~smiles per kit: many'
  },
  'Making & Distribution of Reusable Menstrual Pads': {
    note: 'Reusable pads stitched and delivered across Melamchi and Sindhupalchok — dignity, by hand.',
    impact: '~stigma-free semesters'
  }
};

export const QUOTES = [
  {
    text: 'I came for one blood drive and never left. Saturdays at ten just became my favourite appointment of the week.',
    by: 'A Sukedhara member'
  },
  {
    text: 'They did not just bring notebooks — they sat with our children and read the first pages together.',
    by: 'A teacher, Melamchi'
  },
  {
    text: 'Small club, enormous heart. Every joint project with them ends with laughter and a plan for the next one.',
    by: 'A twin-club guest'
  }
];

/* Keyed by officer role in photos.js BOARD_FULL. */
export const BOARD_LINES = {
  President: 'Keeps the Saturdays on time. Mostly.',
  Secretary: 'Writes it all down. Remembers everything.',
  Treasurer: 'Guardian of the club wallet.',
  'Vice President': 'Second in command, first on the field.',
  'Joint Secretary': 'Backup brain, full-time energy.',
  'IPP / Foundation Chair': 'Been there, fixed that.',
  'Club Administration Director': 'Makes the meetings happen.',
  'Public Image Director': 'If it looked good online, that was her.',
  'Membership Development Director': 'Knows every member’s tea order.',
  'Service Project Director': 'Turns ideas into field days.',
  'International Service Director': 'Sukedhara’s ambassador to the world.',
  'Sergeant-at-Arms': 'Order in the house.',
  'Club Advisor': 'The wise voice in the corner.'
};

export const BIRD_QUIPS = [
  'See you Saturday!',
  'Poke = fellowship',
  'Service looks good on you',
  '10 AM sharp, hai?'
];

export const SATURDAY_MOMENTS = [
  {
    time: '9:55 AM',
    title: 'Arrival & chiya',
    text: 'Doors open, kettle on. Early birds claim the sunny chairs and catch up on the week.',
    img: `${F}meet-01.jpg`
  },
  {
    time: '10:00 AM',
    title: 'Fellowship first',
    text: 'Sergeant-at-arms calls order — loosely. Birthdays, banter, and the famous attendance roll.',
    img: `${F}meet-02.jpg`
  },
  {
    time: '10:30 AM',
    title: 'Planning the next field day',
    text: 'Projects take shape on whiteboards and napkins: who brings what, who calls whom.',
    img: `${F}meet-03.jpg`
  },
  {
    time: '11:30 AM',
    title: 'Closing circle',
    text: 'Tasks assigned, hands stacked, weekend plans compared. Same time next week.',
    img: `${F}meet-04.jpg`
  }
];
