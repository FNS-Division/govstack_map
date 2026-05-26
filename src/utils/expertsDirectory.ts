import { tagClass } from './tagStyles';

export interface ExpertRecord {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  location: string;
  contractType: string;
  availability: string;
  profileUrl: string;
  role: string;
  comment: string;
}

const AVATAR_PALETTE = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-indigo-100 text-indigo-700',
];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function avatarClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export { tagClass };

function inferEmail(name: string, profileUrl: string): string {
  const linkedInMatch = profileUrl.match(/linkedin\.com\/in\/([^/?]+)/i);
  if (linkedInMatch) {
    return `${linkedInMatch[1].replace(/-/g, '.')}@linkedin.profile`;
  }
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.+|\.+$/g, '');
  return slug ? `${slug}@govstack.community` : '—';
}

function splitSpecializations(row: Record<string, string>): string[] {
  const areas = (row['Area of work'] || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean);
  const role = (row['Role'] || '').trim();
  const comment = (row['Comment on work'] || '').trim();
  const tags = [...areas];
  if (role && !tags.includes(role)) tags.unshift(role);
  if (tags.length === 0 && comment) {
    const short = comment.length > 42 ? `${comment.slice(0, 42)}…` : comment;
    tags.push(short);
  }
  if (tags.length === 0) tags.push('GovStack expert');
  return tags.slice(0, 4);
}

export function mapRowToExpert(row: Record<string, string>, index: number): ExpertRecord {
  const name = row['Name'] || `Expert ${index + 1}`;
  const profileUrl = row['Link to CV/LinkedIn'] || '';
  return {
    id: `expert-${index}-${name}`,
    name,
    email: inferEmail(name, profileUrl),
    specializations: splitSpecializations(row),
    location: row['Location'] || row['Country'] || row['Region'] || '—',
    contractType: row['Contract type'] || row['Contract Type'] || '—',
    availability: row['Status']?.trim() || 'Available for ITU engagements',
    profileUrl,
    role: row['Role'] || '',
    comment: row['Comment on work'] || '',
  };
}

/** Non-empty optional fields for card display (sparse Excel columns). */
export function expertMetaRows(expert: ExpertRecord): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, value: string) => {
    if (value && value !== '—') rows.push({ label, value });
  };
  add('Location', expert.location);
  add('Contract', expert.contractType);
  add('Availability', expert.availability);
  return rows;
}
