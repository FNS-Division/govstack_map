/**
 * Slightly offset duplicate coordinates so markers remain individually clickable.
 */
export function applyOffset(
  lat: number,
  lng: number,
  index: number
): [number, number] {
  if (index === 0) return [lat, lng];
  const radius = 0.4 + Math.floor(index / 6) * 0.3;
  const angle = (index * 60 * Math.PI) / 180;
  return [lat + radius * Math.cos(angle), lng + radius * Math.sin(angle)];
}

/**
 * Group rows by their base coordinates and return per-row offsets.
 */
export function computeOffsets(
  items: { lat: number; lng: number }[]
): [number, number][] {
  const coordMap = new Map<string, number>();
  return items.map(({ lat, lng }) => {
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const count = coordMap.get(key) ?? 0;
    coordMap.set(key, count + 1);
    return applyOffset(lat, lng, count);
  });
}
