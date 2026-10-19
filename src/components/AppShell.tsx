import { ReactNode } from 'react';
import { useApp } from '../state/AppContext';
import { go, Route } from '../lib/route';
import { Role } from '../types/user';
import Icon, { IconName } from './Icon';
import { BrandMark } from './Brand';
import { ROLE_LABELS } from './ui';

interface NavItem {
  route: string;
  label: string;
  icon: IconName;
  roles: Role[] | 'all';
}

const NAV: NavItem[] = [
  { route: 'inicio', label: 'Inicio', icon: 'home', roles: 'all' },
  { route: 'articulos', label: 'Artículos', icon: 'file', roles: 'all' },
  { route: 'agenda', label: 'Agenda', icon: 'calendar', roles: 'all' },
  { route: 'revisiones', label: 'Revisiones', icon: 'clipboard', roles: ['Committee Member'] },
  { route: 'usuarios', label: 'Usuarios', icon: 'users', roles: ['Admin', 'Committee Member'] },
  { route: 'perfil', label: 'Mi perfil', icon: 'user', roles: 'all' },
];

export function canSee(item: NavItem, role: Role) {
  return item.roles === 'all' || item.roles.includes(role);
}

export default function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const { currentUser, logout } = useApp();
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <a href="#inicio" className="brand brand-dark" aria-label="Ir al inicio">
            <BrandMark />
            <span>converge</span>
          </a>

          <nav aria-label="Principal" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {NAV.filter((item) => canSee(item, currentUser.role)).map((item) => {
              const active = route.name === item.route;
              return (
                <a
                  key={item.route}
                  href={`#${item.route}`}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.fullName}</p>
              <p className="text-xs text-slate-500">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                go('login');
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Icon name="logout" size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}
