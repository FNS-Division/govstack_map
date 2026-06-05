interface PopupField {
  label: string;
  value: string;
}

interface MarkerPopupProps {
  title: string;
  subtitle?: string;
  fields: PopupField[];
  type: 'activity' | 'focal';
  actionLink?: {
    href: string;
    label: string;
  };
}

export default function MarkerPopup({ title, subtitle, fields, type, actionLink }: MarkerPopupProps) {
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
        {actionLink?.href && (
          <a
            href={actionLink.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              alignItems: 'center',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 8,
              color: '#1d4ed8',
              display: 'flex',
              fontSize: 12,
              fontWeight: 700,
              gap: 6,
              justifyContent: 'center',
              marginTop: 8,
              padding: '8px 10px',
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v7.69L6.28 7.47a.75.75 0 00-1.06 1.06l4.25 4.25a.75.75 0 001.06 0l4.25-4.25a.75.75 0 10-1.06-1.06l-2.97 2.97V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2A2.25 2.25 0 004.25 17h11.5A2.25 2.25 0 0018 14.75v-2a.75.75 0 00-1.5 0v2a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-2z" />
            </svg>
            {actionLink.label}
          </a>
        )}
      </div>

      {/* bottom accent */}
      <div style={{ height: 3, background: type === 'focal' ? '#e11d48' : '#3b82f6' }} />
    </div>
  );
}
