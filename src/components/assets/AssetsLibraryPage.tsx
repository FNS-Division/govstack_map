import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PageSpinner } from '../directory/DirectoryPageLayout';
import AssetsCategoryView from './AssetsCategoryView';
import AssetsHub from './AssetsHub';
import { groupAssetsByCategory, normalizeAsset } from './assetUtils';
import { CATEGORY_SLUGS } from './assetTypes';
import type { AssetCategorySlug } from './assetTypes';

function isCategorySlug(value: string | undefined): value is AssetCategorySlug {
  return value === 'learn' || value === 'build' || value === 'adopt';
}

export default function AssetsLibraryPage() {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const { sheets, loading, error } = useData();

  const sheetKey = Object.keys(sheets).find(k => k.toLowerCase().includes('asset'));
  const sheetMissing = !sheetKey && !loading && !error;

  const assets = useMemo(() => {
    if (!sheetKey) return [];
    return sheets[sheetKey].rows.map((row, index) => normalizeAsset(row, index));
  }, [sheetKey, sheets]);

  const byCategory = useMemo(() => groupAssetsByCategory(assets), [assets]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-sm text-red-600">Failed to load data: {error}</div>;
  }

  if (sheetMissing) {
    return (
      <div className="py-12 text-center text-sm text-slate-500">
        Assets sheet not found in the Excel file.
      </div>
    );
  }

  if (categorySlug === 'assess') {
    return <Navigate to="/assets/adopt" replace />;
  }

  if (categorySlug && !isCategorySlug(categorySlug)) {
    return <Navigate to="/assets" replace />;
  }

  if (isCategorySlug(categorySlug)) {
    const category = CATEGORY_SLUGS[categorySlug];
    return <AssetsCategoryView category={category} assets={assets} />;
  }

  return <AssetsHub assets={assets} byCategory={byCategory} />;
}
