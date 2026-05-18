export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© {new Date().getFullYear()} GovStack Initiative</span>
          <a
            href="https://govstack.global/privacy/"
            className="hover:text-[#0539E3] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Legal
          </a>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <a
            href="https://govstack.global/coc/"
            className="hover:text-[#0539E3] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code of Conduct
          </a>
        </div>
        <div className="flex items-center gap-2 font-medium text-slate-600">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          System Status: <span className="text-emerald-600">Operational</span>
        </div>
      </div>
    </footer>
  );
}
