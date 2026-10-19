import { useMemo, useState } from 'react';
import { AppUser, ROLES, Role, UserStatus } from '../types/user';
import { useApp } from '../state/AppContext';
import UserFormModal, { UserProfile } from './UserFormModal';

const ROLE_STYLES: Record<Role, string> = {
  Admin: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Committee Member': 'bg-amber-50 text-amber-700 ring-amber-200',
  Author: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const STATUS_STYLES: Record<UserStatus, string> = {
  Active: 'text-emerald-700',
  Inactive: 'text-slate-500',
};

const controlClass =
  'h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100';

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

export default function UserManagement() {
  const { users, setUsers } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All'>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        query === '' || user.fullName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function openCreate() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: AppUser) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingUser(null);
  }

  function handleSave(profile: UserProfile) {
    if (editingUser) {
      setUsers((current) => current.map((user) => (user.id === editingUser.id ? { ...user, ...profile } : user)));
    } else {
      setUsers((current) => [
        { id: crypto.randomUUID(), ...profile, registeredAt: new Date().toISOString().slice(0, 10) },
        ...current,
      ]);
    }
    closeForm();
  }

  function handleDelete(user: AppUser) {
    if (window.confirm(`¿Eliminar a ${user.fullName}? Esta acción no se puede deshacer.`)) {
      setUsers((current) => current.filter((item) => item.id !== user.id));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o correo"
                aria-label="Buscar usuarios"
                className={`${controlClass} w-full pl-9 sm:w-72`}
              />
            </div>

            <select
              aria-label="Filtrar por rol"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as Role | 'All')}
              className={controlClass}
            >
              <option value="All">Todos los roles</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              aria-label="Filtrar por estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as UserStatus | 'All')}
              className={controlClass}
            >
              <option value="All">Todos los estados</option>
              <option value="Active">Activo</option>
              <option value="Inactive">Inactivo</option>
            </select>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="h-10 shrink-0 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 lg:self-auto"
          >
            + Crear usuario
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[760px] w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Nombre completo</th>
                <th scope="col" className="px-4 py-3">Correo electrónico</th>
                <th scope="col" className="px-4 py-3">Rol asignado</th>
                <th scope="col" className="px-4 py-3">Fecha de registro</th>
                <th scope="col" className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-900">{user.fullName}</td>
                  <td className="px-4 py-2.5 text-slate-600">{user.email}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLE_STYLES[user.role]}`}>
                        {user.role}
                      </span>
                      <span className={`text-xs font-medium ${STATUS_STYLES[user.status]}`}>● {user.status}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-600">{formatDate(user.registeredAt)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        aria-label={`Editar ${user.fullName}`}
                        title="Editar"
                        className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        aria-label={`Eliminar ${user.fullName}`}
                        title="Eliminar"
                        className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M6 6l1 14h10l1-14" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No hay usuarios que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Mostrando {visibleUsers.length} de {users.length} usuarios
        </p>
      </div>

      {formOpen && (
        <UserFormModal key={editingUser?.id ?? 'new'} user={editingUser} onClose={closeForm} onSave={handleSave} />
      )}
    </main>
  );
}
