import { useState, useMemo } from 'react';
import { matchesQuery } from '../utils/listSearch';
import { ResultCount } from './directory/DirectoryPageLayout';
import { SearchInput } from './directory/FilterPanel';

interface DataTableProps {
  headers: string[];
  rows: Record<string, string>[];
  title: string;
}

export default function DataTable({ headers, rows, title }: DataTableProps) {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let data = rows;
    if (search.trim()) {
      data = data.filter(row => matchesQuery(search, ...Object.values(row)));
    }
    if (sortCol) {
      data = [...data].sort((a, b) => {
        const av = String(a[sortCol] ?? '').toLowerCase();
        const bv = String(b[sortCol] ?? '').toLowerCase();
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return data;
  }, [rows, search, sortCol, sortAsc]);

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(true); }
  };

  if (!headers.length) {
    return <div className="text-center py-12 text-gray-400 text-sm">No data available for this sheet.</div>;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <div className="mt-1">
            <ResultCount shown={filtered.length} total={rows.length} label="records" />
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search all columns…"
            className="w-full sm:w-72"
          />
          {search.trim() && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0539E3]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Scrollable table */}
      <div
        className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        style={{ maxHeight: 'calc(100vh - 11rem)' }}
      >
        {/* Sticky header */}
        <div className="flex-shrink-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0539E3] text-white">
                {headers.map(h => (
                  <th
                    key={h}
                    onClick={() => handleSort(h)}
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold tracking-wide transition-colors hover:bg-[#0432c4]"
                  >
                    <div className="flex items-center gap-1">
                      {h}
                      {sortCol === h ? (
                        <svg className={`w-3 h-3 transition-transform ${sortAsc ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 opacity-30" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable body */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="py-10 text-center text-sm text-slate-400">
                    No results found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    className={`transition-colors hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}
                  >
                    {headers.map(h => (
                      <td key={h} className="max-w-xs whitespace-nowrap px-4 py-2.5 text-slate-700">
                        <div className="truncate" title={row[h] || '—'}>
                          {row[h] || <span className="text-gray-300">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
