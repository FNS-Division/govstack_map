import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import GovStackLogo from './GovStackLogo';

const navItems = [
  {
    to: '/',
    label: 'Global Map',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/experts',
    label: 'Experts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: '/assets',
    label: 'Assets',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export default function Layout() {
  const location = useLocation();
  const isMap = location.pathname === '/';
  const { signOut } = useAuthenticator();

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="flex-shrink-0 z-10 bg-white border-b border-slate-200/90 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <nav className="mx-auto flex h-14 max-w-[1400px] items-stretch gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-shrink-0">
            <GovStackLogo />
          </div>

          <div className="hidden h-6 w-px self-center bg-slate-200 sm:block" aria-hidden />

          <div className="flex min-h-14 flex-1 items-stretch gap-0 sm:gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 border-b-2 px-2 text-sm font-medium transition-colors sm:px-4 ${
                    isActive
                      ? 'border-[#0539E3] text-slate-900'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`
                }
              >
                <span className="text-slate-400">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4 self-center">
            <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 md:flex">
              <span className="h-2 w-2 rounded-full bg-[#0539E3] shadow-[0_0_0_3px_rgba(5,57,227,0.2)]" />
              Live
            </div>
            <button
              type="button"
              onClick={signOut}
              className="text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-[#0539E3] hover:underline"
            >
              Sign out
            </button>
          </div>
        </nav>
      </header>

      <main className={`flex-1 overflow-hidden ${isMap ? '' : 'overflow-y-auto'}`}>
        <Outlet />
      </main>
    </div>
  );
}
