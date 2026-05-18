import { fixKnownDataTypos } from './dataTypos';
import { tagClass } from './tagStyles';

export interface AssetRecord {
  id: string;
  name: string;
  type: string;
  description: string;
  audience: string;
  link: string;
}

export function mapRowToAsset(row: Record<string, string>, index: number): AssetRecord {
  const name = row['Asset'] || `Asset ${index + 1}`;
  return {
    id: `asset-${index}-${name.slice(0, 24)}`,
    name,
    type: fixKnownDataTypos(row['Type of Asset'] || row['Type'] || '—'),
    description: fixKnownDataTypos(row['Description'] || '—'),
    audience: fixKnownDataTypos(row['Target Audience'] || row['Target Audiance'] || '—'),
    link: row['Link'] || row['URL'] || '',
  };
}

export { tagClass };
