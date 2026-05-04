interface UnmappedPanelProps {
  rows: { location: string; data: Record<string, string>; type: 'activity' | 'focal' }[];
  onClose: () => void;
}

export default function UnmappedPanel({ rows, onClose }: UnmappedPanelProps) {
  if (!rows.length) return null;

  return (
    <div className="absolute bottom-5 right-4 z-[1000] w-72 rounded-xl overflow-hidden border border-gray-200 shadow-lg bg-white">
      {/* header */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-amber-500">
        <div>
          <div className="text-white text-xs font-bold">Unmapped Rows</div>
          <div className="text-amber-100 text-xs">{rows.length} locations not geocoded</div>
        </div>
        <button onClick={onClose} className="text-amber-100 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* rows */}
      <div className="overflow-y-auto divide-y divide-gray-100" style={{ maxHeight: 260 }}>
        {rows.map((row, idx) => (
          <div key={idx} className="px-4 py-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                row.type === 'focal'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {row.type === 'focal' ? 'FP' : 'Act'}
              </span>
              <span className="text-xs font-medium text-gray-700 truncate">
                {row.location || '(no location)'}
              </span>
            </div>
            {row.data['Name'] && (
              <div className="text-xs text-gray-400 mt-0.5 pl-8">{row.data['Name']}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
