import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ADMIN_REQUIRED_MESSAGE,
  isGraphqlUnauthorizedError,
  listAllActivitySubmissions,
  updateActivitySubmissionReviewStatus,
  type ActivitySubmissionRecord,
  type ReviewSubmissionStatus,
} from '../api/activitySubmissions';
import AppFooter from '../components/AppFooter';
import { PageSpinner } from '../components/directory/DirectoryPageLayout';
import { useIsAdmin } from '../utils/authRoles';

type StatusFilter = 'all' | 'pending' | 'validated' | 'rejected';

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'validated', label: 'Validated' },
  { id: 'rejected', label: 'Rejected' },
];

function normalizeReviewStatus(status: string | null | undefined): string {
  const value = (status ?? 'pending').toLowerCase();
  if (value === 'approved') return 'validated';
  return value;
}

function statusBadgeClass(status: string | null | undefined) {
  const value = normalizeReviewStatus(status);
  if (value === 'validated') {
    return 'bg-emerald-50 text-emerald-800 ring-emerald-600/20';
  }
  if (value === 'rejected') {
    return 'bg-red-50 text-red-700 ring-red-600/20';
  }
  return 'bg-amber-50 text-amber-800 ring-amber-600/20';
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function SubmissionCard({
  record,
  expanded,
  onToggle,
  onReviewStatusChange,
  isUpdating,
  actionError,
}: {
  record: ActivitySubmissionRecord;
  expanded: boolean;
  onToggle: () => void;
  onReviewStatusChange: (submissionId: string, status: ReviewSubmissionStatus) => void;
  isUpdating: boolean;
  actionError: string | null;
}) {
  const reviewStatus = normalizeReviewStatus(record.submission_status);
  const isPending = reviewStatus === 'pending';

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-50/80"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{record.activity || 'Untitled activity'}</h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(reviewStatus)}`}
            >
              {reviewStatus}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {record.region || '—'} · {record.country || '—'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {formatDate(record.created_at)} · {record.submitted_by || 'Unknown submitter'}
          </p>
        </div>
        <svg
          className={`mt-1 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailRow label="Submission ID" value={record.submission_id} />
            <DetailRow label="Activity status" value={record.status} />
            <DetailRow label="Location" value={record.location} />
            <DetailRow label="Building block" value={record.building_block} />
            <DetailRow label="Use case" value={record.use_case} />
            <DetailRow label="Budget" value={record.budget} />
            <DetailRow label="Timeline" value={record.timeline} />
            <DetailRow label="Focal point" value={record.focal_point_name} />
            <DetailRow label="Focal point email" value={record.focal_point_email} />
            <DetailRow label="Video URL" value={record.video_url} />
            <DetailRow label="Updated at" value={formatDate(record.updated_at)} />
          </dl>
          {record.description && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{record.description}</p>
            </div>
          )}
          {record.image_keys && record.image_keys.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Images: {record.image_keys.join(', ')}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
            {isPending ? (
              <>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={event => {
                    event.stopPropagation();
                    onReviewStatusChange(record.submission_id, 'validated');
                  }}
                  className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? 'Updating…' : 'Validate'}
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={event => {
                    event.stopPropagation();
                    onReviewStatusChange(record.submission_id, 'rejected');
                  }}
                  className="inline-flex justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={isUpdating}
                onClick={event => {
                  event.stopPropagation();
                  onReviewStatusChange(record.submission_id, 'pending');
                }}
                className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdating ? 'Updating…' : 'Mark as pending'}
              </button>
            )}
            {actionError && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function SubmissionsReviewPage() {
  const { isAdmin, isLoading: authLoading } = useIsAdmin();
  const [records, setRecords] = useState<ActivitySubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listAllActivitySubmissions();
      setRecords(items);
    } catch (err) {
      const message = isGraphqlUnauthorizedError(err)
        ? ADMIN_REQUIRED_MESSAGE
        : err instanceof Error
          ? err.message
          : 'Failed to load submissions.';
      setError(message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      if (!authLoading && !isAdmin) {
        setLoading(false);
        setError(null);
        setRecords([]);
      }
      return;
    }
    void loadSubmissions();
  }, [loadSubmissions, authLoading, isAdmin]);

  const handleReviewStatusChange = useCallback(
    async (submissionId: string, status: ReviewSubmissionStatus) => {
      setUpdatingId(submissionId);
      setActionError(null);
      try {
        const updated = await updateActivitySubmissionReviewStatus(submissionId, status);
        setRecords(current =>
          current.map(record =>
            record.submission_id === submissionId ? { ...record, ...updated } : record,
          ),
        );
      } catch (err) {
        const message = isGraphqlUnauthorizedError(err)
          ? ADMIN_REQUIRED_MESSAGE
          : err instanceof Error
            ? err.message
            : 'Failed to update submission.';
        setActionError(message);
      } finally {
        setUpdatingId(null);
      }
    },
    [],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter(record => {
      const reviewStatus = normalizeReviewStatus(record.submission_status);
      if (statusFilter !== 'all' && reviewStatus !== statusFilter) return false;
      if (!query) return true;
      const haystack = [
        record.activity,
        record.country,
        record.region,
        record.description,
        record.submitted_by,
        record.submission_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [records, search, statusFilter]);

  const counts = useMemo(() => {
    const tally = { all: records.length, pending: 0, validated: 0, rejected: 0 };
    for (const record of records) {
      const status = normalizeReviewStatus(record.submission_status);
      if (status === 'pending') tally.pending += 1;
      else if (status === 'validated') tally.validated += 1;
      else if (status === 'rejected') tally.rejected += 1;
    }
    return tally;
  }, [records]);

  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0539E3]">
              Admin review
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Activity submissions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review submissions from DynamoDB. Expand a row to validate or reject pending items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadSubmissions()}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-semibold">Could not load submissions</p>
            <p className="mt-2">{error}</p>
            <button
              type="button"
              onClick={() => void loadSubmissions()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map(filter => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      statusFilter === filter.id
                        ? 'bg-[#0539E3] text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-1 opacity-80">({counts[filter.id]})</span>
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search activity, country, submitter…"
                className="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-[#0539E3] focus:outline-none focus:ring-1 focus:ring-[#0539E3]"
              />
            </div>

            <p className="mb-4 text-sm text-slate-500">
              Showing {filtered.length} of {records.length} submission{records.length === 1 ? '' : 's'}
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
                No submissions match the current filters.
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map(record => (
                  <li key={record.submission_id}>
                    <SubmissionCard
                      record={record}
                      expanded={expandedId === record.submission_id}
                      onToggle={() =>
                        setExpandedId(current =>
                          current === record.submission_id ? null : record.submission_id,
                        )
                      }
                      onReviewStatusChange={(id, status) => void handleReviewStatusChange(id, status)}
                      isUpdating={updatingId === record.submission_id}
                      actionError={expandedId === record.submission_id ? actionError : null}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
