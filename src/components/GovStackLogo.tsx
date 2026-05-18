/**
 * GovStack wordmark (govstack-logo.svg) — same asset as govstack.global header.
 */
export default function GovStackLogo({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://govstack.global/"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 group outline-none focus-visible:ring-2 focus-visible:ring-[#0539E3]/30 focus-visible:ring-offset-2 rounded-sm ${className}`}
      aria-label="GovStack — open official site"
    >
      <img
        src="/brand/govstack-logo.svg"
        alt="GovStack"
        className="h-8 w-auto max-w-[min(200px,40vw)] object-contain object-left"
        width={100}
        height={49}
      />
      <span className="hidden sm:block h-8 w-px bg-slate-200" aria-hidden />
      <span className="hidden sm:block text-[11px] font-medium uppercase tracking-wide text-slate-500 leading-tight">
        Dashboard
        <span className="block text-slate-400 font-normal normal-case tracking-normal text-[10px]">
          demo
        </span>
      </span>
    </a>
  );
}
