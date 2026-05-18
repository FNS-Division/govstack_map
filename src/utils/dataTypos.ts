/**
 * Correct known typos in GovStack Global.xlsx (source data), applied at load/display time.
 */
export function fixKnownDataTypos(text: string): string {
  if (!text) return text;
  return text
    .replace(/\bBuildinng Blocks\b/gi, 'Building Blocks')
    .replace(/\bBuildinng\b/gi, 'Building')
    .replace(/\bTarget Audiance\b/gi, 'Target Audience');
}
