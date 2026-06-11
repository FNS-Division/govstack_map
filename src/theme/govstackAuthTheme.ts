import { createTheme, defaultTheme } from '@aws-amplify/ui-react';

const avenirStack =
  "'Avenir Next', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";

/** Align Amplify UI tokens with GovStack dashboard (#0539E3, slate surfaces). */
export const govstackAuthTheme = createTheme(
  {
    name: 'govstack-auth-theme',
    tokens: {
      fonts: {
        default: {
          variable: { value: avenirStack },
          static: { value: avenirStack },
        },
      },
      colors: {
        primary: {
          10: '#e8edfd',
          20: '#d1dbfb',
          40: '#8fa5f3',
          60: '#4d6fec',
          80: '#0539E3',
          90: '#0432c4',
          100: '#0329a8',
        },
        background: {
          primary: '#f8fafc',
          secondary: '#ffffff',
        },
        font: {
          primary: '#0f172a',
          secondary: '#64748b',
        },
        border: {
          primary: '#e2e8f0',
          secondary: '#cbd5e1',
        },
      },
      radii: {
        small: '0.5rem',
        medium: '0.75rem',
        large: '0.75rem',
      },
      space: {
        small: '0.75rem',
        medium: '1rem',
        large: '1.5rem',
      },
    },
  },
  defaultTheme,
);
