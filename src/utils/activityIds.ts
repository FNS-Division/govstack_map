import type { ActivitySubmissionRecord } from '../api/activitySubmissions';

const EXCEL_PREFIX = 'excel:';
const SUBMISSION_PREFIX = 'submission:';

function normalizePart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Stable id for an Excel Global view row (same row → same id). */
export function excelActivityId(region: string, country: string, activity: string): string {
  const key = [normalizePart(region), normalizePart(country), normalizePart(activity)].join('|');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return `${EXCEL_PREFIX}${Math.abs(hash).toString(36)}`;
}

/** Deterministic id when publishing a validated submission. */
export function submissionActivityId(submissionId: string): string {
  return `${SUBMISSION_PREFIX}${submissionId}`;
}

export function formatFocalPoint(name?: string | null, email?: string | null): string | undefined {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  if (trimmedName && trimmedEmail) return `${trimmedName} (${trimmedEmail})`;
  return trimmedName || trimmedEmail || undefined;
}

export function publishedActivityFromSubmission(
  record: ActivitySubmissionRecord,
  publishedBy?: string | null,
): {
  activity_id: string;
  region: string;
  country: string;
  activity: string;
  description: string;
  status: string;
  focal_point?: string;
  budget?: string;
  timeline?: string;
  focal_point_name?: string;
  focal_point_email?: string;
  location?: string;
  building_block?: string;
  use_case?: string;
  video_url?: string;
  image_keys?: string[];
  source: string;
  source_id: string;
  published_at: string;
  updated_at: string;
  published_by?: string;
} {
  const now = new Date().toISOString();
  return {
    activity_id: submissionActivityId(record.submission_id),
    region: record.region?.trim() ?? '',
    country: record.country?.trim() ?? '',
    activity: record.activity?.trim() ?? '',
    description: record.description?.trim() ?? '',
    status: record.status?.trim() ?? '',
    focal_point: formatFocalPoint(record.focal_point_name, record.focal_point_email),
    budget: record.budget?.trim() || undefined,
    timeline: record.timeline?.trim() || undefined,
    focal_point_name: record.focal_point_name?.trim() || undefined,
    focal_point_email: record.focal_point_email?.trim() || undefined,
    location: record.location?.trim() || undefined,
    building_block: record.building_block?.trim() || undefined,
    use_case: record.use_case?.trim() || undefined,
    video_url: record.video_url?.trim() || undefined,
    image_keys: record.image_keys ?? undefined,
    source: 'submission',
    source_id: record.submission_id,
    published_at: now,
    updated_at: now,
    published_by: publishedBy?.trim() || undefined,
  };
}
