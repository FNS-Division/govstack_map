/** Empty query matches everything; otherwise case-insensitive substring on joined fields. */
export function matchesQuery(
  query: string,
  ...fields: (string | null | undefined)[]
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = fields.filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(q);
}
