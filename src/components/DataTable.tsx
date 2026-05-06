import { useState, useMemo } from 'react';

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
      const q = search.toLowerCase();
      data = data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(q)));
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
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {filtered.length} of {rows.length} records
          </p>
        </div>
        <div className="relative">
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all columns…"
            className="pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 w-56 text-gray-700"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable table */}
      <div
        className="rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
        style={{ maxHeight: 'calc(100vh - 11rem)' }}
      >
        {/* Sticky header */}
        <div className="overflow-x-auto flex-shrink-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                {headers.map(h => (
                  <th
                    key={h}
                    onClick={() => handleSort(h)}
                    className="px-4 py-2.5 text-left cursor-pointer select-none whitespace-nowrap text-xs font-semibold tracking-wide hover:bg-blue-700 transition-colors"
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
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-10 text-gray-400 text-sm">
                    No results found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    className={`transition-colors hover:bg-blue-50/50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
                  >
                    {headers.map(h => (
                      <td key={h} className="px-4 py-2.5 text-gray-700 max-w-xs whitespace-nowrap">
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
