import { FormEvent, useState } from 'react';
import { BrandMark } from '../components/Brand';
import { FieldError, controlClass, primaryButtonClass } from '../components/ui';
import { PROTOTYPE_PASSWORD_MIN_LENGTH } from '../data/users';
import { useApp } from '../state/AppContext';
import { go } from '../lib/route';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

export default function RegisterScreen() {
  const { users, registerAuthor } = useApp();
  const [errors, setErrors] = useState<RegisterErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    const terms = form.get('terms') === 'on';

    const next: RegisterErrors = {};
    if (fullName.length < 5) next.fullName = 'Ingresa tu nombre completo.';
    if (!EMAIL_PATTERN.test(email)) next.email = 'Ingresa un correo electrónico válido.';
    else if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      next.email = 'Ya existe una cuenta con este correo.';
    }
    if (password.length < PROTOTYPE_PASSWORD_MIN_LENGTH) {
      next.password = `La contraseña debe tener al menos ${PROTOTYPE_PASSWORD_MIN_LENGTH} caracteres.`;
    }
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    if (!terms) next.terms = 'Debes aceptar el tratamiento de datos personales.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    registerAuthor({ fullName, email });
    go('inicio');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <a href="#login" className="brand brand-dark mb-8 inline-flex" aria-label="Volver al inicio de sesión">
          <BrandMark />
          <span>converge</span>
        </a>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Registro de autor</span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">Con tu cuenta podrás postular artículos antes de la fecha límite.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">Nombre completo</label>
              <input id="fullName" name="fullName" className={controlClass} autoComplete="name" aria-invalid={Boolean(errors.fullName)} />
              <FieldError message={errors.fullName} />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Correo electrónico</label>
              <input id="email" name="email" type="email" className={controlClass} autoComplete="email" aria-invalid={Boolean(errors.email)} />
              <FieldError message={errors.email} />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
              <input id="password" name="password" type="password" className={controlClass} autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
              <FieldError message={errors.password} />
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-slate-700">Confirmar contraseña</label>
              <input id="confirm" name="confirm" type="password" className={controlClass} autoComplete="new-password" aria-invalid={Boolean(errors.confirm)} />
              <FieldError message={errors.confirm} />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" name="terms" className="mt-1" />
              <span>Acepto el tratamiento de mis datos personales para la gestión de la conferencia.</span>
            </label>
            <FieldError message={errors.terms} />

            <button type="submit" className={`${primaryButtonClass} w-full`}>Crear cuenta</button>
          </form>
        </section>
      </div>
    </main>
  );
}
