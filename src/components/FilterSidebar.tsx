import { useState } from 'react';

export interface Filters {
  region: string;
  status: string;
  activity: string;
  focalPoint: string;
  search: string;
}

interface FilterSidebarProps {
  filters: Filters;
  options: {
    regions: string[];
    statuses: string[];
    activities: string[];
    focalPoints: string[];
  };
  onChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
  unmappedCount: number;
  onShowUnmapped: () => void;
}

export default function FilterSidebar({
  filters,
  options,
  onChange,
  totalCount,
  filteredCount,
  unmappedCount,
  onShowUnmapped,
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const clearAll = () =>
    onChange({ region: '', status: '', activity: '', focalPoint: '', search: '' });

  const hasFilters = Object.values(filters).some(Boolean);

  if (collapsed) {
    return (
      <div className="absolute top-3 left-3 z-[1000]">
        <button
          onClick={() => setCollapsed(false)}
          title="Open filters"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute top-3 left-3 z-[1000] w-60 rounded-xl bg-white overflow-hidden flex flex-col border border-gray-200"
      style={{ maxHeight: 'calc(100vh - 5rem)', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between flex-shrink-0 bg-blue-600">
        <div>
          <div className="text-white text-xs font-bold">GovStack Global</div>
          <div className="text-blue-100 text-xs mt-0.5">{filteredCount} / {totalCount} shown</div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          title="Collapse"
          className="text-blue-200 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 p-3 space-y-3">

        {/* Search */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Search
          </label>
          <div className="relative">
            <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={e => update('search', e.target.value)}
              placeholder="Country, activity…"
              className="w-full pl-7 pr-7 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700"
            />
            {filters.search && (
              <button onClick={() => update('search', '')} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <FilterSelect label="Region"      value={filters.region}     options={options.regions}     onChange={v => update('region', v)} />
        <FilterSelect label="Status"      value={filters.status}     options={options.statuses}    onChange={v => update('status', v)} />
        <FilterSelect label="Activity"    value={filters.activity}   options={options.activities}  onChange={v => update('activity', v)} />
        <FilterSelect label="Focal Point" value={filters.focalPoint} options={options.focalPoints} onChange={v => update('focalPoint', v)} />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="w-full text-xs font-medium py-1.5 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            Clear all filters
          </button>
        )}

        {/* Legend */}
        <div className="border-t border-gray-100 pt-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm flex-shrink-0" />
              <span className="text-xs text-gray-600">Country Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-sm flex-shrink-0" />
              <span className="text-xs text-gray-600">Focal Point</span>
            </div>
          </div>
        </div>

        {unmappedCount > 0 && (
          <button
            onClick={onShowUnmapped}
            className="w-full text-left text-xs rounded-md px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <span className="font-semibold">{unmappedCount} unmapped</span> rows — click to view
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-700"
      >
        <option value="">All {label}s</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
