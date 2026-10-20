import { FormEvent, useEffect, useState } from 'react';
import { AppUser, ROLES, Role, UserStatus } from '../types/user';

export type UserProfile = Pick<AppUser, 'fullName' | 'email' | 'role' | 'status'>;

type FormErrors = Partial<Record<'fullName' | 'email' | 'password', string>>;

interface UserFormModalProps {
  /** `null` creates a new user; an existing user opens the editor. */
  user: AppUser | null;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100';

export default function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const isEdit = user !== null;
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(user?.role ?? 'Author');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'Active');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: FormErrors = {};

    if (!fullName.trim()) next.fullName = 'El nombre completo es obligatorio.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Ingresa un correo electrónico válido.';
    if (!password && !isEdit) next.password = 'La contraseña es obligatoria.';
    else if (password && password.length < 8) next.password = 'Usa al menos 8 caracteres.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // The password is validated here; a real integration would send it to the API.
    onSave({ fullName: fullName.trim(), email: email.trim(), role, status });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="user-form-title" className="text-lg font-semibold text-slate-900">
          {isEdit ? 'Editar usuario' : 'Crear usuario'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="user-full-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nombre completo
            </label>
            <input
              id="user-full-name"
              className={inputClass}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Laura Gómez"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="user-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@university.edu"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Contraseña{isEdit && <span className="font-normal text-slate-400"> (déjala en blanco para conservar la actual)</span>}
            </label>
            <input
              id="user-password"
              type="password"
              className={inputClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={isEdit ? '••••••••' : 'Mínimo 8 caracteres'}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="user-role" className="mb-1.5 block text-sm font-medium text-slate-700">
              Rol del usuario
            </label>
            <select
              id="user-role"
              className={inputClass}
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              {ROLES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-900">Estado de la cuenta</p>
              <p className="text-xs text-slate-500">
                {status === 'Active' ? 'El usuario puede iniciar sesión' : 'El inicio de sesión está deshabilitado'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={status === 'Active'}
              aria-label="Estado de la cuenta"
              onClick={() => setStatus((current) => (current === 'Active' ? 'Inactive' : 'Active'))}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                status === 'Active' ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  status === 'Active' ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Guardar usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
