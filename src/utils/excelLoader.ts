import * as XLSX from 'xlsx';
import { fixKnownDataTypos } from './dataTypos';
import { normalizeHeader } from './normalizeRows';

export interface SheetData {
  headers: string[];
  rows: Record<string, string>[];
}

const KNOWN_HEADER_NAMES = new Set([
  'Activity',
  'Budget',
  'Category',
  'Comments',
  'Contact',
  'Country',
  'Date',
  'Description',
  'Email',
  'Expertise',
  'Focal Point',
  'Format',
  'Input',
  'Language',
  'Link',
  'Location',
  'Name',
  'Notes',
  'Organization',
  'Output',
  'Owner',
  'Phone',
  'Priority',
  'Region',
  'Status',
  'Target Audience',
  'Timeline',
  'Title',
  'Type',
  'Type of Asset',
  'URL',
]);

function normalizeRowValues(row: unknown[]): string[] {
  return row.map(cell => (
    cell !== null && cell !== undefined ? String(cell).trim() : ''
  ));
}

function findHeaderRowIndex(rawData: string[][]): number {
  let firstNonEmptyRow = 0;

  for (let i = 0; i < rawData.length; i++) {
    const values = normalizeRowValues(rawData[i] as unknown[]);
    const nonEmptyCount = values.filter(Boolean).length;
    if (nonEmptyCount === 0) continue;

    if (i === 0 || rawData[firstNonEmptyRow]?.every(cell => !String(cell).trim())) {
      firstNonEmptyRow = i;
    }

    const knownHeaderCount = values
      .map(normalizeHeader)
      .filter(header => KNOWN_HEADER_NAMES.has(header)).length;

    if (knownHeaderCount >= 2) return i;
  }

  return firstNonEmptyRow;
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

    const headerRowIndex = findHeaderRowIndex(rawData);
    const rawHeaders = normalizeRowValues(rawData[headerRowIndex] as unknown[]);

    const normalizedHeaders = rawHeaders.map(normalizeHeader);

    const rows: Record<string, string>[] = [];
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const rowArr: unknown[] = rawData[i] as unknown[];
      const row: Record<string, string> = {};
      let hasValue = false;

      normalizedHeaders.forEach((header, idx) => {
        if (!header) return;
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
