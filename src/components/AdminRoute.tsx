import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from '../utils/authRoles';
import { PageSpinner } from './directory/DirectoryPageLayout';

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/submit-activity" replace />;
  }

  return children;
}
