import type { ReactNode } from 'react';

const inputClass =
  'w-full min-w-[12rem] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0539E3] focus:outline-none focus:ring-1 focus:ring-[#0539E3] sm:w-56';

type FilterPanelProps = {
  children: ReactNode;
  onClear: () => void;
};

export default function FilterPanel({ children, onClear }: FilterPanelProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {children}
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-[#0539E3]"
      >
        Clear
      </button>
    </div>
  );
}

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-[12rem] flex-col gap-1 text-xs font-medium text-slate-500">
      {label}
      {children}
    </label>
  );
}

export { inputClass };
