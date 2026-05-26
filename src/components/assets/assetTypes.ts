export type AssetCategory = 'Learn' | 'Build' | 'Adopt';

export type AssetCategorySlug = 'learn' | 'build' | 'adopt';

export type AssetItem = {
  Asset: string;
  'Type of Asset'?: string;
  Link?: string;
  Description?: string;
  'Target Audience'?: string;
};

export type NormalizedAsset = AssetItem & {
  id: string;
  category: AssetCategory;
};

export type AssetSortOption = 'recent' | 'az';

export const CATEGORY_SLUGS: Record<AssetCategorySlug, AssetCategory> = {
  learn: 'Learn',
  build: 'Build',
  adopt: 'Adopt',
};

export const CATEGORY_META: Record<
  AssetCategory,
  {
    slug: AssetCategorySlug;
    title: string;
    description: string;
    cta: string;
    cardClass: string;
    iconClass: string;
    badgeClass: string;
    explanation: string;
  }
> = {
  Learn: {
    slug: 'learn',
    title: 'Learn',
    description: 'Methodology guides, playbooks, and reference materials.',
    cta: 'Explore Learn',
    cardClass: 'border-violet-100/80 bg-gradient-to-br from-violet-50 via-white to-indigo-50/60 hover:border-violet-200',
    iconClass: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200/60',
    badgeClass: 'bg-violet-100/90 text-violet-800 ring-1 ring-violet-200/50',
    explanation:
      'Educational and strategic resources—methodology guides, service design, playbooks, and training programmes.',
  },
  Build: {
    slug: 'build',
    title: 'Build',
    description: 'Technical building blocks, tools, and developer resources.',
    cta: 'Explore Build',
    cardClass: 'border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 hover:border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/60',
    badgeClass: 'bg-emerald-100/90 text-emerald-800 ring-1 ring-emerald-200/50',
    explanation:
      'Implementation resources—building blocks, sandboxes, APIs, repositories, and technical specifications.',
  },
  Adopt: {
    slug: 'adopt',
    title: 'Adopt',
    description: 'Readiness assessment and capacity-building programmes.',
    cta: 'Explore Adopt',
    cardClass: 'border-orange-100/80 bg-gradient-to-br from-orange-50 via-white to-amber-50/60 hover:border-orange-200',
    iconClass: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200/60',
    badgeClass: 'bg-orange-100/90 text-orange-800 ring-1 ring-orange-200/50',
    explanation:
      'Adoption resources—readiness assessment and capacity-building programmes to support rollout and scaling.',
  },
};
