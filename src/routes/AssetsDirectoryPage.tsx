import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import DirectoryPageLayout, { ResultCount } from '../components/directory/DirectoryPageLayout';
import FilterPanel, { FilterField, inputClass } from '../components/directory/FilterPanel';
import { mapRowToAsset, tagClass, type AssetRecord } from '../utils/assetsDirectory';

const DESCRIPTION_COLLAPSE_AT = 220;

function AssetCard({ asset }: { asset: AssetRecord }) {
  const [expanded, setExpanded] = useState(false);
  const typeStyle = tagClass(asset.type);
  const longDescription = asset.description.length > DESCRIPTION_COLLAPSE_AT;
  const description =
    longDescription && !expanded
      ? `${asset.description.slice(0, DESCRIPTION_COLLAPSE_AT).trim()}…`
      : asset.description;

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${typeStyle.bg} ${typeStyle.text}`}
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
          {asset.type}
        </span>
      </div>

      <h2 className="text-base font-semibold leading-snug text-slate-900">{asset.name}</h2>

      {asset.description && asset.description !== '—' && (
        <div className="mt-3 flex-1">
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          {longDescription && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="mt-1 text-sm font-medium text-[#0539E3] hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {asset.audience && asset.audience !== '—' && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          <span className="font-medium text-slate-400">Audience: </span>
          {asset.audience}
        </p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-4">
        {asset.link ? (
          <a
            href={asset.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0539E3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0432c4]"
          >
            Open resource
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <span className="block text-center text-sm text-slate-400">No link available</span>
        )}
      </div>
    </article>
  );
}

export default function AssetsDirectoryPage() {
  const { sheets, loading, error } = useData();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const sheetKey = Object.keys(sheets).find(k => k.toLowerCase().includes('asset'));

  const assets = useMemo(() => {
    if (!sheetKey) return [];
    return sheets[sheetKey].rows.map((row, i) => mapRowToAsset(row, i));
  }, [sheetKey, sheets]);

  const typeOptions = useMemo(() => {
    const set = new Set(assets.map(a => a.type).filter(t => t && t !== '—'));
    return Array.from(set).sort();
  }, [assets]);

  const filtered = useMemo(() => {
    let list = assets;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.audience.toLowerCase().includes(q)
      );
    }
    if (typeFilter) list = list.filter(a => a.type === typeFilter);
    return list;
  }, [assets, search, typeFilter]);

  const filtersPanel = (
    <FilterPanel
      onClear={() => {
        setSearch('');
        setTypeFilter('');
      }}
    >
      <FilterField label="Search">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Name, type, description…"
          className={inputClass}
        />
      </FilterField>
      <FilterField label="Type">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={inputClass}>
          <option value="">All</option>
          {typeOptions.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FilterField>
    </FilterPanel>
  );

  return (
    <DirectoryPageLayout
      title="GovStack Assets Library"
      subtitle="Methodology guides, playbooks, and reference materials for digital government transformation."
      loading={loading}
      error={error}
      sheetMissing={!sheetKey && !loading && !error}
      sheetMissingMessage="Assets sheet not found in the Excel file."
      filtersOpen={filtersOpen}
      onToggleFilters={() => setFiltersOpen(o => !o)}
      filtersPanel={filtersPanel}
      resultSummary={<ResultCount shown={filtered.length} total={assets.length} label="assets" />}
    >
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
          No assets match your filters.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map(asset => (
            <li key={asset.id}>
              <AssetCard asset={asset} />
            </li>
          ))}
        </ul>
      )}
    </DirectoryPageLayout>
  );
}
