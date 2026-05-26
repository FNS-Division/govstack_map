import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../AppFooter';
import { ResultCount } from '../directory/DirectoryPageLayout';
import FilterPanel, { FilterPills, SearchInput } from '../directory/FilterPanel';
import AssetCard from './AssetCard';
import {
  getAssetTypeLabel,
  getUniqueTypes,
  sortAssets,
} from './assetUtils';
import { matchesQuery } from '../../utils/listSearch';
import { CATEGORY_META } from './assetTypes';
import type { AssetCategory, NormalizedAsset } from './assetTypes';

type AssetsCategoryViewProps = {
  category: AssetCategory;
  assets: NormalizedAsset[];
};

export default function AssetsCategoryView({ category, assets }: AssetsCategoryViewProps) {
  const meta = CATEGORY_META[category];
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const categoryAssets = useMemo(
    () => assets.filter(asset => asset.category === category),
    [assets, category],
  );

  const typeOptions = useMemo(() => getUniqueTypes(categoryAssets), [categoryAssets]);

  const filtered = useMemo(() => {
    let list = categoryAssets;
    if (search.trim()) {
      list = list.filter(asset =>
        matchesQuery(
          search,
          asset.Asset,
          asset['Type of Asset'],
          asset.Description,
          asset['Target Audience'],
          asset.category,
        ),
      );
    }
    if (typeFilter) {
      list = list.filter(asset => getAssetTypeLabel(asset) === typeFilter);
    }
    return sortAssets(list, 'az');
  }, [categoryAssets, search, typeFilter]);

  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm">
          <Link to="/assets" className="font-medium text-[#0539E3] hover:underline">
            ← Assets Library
          </Link>
        </nav>

        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0539E3]">Assets library</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{meta.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{meta.explanation}</p>
        </header>

        <div
          className={`mb-6 rounded-xl border bg-gradient-to-br px-4 py-3 sm:px-5 ${meta.cardClass}`}
        >
          <p className="text-sm font-medium text-slate-700">
            {categoryAssets.length} {categoryAssets.length === 1 ? 'resource' : 'resources'} in{' '}
            {meta.title}
          </p>
        </div>

        <FilterPanel
          onClear={() => {
            setSearch('');
            setTypeFilter('');
          }}
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={`Search in ${meta.title}…`}
            className="flex-1 sm:w-72"
          />
          {typeOptions.length > 0 && (
            <FilterPills
              options={[{ id: '', label: 'All types' }, ...typeOptions.map(type => ({ id: type, label: type }))]}
              active={typeFilter}
              onChange={id => setTypeFilter(prev => (prev === id && id !== '' ? '' : id))}
            />
          )}
        </FilterPanel>

        <ResultCount shown={filtered.length} total={categoryAssets.length} label="resources" />

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            No assets match your filters.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(asset => (
              <li key={asset.id}>
                <AssetCard asset={asset} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
