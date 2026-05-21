import type { ReactNode } from 'react';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { govstackAuthTheme } from '../theme/govstackAuthTheme';

function AuthHeader() {
  return (
    <div className="flex flex-col items-start gap-2 pb-5 text-left">
      <img
        src="/brand/govstack-logo.svg"
        alt="GovStack"
        className="h-12 w-auto max-w-[190px] object-contain"
        width={100}
        height={49}
      />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Dashboard</p>
        <p className="mt-1 text-sm text-slate-600">Sign in to continue</p>
      </div>
    </div>
  );
}

const authComponents = {
  SignIn: { Header: AuthHeader },
  ForgotPassword: { Header: AuthHeader },
  ConfirmResetPassword: { Header: AuthHeader },
  ForceNewPassword: { Header: AuthHeader },
  SetupTotp: { Header: AuthHeader },
  ConfirmSignIn: { Header: AuthHeader },
};

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <ThemeProvider theme={govstackAuthTheme}>
      <Authenticator hideSignUp className="govstack-auth" components={authComponents}>
        {children}
      </Authenticator>
    </ThemeProvider>
  );
}
