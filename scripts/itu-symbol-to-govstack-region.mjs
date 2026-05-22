/** GovStack / Global View five regions (matches public map Excel). */
export const GOVSTACK_REGIONS = [
  'Africa',
  'Americas',
  'Asia-Pacific',
  'CIS',
  'Europe',
];

/** ITU administrations in former Soviet / CIS grouping. */
const CIS_SYMBOLS = new Set([
  'ARM', 'AZE', 'BLR', 'GEO', 'KAZ', 'KGZ', 'MDA', 'RUS', 'TJK', 'TKM', 'UKR', 'UZB',
]);

/** European member administrations (XR1). */
const EUROPE_SYMBOLS = new Set([
  'ALB', 'AND', 'AUT', 'BEL', 'BIH', 'BUL', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN',
  'F', 'D', 'GRC', 'HNG', 'ISL', 'IRL', 'I', 'LVA', 'LTU', 'LUX', 'LIE', 'MCO', 'MNE',
  'MKD', 'NOR', 'HOL', 'POL', 'POR', 'ROU', 'SMR', 'SRB', 'SVK', 'SVN', 'E', 'SUI', 'G',
  'TUR', 'ISR', 'MLT', 'S',
]);

/** XR1 members shown under Asia-Pacific on the GovStack map (e.g. Mongolia). */
const ASIA_PACIFIC_SYMBOLS = new Set(['MNG']);

/**
 * Map ITU radio region + member symbol to GovStack five-region model.
 * @param {string} symbol
 * @param {string} ituRadioRegion XR1 | XR2 | XR3
 */
export function mapSymbolToGovstackRegion(symbol, ituRadioRegion) {
  if (ituRadioRegion === 'XR2') return 'Americas';
  if (ituRadioRegion === 'XR3') return 'Asia-Pacific';
  if (CIS_SYMBOLS.has(symbol)) return 'CIS';
  if (ASIA_PACIFIC_SYMBOLS.has(symbol)) return 'Asia-Pacific';
  if (EUROPE_SYMBOLS.has(symbol)) return 'Europe';
  return 'Africa';
}
