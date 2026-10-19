import { ReactNode } from 'react';
import { ARTICLE_STATE_STYLES, ArticleState } from '../data/conference';
import { Role } from '../types/user';

export const controlClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100';

export const primaryButtonClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50';

// "!border" keeps the border visible: index.css resets every button to border: 0 outside Tailwind's layers.
export const secondaryButtonClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg !border !border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200';

export const dangerButtonClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg !border !border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-100';

export const ROLE_LABELS: Record<Role, string> = {
  Admin: 'Administrador',
  'Committee Member': 'Miembro del comité',
  Author: 'Autor',
};

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

export function StateBadge({ state }: { state: ArticleState }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ARTICLE_STATE_STYLES[state]}`}>
      {state}
    </span>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-600" role="alert">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{message}</div>;
}

export function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
}
