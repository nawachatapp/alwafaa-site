// ---------------------------------------------------------------------------
// The school's real contact details, in one place.
// `tel` is the dial string (E.164, no spaces); `label` is what a reader sees.
// ---------------------------------------------------------------------------

export const phones = [
  { tel: '+9617511144', label: '07 511 144', intl: '+961 7 511 144' },
  { tel: '+9613897216', label: '03 897 216', intl: '+961 3 897 216' },
] as const;

export const email = 'alwafaa.lebanese.school@hotmail.com';

// The pupils' web portal (timetable, homework). One login per pupil, given by
// the school office. Served by nawa for this school at its own address.
export const portalUrl = 'https://alwafaa.nawaapp.com/';

// PLACEHOLDER - the school has not yet given a street address.
export const address = {
  ar: 'لبنان',
  en: 'Lebanon',
} as const;
