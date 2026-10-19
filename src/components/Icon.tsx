import { ReactNode } from 'react';

export type IconName =
  | 'arrow'
  | 'check'
  | 'eye'
  | 'eyeOff'
  | 'github'
  | 'google'
  | 'lock'
  | 'mail'
  | 'shield'
  | 'home'
  | 'file'
  | 'calendar'
  | 'clipboard'
  | 'users'
  | 'user'
  | 'plus'
  | 'logout'
  | 'alert';

const PATHS: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </>
  ),
  check: <path d="m5 12 4.2 4.2L19 6.5" />,
  eye: (
    <>
      <path d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.4 6.7c.5-.1 1-.2 1.6-.2 6.1 0 9.5 5.5 9.5 5.5a17 17 0 0 1-2.3 2.8M6.3 8.2A16.6 16.6 0 0 0 2.5 12s3.4 5.5 9.5 5.5c1.2 0 2.3-.2 3.3-.6" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.54 9.54 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  ),
  google: (
    <>
      <path fill="#4285F4" stroke="none" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.01v2.53h3.25c1.9-1.75 2.97-4.33 2.97-7.38Z" />
      <path fill="#34A853" stroke="none" d="M12 22c2.7 0 4.98-.9 6.63-2.39l-3.25-2.53c-.9.61-2.06.97-3.38.97-2.6 0-4.81-1.76-5.6-4.12H3.05v2.61A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" stroke="none" d="M6.4 13.93A6 6 0 0 1 6.08 12c0-.67.12-1.32.32-1.93V7.46H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.54l3.35-2.61Z" />
      <path fill="#EA4335" stroke="none" d="M12 5.95c1.47 0 2.79.5 3.82 1.49l2.88-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.95 5.46l3.35 2.61c.79-2.36 3-4.12 5.6-4.12Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4.5 7 6.2 5a2 2 0 0 0 2.6 0l6.2-5" />
    </>
  ),
  shield: <path d="M12 2.8 19 6v5c0 4.8-2.9 8.4-7 10.2C7.9 19.4 5 15.8 5 11V6l7-3.2Z" />,
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" />
      <path d="M9 4.5V3.5h6v1M9 12h6M9 16h4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-2.5-5.1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  logout: (
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </>
  ),
};

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
