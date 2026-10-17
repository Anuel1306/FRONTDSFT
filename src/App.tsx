import { FormEvent, ReactNode, useState } from 'react';

type IconName = 'arrow' | 'check' | 'eye' | 'eyeOff' | 'github' | 'google' | 'lock' | 'mail' | 'shield';

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
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
  };

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
      {paths[name]}
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ConferenceArtwork() {
  const nodes = [
    [88, 267, 8],
    [177, 187, 13],
    [282, 256, 9],
    [381, 140, 16],
    [478, 218, 10],
    [137, 82, 10],
    [320, 67, 8],
    [456, 69, 7],
    [361, 335, 8],
  ];

  return (
    <svg className="recovery-art conference-art" viewBox="0 0 560 420" role="img" aria-label="Red abstracta de conocimiento académico">
      <defs>
        <linearGradient id="node-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#A5B4FC" />
          <stop offset="1" stopColor="#67E8F9" />
        </linearGradient>
        <linearGradient id="glass-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EEF2FF" stopOpacity=".17" />
          <stop offset="1" stopColor="#A5B4FC" stopOpacity=".03" />
        </linearGradient>
      </defs>
      <path className="network-line" d="M88 267 177 187 282 256 381 140 478 218M137 82l40 105L320 67l61 73 75-71M282 256l79 79 117-117" />
      <g className="data-card data-card-one">
        <rect x="55" y="231" width="112" height="88" rx="18" fill="url(#glass-gradient)" />
        <path d="M79 291v-27m18 27v-42m18 42v-20m18 20v-33" />
      </g>
      <g className="data-card data-card-two">
        <rect x="289" y="30" width="139" height="83" rx="18" fill="url(#glass-gradient)" />
        <circle cx="317" cy="62" r="9" />
        <path d="M340 57h59M340 73h42M311 91h88" />
      </g>
      <g className="data-card data-card-three">
        <rect x="349" y="302" width="133" height="67" rx="18" fill="url(#glass-gradient)" />
        <path d="M377 336h76" />
      </g>
      {nodes.map(([cx, cy, r], index) => (
        <circle
          key={`${cx}-${cy}`}
          className={`network-node network-node-${(index % 3) + 1}`}
          cx={cx}
          cy={cy}
          r={r}
          fill={index === 3 ? 'url(#node-gradient)' : '#C7D2FE'}
        />
      ))}
      <g className="center-node">
        <circle cx="177" cy="187" r="46" fill="#EEF2FF" fillOpacity=".11" />
        <circle cx="177" cy="187" r="32" fill="#818CF8" />
        <path d="m161 187 10 10 22-23" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showError, setShowError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowError(!verified);
  }

  return (
    <main className="recovery-shell">
      <section className="story-panel" aria-labelledby="conference-title">
        <header className="brand-header">
          <a className="brand" href="/" aria-label="Inicio de Converge">
            <BrandMark />
            <span>converge</span>
          </a>
          <span className="portal-label">Berlín · 18–20 sept, 2025</span>
        </header>

        <div className="story-copy">
          <span className="eyebrow">Foro Académico Global</span>
          <h1 id="conference-title">Donde las grandes mentes crean el futuro.</h1>
          <p>
            Únete a investigadores, docentes e innovadores de todo el mundo durante tres días de ideas que impulsan el conocimiento.
          </p>

          <div className="event-stats" aria-label="Estadísticas de la conferencia">
            <div><strong>2.400+</strong><span>Asistentes</span></div>
            <div><strong>86</strong><span>Países</span></div>
            <div><strong>120</strong><span>Sesiones</span></div>
          </div>
        </div>

        <ConferenceArtwork />

        <footer className="story-footer">
          <span>© 2025 Foro Académico Converge</span>
          <span className="secure-footer"><Icon name="shield" size={15} /> Portal seguro</span>
        </footer>
      </section>

      <section className="wizard-panel login-panel" aria-label="Inicio de sesión">
        <div className="mobile-header">
          <a className="brand brand-dark" href="/" aria-label="Inicio de Converge">
            <BrandMark />
            <span>converge</span>
          </a>
          <span>Berlín · 2025</span>
        </div>

        <div className="wizard login-card">
          <div className="wizard-heading login-heading">
            <span className="step-kicker">Portal de asistentes</span>
            <h2>Te damos la bienvenida</h2>
            <p>Inicia sesión para acceder a tu agenda, sesiones y materiales de la conferencia.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Correo electrónico o usuario</span>
              <div className="input-wrap">
                <Icon name="mail" />
                <input
                  type="text"
                  name="identity"
                  placeholder="tu@universidad.edu"
                  autoComplete="username"
                  required
                />
              </div>
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
                  required
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
                setShowError(false);
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

            {showError && <p className="form-error" role="alert">Completa la verificación de seguridad.</p>}

            <button className="primary-button login-button" type="submit">
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
            ¿Eres nuevo en Converge? <a href="#registro">Crea una cuenta</a>
          </p>
        </div>

        <footer className="wizard-footer">
          <a href="#privacidad">Privacidad</a>
          <a href="#ayuda">Ayuda</a>
          <span>Español</span>
        </footer>
      </section>
    </main>
  );
}
