import { tagClass } from '../../utils/tagStyles';
import AssetIcon from './AssetIcon';
import { getAssetTypeLabel, getAudienceChips, getShortDescription } from './assetUtils';
import type { NormalizedAsset } from './assetTypes';

type AssetCardProps = {
  asset: NormalizedAsset;
};

export default function AssetCard({ asset }: AssetCardProps) {
  const typeLabel = getAssetTypeLabel(asset);
  const typeStyle = tagClass(typeLabel);
  const description = getShortDescription(asset);
  const audienceChips = getAudienceChips(asset);
  const hasLink = Boolean(asset.Link?.trim());

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <AssetIcon asset={asset} />
        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeLabel}
          </span>
          <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900">{asset.Asset}</h3>
        </div>
      </div>

      {description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{description}</p>
      )}

      {audienceChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {audienceChips.slice(0, 3).map(chip => (
            <span
              key={chip}
              className="inline-flex max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              title={chip}
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        {hasLink ? (
          <a
            href={asset.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0539E3] hover:text-[#0432c4] hover:underline"
          >
            Open
            <span aria-hidden>→</span>
          </a>
        ) : (
          <span className="text-sm font-medium text-slate-400">Coming soon</span>
        )}
      </div>
    </article>
  );
}
