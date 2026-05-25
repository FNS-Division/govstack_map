/**
 * Regenerate src/data/administrations.json from the ITU administrations export.
 * Maps ITU radio regions (XR1–XR3) to ITU-D six economy regions.
 *
 * Usage:
 *   node scripts/build-administrations-json.mjs /path/to/administrations.xlsx
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';
import {
  GOVSTACK_REGIONS,
  mapSymbolToGovstackRegion,
  REGION_SUPPLEMENTS,
} from './itu-symbol-to-govstack-region.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node scripts/build-administrations-json.mjs <administrations.xlsx>');
  process.exit(1);
}

const workbook = XLSX.readFile(inputPath);
const sheetName = workbook.SheetNames.includes('Exported data')
  ? 'Exported data'
  : workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

const byGovstackRegion = new Map(GOVSTACK_REGIONS.map(code => [code, []]));

for (const row of rows) {
  const ituRadioRegion = String(row.Region ?? '').trim();
  const symbol = String(row.Symbol ?? '').trim();
  const designation = String(row.Designation ?? '').trim();
  if (!ituRadioRegion || !symbol || !designation) continue;

  const govstackRegion = mapSymbolToGovstackRegion(symbol, ituRadioRegion);
  byGovstackRegion.get(govstackRegion).push({
    symbol,
    designation,
    ituRadioRegion,
  });
}

const regions = GOVSTACK_REGIONS.map(code => {
  const supplements = REGION_SUPPLEMENTS[code] ?? [];
  const countries = [...byGovstackRegion.get(code), ...supplements].sort((a, b) =>
    a.designation.localeCompare(b.designation),
  );
  return { code, countries };
});

const payload = {
  source: path.basename(inputPath),
  regionModel: 'itu-d-six-regions',
  updatedAt: new Date().toISOString().slice(0, 10),
  regions,
};

const outPath = path.join(__dirname, '../src/data/administrations.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);

for (const region of regions) {
  console.log(`${region.code}: ${region.countries.length} countries`);
}
console.log(`Wrote ${outPath} (${rows.length} administrations)`);
