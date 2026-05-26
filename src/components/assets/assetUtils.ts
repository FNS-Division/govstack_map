import { fixKnownDataTypos } from '../../utils/dataTypos';
import type { AssetCategory, AssetItem, AssetSortOption, NormalizedAsset } from './assetTypes';

/** Primary category; priority: Adopt → Build → Learn (default). */
export function classifyAsset(asset: AssetItem): AssetCategory {
  const name = (asset.Asset ?? '').toLowerCase();
  const type = (asset['Type of Asset'] ?? '').toLowerCase();
  const description = (asset.Description ?? '').toLowerCase();
  const text = `${type} ${name} ${description}`;

  // 1) Adopt: readiness / assessment / capacity programs.
  if (
    text.includes('assessment') ||
    text.includes('evaluate') ||
    text.includes('evaluation') ||
    text.includes('benchmark') ||
    text.includes('readiness') ||
    text.includes('maturity') ||
    text.includes('gap') ||
    text.includes('paera') ||
    type.includes('capacity') ||
    text.includes('programme') ||
    text.includes('program')
  ) {
    return 'Adopt';
  }

  // 2) Build: implementation/engineering artifacts.
  if (
    type.includes('building block') ||
    text.includes('api') ||
    text.includes('sdk') ||
    text.includes('repository') ||
    text.includes('github') ||
    text.includes('reference implementation') ||
    text.includes('technical specification') ||
    text.includes('specification') ||
    text.includes('deployment') ||
    text.includes('infrastructure') ||
    text.includes('sandbox')
  ) {
    return 'Build';
  }

  // 3) Learn: guidance/methodology/training.
  if (
    type.includes('methodology') ||
    type.includes('guide') ||
    type.includes('capacity') ||
    text.includes('playbook') ||
    text.includes('training') ||
    text.includes('programme') ||
    text.includes('program') ||
    text.includes('service design') ||
    text.includes('case study')
  ) {
    return 'Learn';
  }

  return 'Learn';
}

const EMPTY_MARKERS = new Set(['—', '-', 'n/a', 'na', '']);

function clean(value: string | undefined): string {
  const trimmed = fixKnownDataTypos((value ?? '').trim());
  if (EMPTY_MARKERS.has(trimmed.toLowerCase())) return '';
  return trimmed;
}

export function normalizeAsset(row: Record<string, string>, index: number): NormalizedAsset {
  const asset: AssetItem = {
    Asset: clean(row.Asset) || `Asset ${index + 1}`,
    'Type of Asset': clean(row['Type of Asset'] || row.Type),
    Link: clean(row.Link || row.URL),
    Description: clean(row.Description),
    'Target Audience': clean(row['Target Audience'] || row['Target Audiance']),
  };

  return {
    ...asset,
    id: `asset-${index}-${asset.Asset.slice(0, 32).replace(/\s+/g, '-')}`,
    category: classifyAsset(asset),
  };
}

export function getAssetTypeLabel(asset: AssetItem): string {
  const type = clean(asset['Type of Asset']);
  return type || 'Resource';
}

export function getAudienceChips(asset: AssetItem): string[] {
  const raw = clean(asset['Target Audience']);
  if (!raw) return [];
  return raw
    .split(/[,;|/]/)
    .map(part => part.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function getShortDescription(asset: AssetItem, maxLength = 140): string {
  const description = clean(asset.Description);
  if (!description) return '';
  if (description.length <= maxLength) return description;
  const cut = description.slice(0, maxLength).trim();
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > 80 ? cut.slice(0, lastSpace) : cut;
  return `${base}…`;
}

export function groupAssetsByCategory(assets: NormalizedAsset[]): Record<AssetCategory, NormalizedAsset[]> {
  const groups: Record<AssetCategory, NormalizedAsset[]> = {
    Learn: [],
    Build: [],
    Adopt: [],
  };
  for (const asset of assets) {
    groups[asset.category].push(asset);
  }
  return groups;
}

export function sortAssets(assets: NormalizedAsset[], sort: AssetSortOption): NormalizedAsset[] {
  const list = [...assets];
  if (sort === 'az') {
    return list.sort((a, b) => a.Asset.localeCompare(b.Asset, undefined, { sensitivity: 'base' }));
  }
  // "recent" — preserve reverse sheet order via id index
  return list.sort((a, b) => {
    const indexA = Number(a.id.match(/^asset-(\d+)-/)?.[1] ?? 0);
    const indexB = Number(b.id.match(/^asset-(\d+)-/)?.[1] ?? 0);
    return indexB - indexA;
  });
}

export function getUniqueTypes(assets: NormalizedAsset[]): string[] {
  const set = new Set<string>();
  for (const asset of assets) {
    set.add(getAssetTypeLabel(asset));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}
