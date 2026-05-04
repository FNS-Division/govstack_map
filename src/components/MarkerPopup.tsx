interface PopupField {
  label: string;
  value: string;
}

interface MarkerPopupProps {
  title: string;
  subtitle?: string;
  fields: PopupField[];
  type: 'activity' | 'focal';
}

export default function MarkerPopup({ title, subtitle, fields, type }: MarkerPopupProps) {
  const headerBg = type === 'focal' ? '#e11d48' : '#2563eb';

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, width: 272 }}>
      {/* header */}
      <div style={{ background: headerBg, padding: '10px 14px 10px' }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '1px 7px',
            borderRadius: 20,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
          }}>
            {type === 'focal' ? 'Focal Point' : 'Activity'}
          </span>
        </div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{title}</div>
        {subtitle && (
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>

      {/* body */}
      <div style={{ background: '#fff', padding: '10px 14px 12px' }}>
        {fields.map(({ label, value }) =>
          value ? (
            <div key={label} style={{ marginBottom: 7 }}>
              <div style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: '#94a3b8',
                marginBottom: 2,
              }}>
                {label}
              </div>
              <div style={{ color: '#1e293b', fontSize: 12, lineHeight: 1.45 }}>{value}</div>
            </div>
          ) : null
        )}
      </div>

      {/* bottom accent */}
      <div style={{ height: 3, background: type === 'focal' ? '#e11d48' : '#3b82f6' }} />
    </div>
  );
}
