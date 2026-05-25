/**
 * ITU-D economy regions (Telecommunication Development Bureau).
 * @see https://www.itu.int/en/ITU-D/Statistics/pages/definitions/regions.aspx
 */
export const GOVSTACK_REGIONS = [
  'Africa',
  'Americas',
  'Arab States',
  'Asia and the Pacific',
  'CIS',
  'Europe',
];

/** ITU-D Arab States member symbols (21 ITU member administrations). */
const ARAB_STATES_SYMBOLS = new Set([
  'ALG', 'BHR', 'COM', 'DJI', 'EGY', 'IRQ', 'JOR', 'KWT', 'LBN', 'LBY',
  'MTN', 'MRC', 'OMA', 'QAT', 'ARS', 'SOM', 'SDN', 'SYR', 'TUN', 'UAE', 'YEM',
]);

/** Economies in ITU-D regional stats but absent from the member export. */
export const REGION_SUPPLEMENTS = {
  'Arab States': [{ symbol: 'PSE', designation: 'Palestine', ituRadioRegion: 'XR1' }],
};

/** ITU-D CIS (9 member states). */
const CIS_SYMBOLS = new Set([
  'ARM', 'AZE', 'BLR', 'KAZ', 'KGZ', 'RUS', 'TJK', 'TKM', 'UZB',
]);

/** ITU-D Europe (XR1 members). */
const EUROPE_SYMBOLS = new Set([
  'ALB', 'AND', 'AUT', 'BEL', 'BIH', 'BUL', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN',
  'F', 'D', 'GEO', 'GRC', 'HNG', 'ISL', 'IRL', 'I', 'LVA', 'LTU', 'LUX', 'LIE', 'MCO', 'MDA',
  'MLT', 'MNE', 'MKD', 'NOR', 'HOL', 'POL', 'POR', 'ROU', 'SMR', 'SRB', 'SVK', 'SVN', 'E', 'S',
  'SUI', 'G', 'TUR', 'ISR', 'UKR', 'CVA',
]);

/** XR1 members classified under Asia and the Pacific (e.g. Mongolia). */
const ASIA_PACIFIC_SYMBOLS = new Set(['MNG']);

/**
 * Map ITU radio region + member symbol to ITU-D six-region model.
 * @param {string} symbol
 * @param {string} ituRadioRegion XR1 | XR2 | XR3
 */
export function mapSymbolToGovstackRegion(symbol, ituRadioRegion) {
  if (ituRadioRegion === 'XR2') return 'Americas';
  if (ituRadioRegion === 'XR3') return 'Asia and the Pacific';
  if (ARAB_STATES_SYMBOLS.has(symbol)) return 'Arab States';
  if (CIS_SYMBOLS.has(symbol)) return 'CIS';
  if (ASIA_PACIFIC_SYMBOLS.has(symbol)) return 'Asia and the Pacific';
  if (EUROPE_SYMBOLS.has(symbol)) return 'Europe';
  return 'Africa';
}
