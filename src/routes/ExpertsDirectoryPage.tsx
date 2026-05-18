import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import DirectoryPageLayout, { ResultCount } from '../components/directory/DirectoryPageLayout';
import FilterPanel, { FilterField, inputClass } from '../components/directory/FilterPanel';
import {
  avatarClass,
  expertMetaRows,
  initials,
  mapRowToExpert,
  tagClass,
  type ExpertRecord,
} from '../utils/expertsDirectory';

function ExpertCard({ expert }: { expert: ExpertRecord }) {
  const meta = expertMetaRows(expert);
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarClass(expert.name)}`}
        >
          {initials(expert.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{expert.name}</h2>
              {expert.profileUrl ? (
                <a
                  href={expert.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 text-sm text-[#0539E3] hover:underline"
                >
                  View profile
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <p className="mt-0.5 text-sm text-slate-500">{expert.email}</p>
              )}
            </div>
          </div>

          {expert.specializations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {expert.specializations.map(tag => {
                const style = tagClass(tag);
                return (
                  <span
                    key={tag}
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {expert.comment && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{expert.comment}</p>
          )}

          {meta.length > 0 && (
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {meta.map(({ label, value }) => (
                <div key={label} className="flex gap-1.5">
                  <dt className="text-slate-400">{label}:</dt>
                  <dd className="font-medium text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ExpertsDirectoryPage() {
  const { sheets, loading, error } = useData();
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [areaFilter, setAreaFilter] = useState('');

  const sheetKey = Object.keys(sheets).find(k => k.toLowerCase().includes('expert'));

  const experts = useMemo(() => {
    if (!sheetKey) return [];
    return sheets[sheetKey].rows.map((row, i) => mapRowToExpert(row, i));
  }, [sheetKey, sheets]);

  const areaOptions = useMemo(() => {
    const set = new Set<string>();
    experts.forEach(e => e.specializations.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [experts]);

  const filtered = useMemo(() => {
    let list = experts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.comment.toLowerCase().includes(q) ||
          e.specializations.some(s => s.toLowerCase().includes(q))
      );
    }
    if (areaFilter) list = list.filter(e => e.specializations.some(s => s === areaFilter));
    return list;
  }, [experts, search, areaFilter]);

  const filtersPanel = (
    <FilterPanel
      onClear={() => {
        setSearch('');
        setAreaFilter('');
      }}
    >
      <FilterField label="Search">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Name, specialization…"
          className={inputClass}
        />
      </FilterField>
      <FilterField label="Specialization">
        <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className={inputClass}>
          <option value="">All</option>
          {areaOptions.map(a => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </FilterField>
    </FilterPanel>
  );

  return (
    <DirectoryPageLayout
      title="Technical Experts Directory"
      subtitle="Accredited ITU–GovStack consultants for global digital transformation projects."
      loading={loading}
      error={error}
      sheetMissing={!sheetKey && !loading && !error}
      sheetMissingMessage="Experts sheet not found in the Excel file."
      filtersOpen={filtersOpen}
      onToggleFilters={() => setFiltersOpen(o => !o)}
      filtersPanel={filtersPanel}
      resultSummary={<ResultCount shown={filtered.length} total={experts.length} label="experts" />}
    >
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
          No experts match your filters.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(expert => (
            <li key={expert.id}>
              <ExpertCard expert={expert} />
            </li>
          ))}
        </ul>
      )}

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Expert Requests</h2>
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-400">
          No recent requests to display.
        </div>
      </section>
    </DirectoryPageLayout>
  );
}
