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
import { LEARN_ACADEMY_LINKS, type LearnAcademyLink } from './learnAcademyLinks';
import { CATEGORY_META } from './assetTypes';
import type { AssetCategory, NormalizedAsset } from './assetTypes';

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

function LearnAcademyColumn({ links, searchActive }: { links: LearnAcademyLink[]; searchActive: boolean }) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="overflow-hidden rounded-xl border border-violet-200/70 bg-gradient-to-b from-violet-50/90 via-white to-white shadow-sm">
        <div className="border-b border-violet-100/80 bg-violet-50/50 px-4 py-3.5 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
            ITU Academy
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-900">Courses</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            E-learning on academy.itu.int — opens in a new tab.
          </p>
        </div>

        {links.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-400 sm:px-5">
            {searchActive ? 'No courses match your search.' : 'No courses listed.'}
          </p>
        ) : (
          <ul className="max-h-[min(70vh,640px)] overflow-y-auto px-2 py-2 sm:px-3">
            {links.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition-colors hover:bg-violet-50/80"
                >
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-violet-100/80 text-violet-700 ring-1 ring-violet-200/50">
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 font-medium leading-snug text-slate-800 group-hover:text-[#0539E3]">
                    {link.title.replace(/\s*\|\s*ITU Academy\s*$/i, '')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <p className="border-t border-violet-100/80 px-4 py-2.5 text-center text-[11px] text-slate-400 sm:px-5">
            {links.length} {links.length === 1 ? 'course' : 'courses'}
          </p>
        )}
      </div>
    </aside>
  );
}

function ResourceGrid({ assets }: { assets: NormalizedAsset[] }) {
  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
        No resources match your filters.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
      {assets.map(asset => (
        <li key={asset.id}>
          <AssetCard asset={asset} />
        </li>
      ))}
    </ul>
  );
}

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

  const academyLinks = useMemo(() => {
    if (category !== 'Learn') return [];
    if (!search.trim()) return LEARN_ACADEMY_LINKS;
    return LEARN_ACADEMY_LINKS.filter(link => matchesQuery(search, link.title));
  }, [category, search]);

  const isLearnSplit = category === 'Learn';
  const searchActive = Boolean(search.trim());

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

        {isLearnSplit ? (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            <LearnAcademyColumn links={academyLinks} searchActive={searchActive} />

            <section className="min-w-0">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Library resources</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Guides, playbooks, and materials from the GovStack library
                  </p>
                </div>
                <ResultCount
                  shown={filtered.length}
                  total={categoryAssets.length}
                  label="resources"
                />
              </div>
              <ResourceGrid assets={filtered} />
            </section>
          </div>
        ) : (
          <>
            <ResultCount shown={filtered.length} total={categoryAssets.length} label="resources" />
            <ResourceGrid assets={filtered} />
          </>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
