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
  resources: string;
  resourcesUrl: string;
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

type ActivityMarker = ActivityRow & { lat: number; lng: number };
type FocalMarker = FocalPointRow & { lat: number; lng: number };
type ResolvedMarker =
  | ({ type: 'activity' } & ActivityMarker)
  | ({ type: 'focal' } & FocalMarker);

export default function MapView({ activities, focalPoints }: MapViewProps) {
  const { activityMarkers, focalMarkers } = useMemo(() => {
    const resolvedActivities = activities
      .map((row): ResolvedMarker | null => {
        const c = getCoordinates(row.country);
        return c ? { ...row, type: 'activity', lat: c[0], lng: c[1] } : null;
      })
      .filter((row): row is ResolvedMarker => row !== null);

    const resolvedFocalPoints = focalPoints
      .map((row): ResolvedMarker | null => {
        const loc = row.location || row.name;
        const c = getCoordinates(loc);
        return c ? { ...row, type: 'focal', lat: c[0], lng: c[1] } : null;
      })
      .filter((row): row is ResolvedMarker => row !== null);

    const resolvedMarkers = [...resolvedActivities, ...resolvedFocalPoints];
    const offsets = computeOffsets(resolvedMarkers);

    const offsetMarkers = resolvedMarkers.map((row, i) => ({
      ...row,
      lat: offsets[i][0],
      lng: offsets[i][1],
    }));

    return {
      activityMarkers: offsetMarkers.filter((row): row is { type: 'activity' } & ActivityMarker => row.type === 'activity'),
      focalMarkers: offsetMarkers.filter((row): row is { type: 'focal' } & FocalMarker => row.type === 'focal'),
    };
  }, [activities, focalPoints]);

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
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
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
              actionLink={row.resourcesUrl ? {
                href: row.resourcesUrl,
                label: 'Download resources',
              } : undefined}
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
