import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import MarkerPopup from './MarkerPopup';
import { getCoordinates } from '../data/countryCoordinates';
import { computeOffsets } from '../utils/markerOffset';
import 'leaflet/dist/leaflet.css';

export interface ActivityRow {
  id: string;
  country: string;
  region: string;
  activity: string;
  description: string;
  status: string;
  focalPoint: string;
  budget: string;
  timeline: string;
}

export interface FocalPointRow {
  id: string;
  name: string;
  email: string;
  location: string;
  region: string;
}

interface MapViewProps {
  activities: ActivityRow[];
  focalPoints: FocalPointRow[];
}

function SetView() {
  const map = useMap();
  useMemo(() => { map.setView([20, 10], 2); }, []); // eslint-disable-line
  return null;
}

const ACTIVITY_COLOR = '#2563eb'; // bright blue
const FOCAL_COLOR    = '#e11d48'; // rose-red
const MARKER_BORDER  = '#ffffff';

export default function MapView({ activities, focalPoints }: MapViewProps) {
  const activityMarkers = useMemo(() => {
    const resolved = activities
      .map(row => { const c = getCoordinates(row.country); return c ? { ...row, lat: c[0], lng: c[1] } : null; })
      .filter(Boolean) as (ActivityRow & { lat: number; lng: number })[];
    const offsets = computeOffsets(resolved);
    return resolved.map((row, i) => ({ ...row, lat: offsets[i][0], lng: offsets[i][1] }));
  }, [activities]);

  const focalMarkers = useMemo(() => {
    const resolved = focalPoints
      .map(row => { const loc = row.location || row.name; const c = getCoordinates(loc); return c ? { ...row, lat: c[0], lng: c[1] } : null; })
      .filter(Boolean) as (FocalPointRow & { lat: number; lng: number })[];
    const offsets = computeOffsets(resolved);
    return resolved.map((row, i) => ({ ...row, lat: offsets[i][0], lng: offsets[i][1] }));
  }, [focalPoints]);

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      scrollWheelZoom
      style={{ width: '100%', height: '100%' }}
      className="z-0"
      zoomControl={false}
    >
      <SetView />

      {/* Zoom control — bottom-right */}
      {/* React-Leaflet v4+ uses ZoomControl but we position it via CSS */}

      {/* Clean light map tile */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Activity markers — ITU blue */}
      {activityMarkers.map(row => (
        <CircleMarker
          key={row.id}
          center={[row.lat, row.lng]}
          radius={7}
          pathOptions={{
            fillColor: ACTIVITY_COLOR,
            color: MARKER_BORDER,
            weight: 1.5,
            fillOpacity: 0.92,
          }}
        >
          <Popup minWidth={272} maxWidth={272}>
            <MarkerPopup
              type="activity"
              title={row.country}
              subtitle={row.region}
              fields={[
                { label: 'Activity',    value: row.activity },
                { label: 'Description', value: row.description },
                { label: 'Status',      value: row.status },
                { label: 'Focal Point', value: row.focalPoint },
                { label: 'Budget',      value: row.budget },
                { label: 'Timeline',    value: row.timeline },
              ]}
            />
          </Popup>
        </CircleMarker>
      ))}

      {/* Focal point markers — red */}
      {focalMarkers.map(row => (
        <CircleMarker
          key={row.id}
          center={[row.lat, row.lng]}
          radius={8}
          pathOptions={{
            fillColor: FOCAL_COLOR,
            color: MARKER_BORDER,
            weight: 1.5,
            fillOpacity: 0.92,
          }}
        >
          <Popup minWidth={272} maxWidth={272}>
            <MarkerPopup
              type="focal"
              title={row.name}
              subtitle={row.region}
              fields={[
                { label: 'Email',    value: row.email },
                { label: 'Location', value: row.location },
                { label: 'Region',   value: row.region },
              ]}
            />
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
