import { Link } from 'react-router-dom';
import { CATEGORY_META } from './assetTypes';
import type { AssetCategory } from './assetTypes';

type AssetCategoryCardProps = {
  category: AssetCategory;
  count: number;
};

function CategoryIcon({ category }: { category: AssetCategory }) {
  const path =
    category === 'Learn'
      ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      : category === 'Build'
        ? 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        : 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

function CategoryIllustration({ category, className = '' }: { category: AssetCategory; className?: string }) {
  if (category === 'Learn') {
    return (
      <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden>
        <ellipse cx="60" cy="88" rx="42" ry="6" fill="#C4B5FD" fillOpacity="0.35" />
        <path d="M28 72V28c0-2 1.5-4 4-4h28l20 14v38c0 2-1.5 4-4 4H32c-2.5 0-4-2-4-4z" fill="#DDD6FE" />
        <path d="M60 24v48c0 2 1.5 4 4 4h24V38L68 24H60z" fill="#A78BFA" />
        <path d="M36 36h20v3H36v-3zm0 8h28v3H36v-3zm0 8h24v3H36v-3z" fill="#7C3AED" fillOpacity="0.25" />
        <path d="M64 24l20 14H68c-2.5 0-4-2-4-4V24z" fill="#8B5CF6" fillOpacity="0.5" />
      </svg>
    );
  }
  if (category === 'Build') {
    return (
      <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden>
        <ellipse cx="62" cy="88" rx="40" ry="6" fill="#6EE7B7" fillOpacity="0.35" />
        <path d="M24 44L48 28l24 16v28L48 88 24 72V44z" fill="#A7F3D0" />
        <path d="M48 28l24 16 24-16-24-16-24 16z" fill="#6EE7B7" />
        <path d="M72 44v28l24-16V28l-24 16z" fill="#34D399" />
        <rect x="78" y="18" width="32" height="22" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
        <text x="86" y="33" fill="#059669" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600">
          {'</>'}
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 100" fill="none" className={className} aria-hidden>
      <ellipse cx="58" cy="90" rx="38" ry="6" fill="#FDBA74" fillOpacity="0.35" />
      <rect x="32" y="22" width="52" height="64" rx="6" fill="#FFEDD5" stroke="#FB923C" strokeWidth="1.5" />
      <rect x="44" y="14" width="28" height="12" rx="4" fill="#FED7AA" stroke="#FB923C" strokeWidth="1.5" />
      <path
        d="M42 38h32M42 48h24M42 58h28M42 68h20"
        stroke="#F97316"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <circle cx="82" cy="68" r="14" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" />
      <path d="M88 74l8 8" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="82" cy="68" r="5" stroke="#EA580C" strokeWidth="2" />
    </svg>
  );
}

export default function AssetCategoryCard({ category, count }: AssetCategoryCardProps) {
  const meta = CATEGORY_META[category];

  return (
    <Link
      to={`/assets/${meta.slug}`}
      className={`group relative flex min-h-[240px] overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${meta.cardClass}`}
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col pr-28 sm:pr-32">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.iconClass}`}
          >
            <CategoryIcon category={category} />
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClass}`}>
            {count} {count === 1 ? 'asset' : 'assets'}
          </span>
        </div>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{meta.title}</h2>
        <p className="mt-2 max-w-[220px] flex-1 text-sm leading-relaxed text-slate-600">
          {meta.description}
        </p>

        <span
          className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0539E3] text-white shadow-md shadow-[#0539E3]/25 transition-transform group-hover:scale-105"
          aria-hidden
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <CategoryIllustration
        category={category}
        className="pointer-events-none absolute -bottom-2 right-0 h-28 w-32 sm:h-32 sm:w-36 opacity-95 transition-transform duration-200 group-hover:scale-105"
      />
    </Link>
  );
}
