import { FormEvent, useState } from 'react';
import Icon from '../components/Icon';
import { BrandMark, ConferenceArtwork } from '../components/Brand';
import { FieldError } from '../components/ui';
import { PROTOTYPE_PASSWORD_MIN_LENGTH } from '../data/users';
import { useApp } from '../state/AppContext';
import { go } from '../lib/route';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface LoginErrors {
  email?: string;
  password?: string;
  captcha?: string;
  form?: string;
}

export default function LoginScreen() {
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('identity') ?? '').trim();
    const password = String(form.get('password') ?? '');

    const next: LoginErrors = {};
    if (!EMAIL_PATTERN.test(email)) next.email = 'Ingresa un correo electrónico válido.';
    if (password.length < PROTOTYPE_PASSWORD_MIN_LENGTH) {
      next.password = `La contraseña debe tener al menos ${PROTOTYPE_PASSWORD_MIN_LENGTH} caracteres.`;
    }
    if (!verified) next.captcha = 'Completa la verificación de seguridad.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const error = login(email, password);
    setSubmitting(false);
    if (error) {
      setErrors({ form: error });
      return;
    }
    go('inicio');
  }

  return (
    <main className="recovery-shell">
      <section className="story-panel" aria-labelledby="conference-title">
        <header className="brand-header">
          <a className="brand" href="#login" aria-label="Inicio de Converge">
            <BrandMark />
            <span>converge</span>
          </a>
          <span className="portal-label">Foro Académico · Convocatoria 2027</span>
        </header>

        <div className="story-copy">
          <span className="eyebrow">Foro Académico Global</span>
          <h1 id="conference-title">Donde las grandes mentes crean el futuro.</h1>
          <p>
            Gestiona tus artículos, sigue las revisiones del comité y consulta la agenda de la conferencia desde un solo lugar.
          </p>
        </div>

        <ConferenceArtwork />

        <footer className="story-footer">
          <span>© 2026 Foro Académico Converge</span>
          <span className="secure-footer"><Icon name="shield" size={15} /> Portal seguro</span>
        </footer>
      </section>

      <section className="wizard-panel login-panel" aria-label="Inicio de sesión">
        <div className="mobile-header">
          <a className="brand brand-dark" href="#login" aria-label="Inicio de Converge">
            <BrandMark />
            <span>converge</span>
          </a>
          <span>Convocatoria 2027</span>
        </div>

        <div className="wizard login-card">
          <div className="wizard-heading login-heading">
            <span className="step-kicker">Portal de participantes</span>
            <h2>Te damos la bienvenida</h2>
            <p>Inicia sesión para acceder a tus artículos, revisiones y agenda.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>Correo electrónico</span>
              <div className="input-wrap">
                <Icon name="mail" />
                <input type="email" name="identity" placeholder="tu@universidad.edu" autoComplete="username" aria-invalid={Boolean(errors.email)} />
              </div>
              <FieldError message={errors.email} />
            </label>

            <label className="field">
              <span>Contraseña</span>
              <div className="input-wrap">
                <Icon name="lock" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Introduce tu contraseña"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  className="visibility-button"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
              <FieldError message={errors.password} />
            </label>

            <div className="options-row">
              <label className="checkbox-label">
                <input type="checkbox" name="remember" />
                <span className="custom-checkbox"><Icon name="check" size={14} /></span>
                Recuérdame
              </label>
              <a href="#recuperar">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              className={`captcha ${verified ? 'is-verified' : ''}`}
              type="button"
              onClick={() => {
                setVerified((current) => !current);
                setErrors((current) => ({ ...current, captcha: undefined }));
              }}
              aria-pressed={verified}
            >
              <span className="captcha-check">{verified && <Icon name="check" size={22} />}</span>
              <span className="captcha-copy">
                <strong>{verified ? 'Verificación completada' : 'Verifica que eres una persona'}</strong>
                <small>{verified ? 'Ya puedes continuar de forma segura' : 'Haz clic para completar la verificación'}</small>
              </span>
              <span className="captcha-badge">
                <Icon name="shield" size={24} />
                <small>Protegido</small>
              </span>
            </button>
            <FieldError message={errors.captcha} />

            {errors.form && (
              <p className="form-error mt-3" role="alert">
                {errors.form}
              </p>
            )}

            <button className="primary-button login-button" type="submit" disabled={submitting}>
              <span>Iniciar sesión</span>
              <Icon name="arrow" />
            </button>

            <div className="divider"><span>o continúa con</span></div>

            <div className="social-row">
              <button className="social-button" type="button">
                <Icon name="google" />
                Google
              </button>
              <button className="social-button" type="button">
                <Icon name="github" />
                GitHub
              </button>
            </div>
          </form>

          <p className="register-copy">
            ¿Eres nuevo en Converge? <a href="#registro">Crea una cuenta de autor</a>
          </p>

          <details className="mt-4 rounded-lg border border-slate-200 p-3 text-xs text-slate-500">
            <summary className="cursor-pointer font-medium text-slate-600">Cuentas de prueba (prototipo)</summary>
            <ul className="mt-2 space-y-1">
              <li>Administrador: laura.gomez@universidad.edu</li>
              <li>Miembro del comité: andres.restrepo@universidad.edu</li>
              <li>Autor: camila.ortiz@universidad.edu</li>
            </ul>
            <p className="mt-2">Usa cualquier contraseña de 8 o más caracteres.</p>
          </details>
        </div>
      </section>
    </main>
  );
}
