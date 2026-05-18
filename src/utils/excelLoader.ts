import * as XLSX from 'xlsx';
import { fixKnownDataTypos } from './dataTypos';
import { normalizeHeader } from './normalizeRows';

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
}

export async function loadExcel(filePath: string): Promise<Record<string, SheetData>> {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const result: Record<string, SheetData> = {};

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (!rawData || rawData.length === 0) {
      result[sheetName] = { headers: [], rows: [] };
      continue;
    }

    const rawHeaders: string[] = (rawData[0] as unknown[]).map(h =>
      h !== null && h !== undefined ? String(h).trim() : ''
    );

    const normalizedHeaders = rawHeaders.map(normalizeHeader);

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < rawData.length; i++) {
      const rowArr: unknown[] = rawData[i] as unknown[];
      const row: Record<string, string> = {};
      let hasValue = false;

      normalizedHeaders.forEach((header, idx) => {
        const cell = rowArr[idx];
        const val = cell !== null && cell !== undefined ? String(cell).trim() : '';
        row[header] = val ? fixKnownDataTypos(val) : val;
        if (val) hasValue = true;
      });

      if (hasValue) rows.push(row);
    }

    result[sheetName] = { headers: normalizedHeaders.filter(Boolean), rows };
  }

  return result;
}
