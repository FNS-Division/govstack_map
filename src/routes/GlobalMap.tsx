import { useEffect, useState, useMemo } from 'react';
import { listAllPublishedActivities } from '../api/publishedActivities';
import { useData } from '../context/DataContext';
import MapView, { type ActivityRow, type FocalPointRow } from '../components/MapView';
import FilterSidebar, { type Filters } from '../components/FilterSidebar';
import UnmappedPanel from '../components/UnmappedPanel';
import { getCoordinates } from '../data/countryCoordinates';
import { matchesQuery } from '../utils/listSearch';
import {
  excelRowToActivityRow,
  mergeMapActivities,
  publishedToActivityRow,
} from '../utils/mergeMapActivities';

function unique(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))].sort();
}

export default function GlobalMap() {
  const { sheets, loading, error } = useData();

  const [filters, setFilters] = useState<Filters>({
    region: '',
    status: '',
    activity: '',
    focalPoint: '',
    search: '',
  });
  const [showUnmapped, setShowUnmapped] = useState(false);
  const [publishedActivities, setPublishedActivities] = useState<ActivityRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const items = await listAllPublishedActivities();
        if (!cancelled) {
          setPublishedActivities(items.map(publishedToActivityRow));
        }
      } catch {
        if (!cancelled) {
          setPublishedActivities([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const globalViewSheet = useMemo(() => {
    const key = Object.keys(sheets).find(k =>
      k.toLowerCase().includes('global view') || k.toLowerCase().includes('global')
    );
    return key ? sheets[key] : null;
  }, [sheets]);

  const focalPointsSheet = useMemo(() => {
    const key = Object.keys(sheets).find(k =>
      k.toLowerCase().includes('focal point')
    );
    return key ? sheets[key] : null;
  }, [sheets]);

  const excelActivities = useMemo((): ActivityRow[] => {
    if (!globalViewSheet) return [];
    return globalViewSheet.rows
      .map(row => excelRowToActivityRow(row as Record<string, string>))
      .filter((row): row is ActivityRow => row !== null);
  }, [globalViewSheet]);

  const allActivities = useMemo(
    () => mergeMapActivities(excelActivities, publishedActivities),
    [excelActivities, publishedActivities],
  );

  // Parse focal point rows
  const allFocalPoints = useMemo((): FocalPointRow[] => {
    if (!focalPointsSheet) return [];
    return focalPointsSheet.rows.map((row, i) => ({
      id: `fp-${i}`,
      name: row['Name'] || '',
      email: row['Email'] || '',
      location: row['Location'] || '',
      region: row['Region'] || '',
    })).filter(r => r.name || r.location);
  }, [focalPointsSheet]);

  // Filter options
  const filterOptions = useMemo(() => ({
    regions: unique([
      ...allActivities.map(r => r.region),
      ...allFocalPoints.map(r => r.region),
    ]),
    statuses: unique(allActivities.map(r => r.status)),
    activities: unique(allActivities.map(r => r.activity)),
    focalPoints: unique(allActivities.map(r => r.focalPoint)),
  }), [allActivities, allFocalPoints]);

  // Apply activity filters
  const filteredActivities = useMemo(() => {
    return allActivities.filter(row => {
      if (filters.region && row.region !== filters.region) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.activity && row.activity !== filters.activity) return false;
      if (filters.focalPoint && row.focalPoint !== filters.focalPoint) return false;
      if (!matchesQuery(filters.search, row.country, row.description, row.activity)) return false;
      return true;
    });
  }, [allActivities, filters]);

  // Apply focal point filters (region + search only)
  const filteredFocalPoints = useMemo(() => {
    return allFocalPoints.filter(row => {
      if (filters.region && row.region !== filters.region) return false;
      if (!matchesQuery(filters.search, row.name, row.location)) return false;
      return true;
    });
  }, [allFocalPoints, filters]);

  // Unmapped rows
  const unmappedRows = useMemo(() => {
    const actUnmapped = filteredActivities
      .filter(r => !getCoordinates(r.country))
      .map(r => ({ location: r.country, data: r as unknown as Record<string, string>, type: 'activity' as const }));
    const fpUnmapped = filteredFocalPoints
      .filter(r => !getCoordinates(r.location || r.name))
      .map(r => ({ location: r.location || r.name, data: r as unknown as Record<string, string>, type: 'focal' as const }));
    return [...actUnmapped, ...fpUnmapped];
  }, [filteredActivities, filteredFocalPoints]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading GovStack data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-200 max-w-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <h3 className="font-semibold text-gray-700 mb-1">Failed to load data</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const totalCount = allActivities.length + allFocalPoints.length;
  const filteredCount = filteredActivities.length + filteredFocalPoints.length;

  return (
    <div className="relative w-full h-full">
      <MapView
        activities={filteredActivities}
        focalPoints={filteredFocalPoints}
      />

      <FilterSidebar
        filters={filters}
        options={filterOptions}
        onChange={setFilters}
        totalCount={totalCount}
        filteredCount={filteredCount}
        unmappedCount={unmappedRows.length}
        onShowUnmapped={() => setShowUnmapped(v => !v)}
      />

      {showUnmapped && (
        <UnmappedPanel
          rows={unmappedRows}
          onClose={() => setShowUnmapped(false)}
        />
      )}
    </div>
  );
}
