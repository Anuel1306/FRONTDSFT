import { FormEvent, useState } from 'react';
import { Card, FieldError, PageTitle, ROLE_LABELS, controlClass, formatDate, primaryButtonClass } from '../components/ui';
import { useApp } from '../state/AppContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Profile() {
  const { currentUser } = useApp();
  if (!currentUser) return null;
  return <ProfileForm key={currentUser.id} userId={currentUser.id} />;
}

function ProfileForm({ userId }: { userId: string }) {
  const { users, updateProfile } = useApp();
  const user = users.find((item) => item.id === userId);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();

    const next: { fullName?: string; email?: string } = {};
    if (fullName.length < 5) next.fullName = 'Ingresa tu nombre completo.';
    if (!EMAIL_PATTERN.test(email)) next.email = 'Ingresa un correo electrónico válido.';
    else if (users.some((item) => item.id !== userId && item.email.toLowerCase() === email.toLowerCase())) {
      next.email = 'Ese correo ya está en uso por otra cuenta.';
    }
    setErrors(next);
    setSaved(false);
    if (Object.keys(next).length > 0) return;

    updateProfile(userId, { fullName, email });
    setSaved(true);
  }

  return (
    <>
      <PageTitle title="Mi perfil" subtitle="Actualiza tus datos personales." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">Nombre completo</label>
              <input id="fullName" name="fullName" defaultValue={user.fullName} className={controlClass} aria-invalid={Boolean(errors.fullName)} />
              <FieldError message={errors.fullName} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Correo electrónico</label>
              <input id="email" name="email" type="email" defaultValue={user.email} className={controlClass} aria-invalid={Boolean(errors.email)} />
              <FieldError message={errors.email} />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className={primaryButtonClass}>Guardar cambios</button>
              {saved && <span className="text-sm text-emerald-700">Datos actualizados.</span>}
            </div>
          </form>
        </Card>

        <Card>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Rol</dt>
              <dd className="font-medium text-slate-900">{ROLE_LABELS[user.role]}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Registro</dt>
              <dd className="font-medium text-slate-900">{formatDate(user.registeredAt)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Estado</dt>
              <dd className="font-medium text-slate-900">{user.status === 'Active' ? 'Activo' : 'Inactivo'}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-slate-500">El rol solo puede cambiarlo un administrador.</p>
        </Card>
      </div>
    </>
  );
}
