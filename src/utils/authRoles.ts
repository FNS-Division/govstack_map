import { useCallback, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const ADMIN_GROUP = 'admins';

function normalizeGroups(claim: unknown): string[] {
  if (Array.isArray(claim)) {
    return claim.filter((value): value is string => typeof value === 'string');
  }
  if (typeof claim === 'string') {
    return [claim];
  }
  return [];
}

export async function getCognitoGroupsFromSession(): Promise<string[]> {
  const session = await fetchAuthSession();
  const claim = session.tokens?.idToken?.payload['cognito:groups'];
  return normalizeGroups(claim);
}

export function isAdminFromGroups(groups: string[]): boolean {
  return groups.includes(ADMIN_GROUP);
}

export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (authStatus !== 'authenticated') {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const groups = await getCognitoGroupsFromSession();
      setIsAdmin(isAdminFromGroups(groups));
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { isAdmin, isLoading };
}
