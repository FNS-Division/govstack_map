import type { ReactNode } from 'react';

export const inputClass =
  'h-[42px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-[#0539E3] focus:outline-none focus:ring-1 focus:ring-[#0539E3]';

export function filterPillClass(active: boolean) {
  return active
    ? 'bg-[#0539E3] text-white'
    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50';
}

type FilterPanelProps = {
  children: ReactNode;
  onClear: () => void;
};

export default function FilterPanel({ children, onClear }: FilterPanelProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {children}
      <button
        type="button"
        onClick={onClear}
        className="h-[42px] rounded-lg px-3 text-sm font-medium text-slate-600 hover:text-[#0539E3]"
      >
        Clear
      </button>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-10`}
      />
    </div>
  );
}

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  counts,
  size = 'sm',
}: {
  options: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  counts?: Partial<Record<T, number>>;
  size?: 'sm' | 'md';
}) {
  const padding = size === 'md' ? 'px-3 text-sm' : 'px-3 text-xs';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map(option => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`h-[42px] rounded-full font-medium transition-colors ${padding} ${filterPillClass(active === option.id)}`}
        >
          {option.label}
          {counts?.[option.id] !== undefined && (
            <span className="ml-1 opacity-80">({counts[option.id]})</span>
          )}
        </button>
      ))}
    </div>
  );
}
