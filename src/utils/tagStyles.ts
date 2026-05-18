const TAG_PALETTE: { bg: string; text: string }[] = [
  { bg: 'bg-blue-50', text: 'text-blue-700' },
  { bg: 'bg-violet-50', text: 'text-violet-700' },
  { bg: 'bg-amber-50', text: 'text-amber-800' },
  { bg: 'bg-cyan-50', text: 'text-cyan-800' },
  { bg: 'bg-rose-50', text: 'text-rose-700' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700' },
];

export function tagClass(label: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}
