import { useAuthenticator } from '@aws-amplify/ui-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { createActivitySubmission } from '../api/activitySubmissions';
import AppFooter from '../components/AppFooter';
import { useData } from '../context/DataContext';
import {
  getAdministrationRegionCodes,
  getCountriesForRegion,
  isOfficialCountryForRegion,
} from '../utils/administrations';

type SubmissionStatus = 'idle' | 'submitting' | 'submitted' | 'error';

type ActivitySubmissionForm = {
  region: string;
  country: string;
  activity: string;
  description: string;
  status: string;
  focalPointName: string;
  focalPointEmail: string;
  location: string;
  buildingBlock: string;
  useCase: string;
  budget: string;
  timeline: string;
  videoUrl: string;
  consent: boolean;
};

const initialForm: ActivitySubmissionForm = {
  region: '',
  country: '',
  activity: '',
  description: '',
  status: '',
  focalPointName: '',
  focalPointEmail: '',
  location: '',
  buildingBlock: '',
  useCase: '',
  budget: '',
  timeline: '',
  videoUrl: '',
  consent: false,
};

const fieldBaseClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-[#0539E3] focus:outline-none focus:ring-1 focus:ring-[#0539E3]';

const inputClass = `${fieldBaseClass} text-slate-800 placeholder:text-slate-400`;

const selectOptionClass = 'text-slate-800';

function selectClass(value: string, disabled = false) {
  const tone = value && !disabled ? 'text-slate-800' : 'text-slate-400';
  return `mt-1.5 ${fieldBaseClass} ${tone}`;
}

const labelClass = 'text-sm font-medium text-slate-700';

function required(value: string) {
  return value.trim().length > 0;
}

function unique(values: string[]) {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))].sort();
}

function toApiInput(form: ActivitySubmissionForm) {
  return {
    region: form.region.trim(),
    country: form.country.trim(),
    activity: form.activity.trim(),
    description: form.description.trim(),
    status: form.status.trim(),
    focal_point_name: form.focalPointName.trim() || undefined,
    focal_point_email: form.focalPointEmail.trim() || undefined,
    location: form.location.trim() || undefined,
    building_block: form.buildingBlock.trim() || undefined,
    use_case: form.useCase.trim() || undefined,
    budget: form.budget.trim() || undefined,
    timeline: form.timeline.trim() || undefined,
    video_url: form.videoUrl.trim() || undefined,
    image_keys: [] as string[],
  };
}

export default function ActivitySubmissionPage() {
  const { user } = useAuthenticator(context => [context.user]);
  const { sheets } = useData();
  const [form, setForm] = useState<ActivitySubmissionForm>(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const globalViewSheet = useMemo(() => {
    const key = Object.keys(sheets).find(sheetName =>
      sheetName.toLowerCase().includes('global view') || sheetName.toLowerCase().includes('global')
    );
    return key ? sheets[key] : null;
  }, [sheets]);

  const officialRegionCodes = useMemo(() => getAdministrationRegionCodes(), []);

  const countriesForRegion = useMemo(
    () => getCountriesForRegion(form.region),
    [form.region],
  );

  const dropdownOptions = useMemo(() => ({
    statuses: unique(globalViewSheet?.rows.map(row => row['Status'] || '') ?? []),
  }), [globalViewSheet]);

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof ActivitySubmissionForm | 'images', string>> = {};

    if (!required(form.region)) nextErrors.region = 'Region is required.';
    if (!required(form.country)) nextErrors.country = 'Country is required.';
    if (form.region && form.country && !isOfficialCountryForRegion(form.region, form.country)) {
      nextErrors.country = 'Select a country from the official list for this region.';
    }
    if (!required(form.activity)) nextErrors.activity = 'Activity is required.';
    if (!required(form.description)) nextErrors.description = 'Description is required.';
    if (!required(form.status)) nextErrors.status = 'Status is required.';
    if (form.focalPointEmail && !required(form.focalPointName)) {
      nextErrors.focalPointName = 'Add a focal point name when providing an email.';
    }
    if (form.focalPointEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.focalPointEmail)) {
      nextErrors.focalPointEmail = 'Enter a valid email address.';
    }
    if (!form.consent) nextErrors.consent = 'Consent is required before submission.';
    if (images.some(file => !file.type.startsWith('image/'))) {
      nextErrors.images = 'Only image files are allowed.';
    }

    return nextErrors;
  }, [form, images]);

  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitting = status === 'submitting';

  const updateField = <Key extends keyof ActivitySubmissionForm>(
    key: Key,
    value: ActivitySubmissionForm[Key],
  ) => {
    setForm(current => {
      const next = { ...current, [key]: value };
      if (key === 'region' && value !== current.region) {
        next.country = '';
      }
      return next;
    });
    if (status !== 'submitting') {
      setStatus('idle');
      setSubmitError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrors(true);
    setSubmitError(null);

    if (hasErrors || isSubmitting) return;

    setStatus('submitting');

    try {
      const record = await createActivitySubmission(toApiInput(form));
      setLastSubmissionId(record.submission_id);
      setStatus('submitted');
      setForm(initialForm);
      setImages([]);
      setShowErrors(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed. Please try again.';
      setSubmitError(message);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setImages([]);
    setShowErrors(false);
    setStatus('idle');
    setSubmitError(null);
    setLastSubmissionId(null);
  };

  const submitterLabel =
    user?.signInDetails?.loginId ?? user?.username ?? 'Signed-in user';

  return (
    <div className="flex min-h-full flex-col bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0539E3]">
            Activity Information Submission
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Submit GovStack activity information
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Share planned activity details before an event or upload a summary after it has taken place.
            Submitted content is saved for internal review before it is merged into the master dataset.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  id="region"
                  className={selectClass(form.region, isSubmitting)}
                  value={form.region}
                  onChange={event => updateField('region', event.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="" className="text-slate-400">
                    Select region
                  </option>
                  {officialRegionCodes.map(regionCode => (
                    <option key={regionCode} value={regionCode} className={selectOptionClass}>
                      {regionCode}
                    </option>
                  ))}
                </select>
                {showErrors && errors.region && (
                  <p className="mt-1 text-xs text-red-600">{errors.region}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  className={selectClass(form.country, isSubmitting || !form.region)}
                  value={form.country}
                  onChange={event => updateField('country', event.target.value)}
                  disabled={isSubmitting || !form.region}
                >
                  <option value="" className="text-slate-400">
                    {form.region ? 'Select country' : 'Select a country'}
                  </option>
                  {countriesForRegion.map(country => (
                    <option
                      key={country.symbol}
                      value={country.designation}
                      className={selectOptionClass}
                    >
                      {country.designation}
                    </option>
                  ))}
                </select>
                {showErrors && errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="activity">
                  Activity <span className="text-red-500">*</span>
                </label>
                <input
                  id="activity"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.activity}
                  onChange={event => updateField('activity', event.target.value)}
                  placeholder="e.g. Digital public infrastructure workshop"
                  disabled={isSubmitting}
                />
                {showErrors && errors.activity && (
                  <p className="mt-1 text-xs text-red-600">{errors.activity}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  className={`mt-1.5 min-h-32 resize-y ${inputClass}`}
                  value={form.description}
                  onChange={event => updateField('description', event.target.value)}
                  placeholder="Describe the activity, partners, goals, and expected outcomes."
                  disabled={isSubmitting}
                />
                {showErrors && errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  className={selectClass(form.status, isSubmitting)}
                  value={form.status}
                  onChange={event => updateField('status', event.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="" className="text-slate-400">
                    Select status
                  </option>
                  {dropdownOptions.statuses.map(statusOption => (
                    <option key={statusOption} value={statusOption} className={selectOptionClass}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                {showErrors && errors.status && (
                  <p className="mt-1 text-xs text-red-600">{errors.status}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.location}
                  onChange={event => updateField('location', event.target.value)}
                  placeholder="City or implementation location"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="focalPointName">
                    Focal Point Name
                  </label>
                  <input
                    id="focalPointName"
                    className={`mt-1.5 ${inputClass}`}
                    value={form.focalPointName}
                    onChange={event => updateField('focalPointName', event.target.value)}
                    placeholder="Full name"
                    disabled={isSubmitting}
                  />
                  {showErrors && errors.focalPointName && (
                    <p className="mt-1 text-xs text-red-600">{errors.focalPointName}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="focalPointEmail">
                    Focal Point Email
                  </label>
                  <input
                    id="focalPointEmail"
                    type="email"
                    className={`mt-1.5 ${inputClass}`}
                    value={form.focalPointEmail}
                    onChange={event => updateField('focalPointEmail', event.target.value)}
                    placeholder="focal.point@itu.int"
                    disabled={isSubmitting}
                  />
                  {showErrors && errors.focalPointEmail && (
                    <p className="mt-1 text-xs text-red-600">{errors.focalPointEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="buildingBlock">
                  Building Block
                </label>
                <input
                  id="buildingBlock"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.buildingBlock}
                  onChange={event => updateField('buildingBlock', event.target.value)}
                  placeholder="Building block"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="useCase">
                  Use Case
                </label>
                <input
                  id="useCase"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.useCase}
                  onChange={event => updateField('useCase', event.target.value)}
                  placeholder="Use case"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="budget">
                  Budget
                </label>
                <input
                  id="budget"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.budget}
                  onChange={event => updateField('budget', event.target.value)}
                  placeholder="Budget"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="timeline">
                  Timeline
                </label>
                <input
                  id="timeline"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.timeline}
                  onChange={event => updateField('timeline', event.target.value)}
                  placeholder="e.g. Q3 2026"
                  disabled={isSubmitting}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="images">
                  Images
                </label>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-1.5 block w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#0539E3] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:bg-slate-100"
                  onChange={event => setImages(Array.from(event.target.files ?? []))}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Image upload to S3 is not enabled yet. Metadata is still saved without image keys.
                </p>
                {images.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {images.map(file => (
                      <li key={`${file.name}-${file.size}`} className="truncate">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                )}
                {showErrors && errors.images && <p className="mt-1 text-xs text-red-600">{errors.images}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="videoUrl">
                  Video link
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  className={`mt-1.5 ${inputClass}`}
                  value={form.videoUrl}
                  onChange={event => updateField('videoUrl', event.target.value)}
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={event => updateField('consent', event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0539E3] focus:ring-[#0539E3]"
                disabled={isSubmitting}
              />
              <span>
                I confirm that the submitted information can be reviewed by the GovStack team and
                may be incorporated into the public activity dataset after validation.
                {showErrors && errors.consent && (
                  <span className="mt-1 block text-xs text-red-600">{errors.consent}</span>
                )}
              </span>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg bg-[#0539E3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0432c4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit information'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear form
              </button>
              {status === 'submitted' && lastSubmissionId && (
                <p className="text-sm font-medium text-green-700">
                  Saved to GovStack submissions database.
                </p>
              )}
              {status === 'error' && submitError && (
                <p className="text-sm font-medium text-red-600">{submitError}</p>
              )}
            </div>
          </form>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Submission status</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Submissions are stored in DynamoDB via AppSync for internal review. Region and country use the official
              ITU administrations list mapped to the same five regions as the Global View map.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium text-slate-700">Current scope</p>
                <p className="mt-1 text-slate-500">
                  Authenticated users only. Submitter: {submitterLabel}. Images are not uploaded yet.
                </p>
              </div>
              <div className="rounded-lg bg-[#eef3ff] p-3">
                <p className="font-medium text-slate-800">Next integration</p>
                <p className="mt-1 text-slate-600">
                  Connect image uploads to <code>govstack-submissions/</code> and add an admin review list.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
