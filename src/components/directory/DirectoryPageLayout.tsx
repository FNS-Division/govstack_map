import type { ReactNode } from 'react';
import AppFooter from '../AppFooter';
import FiltersIcon from '../FiltersIcon';

type DirectoryPageLayoutProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  loading: boolean;
  error: string | null;
  sheetMissing?: boolean;
  sheetMissingMessage?: string;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  filtersPanel?: ReactNode;
  resultSummary: ReactNode;
  children: ReactNode;
};

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#0539E3]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function DirectoryPageLayout({
  eyebrow,
  title,
  subtitle,
  loading,
  error,
  sheetMissing,
  sheetMissingMessage = 'Sheet not found in the Excel file.',
  filtersOpen,
  onToggleFilters,
  filtersPanel,
  resultSummary,
  children,
}: DirectoryPageLayoutProps) {
  if (loading) return <PageSpinner />;

  if (error) {
    return <div className="py-12 text-center text-sm text-red-600">Failed to load data: {error}</div>;
  }

  if (sheetMissing) {
    return <div className="py-12 text-center text-sm text-slate-500">{sheetMissingMessage}</div>;
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0539E3]">{eyebrow}</p>
            )}
            <h1 className={`text-2xl font-bold tracking-tight text-slate-900 ${eyebrow ? 'mt-2' : ''}`}>
              {title}
            </h1>
            <p className={`max-w-2xl text-sm text-slate-500 ${eyebrow ? 'mt-2' : 'mt-1'}`}>{subtitle}</p>
          </div>
          {onToggleFilters && filtersPanel && (
            <button
              type="button"
              onClick={onToggleFilters}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <FiltersIcon />
              Filters
            </button>
          )}
        </div>

        {filtersPanel && (onToggleFilters ? Boolean(filtersOpen) : true) && filtersPanel}

        {resultSummary}

        {children}
      </div>
      <AppFooter />
    </div>
  );
}

export function ResultCount({ shown, total, label }: { shown: number; total: number; label: string }) {
  const noun = shown === 1 ? label.replace(/s$/, '') : label;
  return (
    <p className="mb-4 text-sm text-slate-500">
      {shown === total ? (
        <>
          Showing all <span className="font-medium text-slate-700">{total}</span> {total === 1 ? noun : label}
        </>
      ) : (
        <>
          <span className="font-medium text-slate-700">{shown}</span> of{' '}
          <span className="font-medium text-slate-700">{total}</span> {label}
        </>
      )}
    </p>
  );
}
