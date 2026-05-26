import { useMemo, useState } from 'react';
import AppFooter from '../AppFooter';
import FilterPanel, { SearchInput } from '../directory/FilterPanel';
import { ResultCount } from '../directory/DirectoryPageLayout';
import AssetCard from './AssetCard';
import AssetCategoryCard from './AssetCategoryCard';
import { sortAssets } from './assetUtils';
import { matchesQuery } from '../../utils/listSearch';
import type { AssetCategory, NormalizedAsset } from './assetTypes';

type AssetsHubProps = {
  assets: NormalizedAsset[];
  byCategory: Record<AssetCategory, NormalizedAsset[]>;
};

const WHY_ITEMS = [
  {
    label: 'Find what you need faster',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824 2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
    ),
  },
  {
    label: 'Focused resources for every stage',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    label: 'Designed for government teams',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    ),
  },
];

function HubHeroDecor() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible opacity-25"
      aria-hidden
    >
      <defs>
        <pattern id="assets-dot-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#94A3B8" fillOpacity="0.35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#assets-dot-grid)" />
      <path
        d="M120 180 Q280 120 420 200 T720 160"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        fill="none"
      />
      <path
        d="M80 320 Q320 260 520 340 T900 300"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        fill="none"
      />
    </svg>
  );
}

export default function AssetsHub({ assets, byCategory }: AssetsHubProps) {
  const [search, setSearch] = useState('');

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return sortAssets(
      assets.filter(a =>
        matchesQuery(
          search,
          a.Asset,
          a['Type of Asset'],
          a.Description,
          a['Target Audience'],
          a.category,
        ),
      ),
      'az',
    );
  }, [assets, search]);

  const categories: AssetCategory[] = ['Learn', 'Build', 'Adopt'];

  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0539E3]">Assets library</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">GovStack Assets Library</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Find guides, tools, and resources to accelerate digital government transformation.
          </p>
        </header>

        <FilterPanel
          onClear={() => {
            setSearch('');
          }}
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search assets…"
            className="flex-1 sm:w-72"
          />
        </FilterPanel>

        {search.trim() ? (
          <section>
            <ResultCount shown={searchResults.length} total={assets.length} label="assets" />
            {searchResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
                No assets match your search.
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map(asset => (
                  <li key={asset.id}>
                    <AssetCard asset={asset} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-2xl py-2">
              <div
                className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-sky-100/40 blur-3xl"
                aria-hidden
              />
              <HubHeroDecor />
              <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categories.map(category => (
                  <AssetCategoryCard
                    key={category}
                    category={category}
                    count={byCategory[category].length}
                  />
                ))}
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
              <p className="text-center text-sm font-medium text-slate-700">Why organize like this?</p>
              <ul className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
                {WHY_ITEMS.map(item => (
                  <li key={item.label} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
