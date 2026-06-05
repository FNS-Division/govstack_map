import type { PublishedActivityRecord } from '../api/publishedActivities';
import type { ActivityRow } from '../components/MapView';
import { excelActivityId } from './activityIds';

export function excelRowToActivityRow(row: Record<string, string>): ActivityRow | null {
  const country = row['Country'] || row['country'] || '';
  if (!country.trim()) return null;

  const region = row['Region'] || '';
  const activity = row['Activity'] || '';

  return {
    id: excelActivityId(region, country, activity),
    country,
    region,
    activity,
    description: row['Description'] || '',
    status: row['Status'] || '',
    focalPoint: row['Focal Point'] || '',
    budget: row['Budget'] || '',
    timeline: row['Timeline'] || '',
    resources: row['Resources'] || '',
    resourcesUrl: row['Resources URL'] || '',
  };
}

export function publishedToActivityRow(record: PublishedActivityRecord): ActivityRow {
  return {
    id: record.activity_id,
    country: record.country,
    region: record.region,
    activity: record.activity,
    description: record.description,
    status: record.status,
    focalPoint: record.focal_point ?? '',
    budget: record.budget ?? '',
    timeline: record.timeline ?? '',
    resources: '',
    resourcesUrl: '',
  };
}

/** Excel baseline; published API rows overwrite on the same activity_id. */
export function mergeMapActivities(excel: ActivityRow[], published: ActivityRow[]): ActivityRow[] {
  const byId = new Map<string, ActivityRow>();
  for (const row of excel) {
    byId.set(row.id, row);
  }
  for (const row of published) {
    byId.set(row.id, row);
  }
  return [...byId.values()];
}
