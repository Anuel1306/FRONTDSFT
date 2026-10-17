import { ChangeEvent, ClipboardEvent, FormEvent, Fragment, KeyboardEvent, useRef, useState } from 'react';

type WizardStep = 1 | 2 | 3; // 3 = success

const STEPS = ['Verify email', 'Reset password'];

const PASSWORD_RULES = [
  { label: '8+ characters', test: (value: string) => value.length >= 8 },
  { label: 'A letter', test: (value: string) => /[A-Za-z]/.test(value) },
  { label: 'A number', test: (value: string) => /\d/.test(value) },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordRecoveryWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleSendPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setStep(2);
  }

  function handlePinChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digit = event.target.value.replace(/\D/g, '').slice(-1);
    setPin((current) => current.map((value, i) => (i === index ? digit : value)));
    if (digit && index < 5) pinRefs.current[index + 1]?.focus();
  }

  function handlePinKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  }

  function handlePinPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;
    setPin(Array.from({ length: 6 }, (_, i) => digits[i] ?? ''));
    pinRefs.current[digits.length - 1]?.focus();
  }

  function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin.join('').length !== 6) {
      setError('Enter the 6-digit PIN.');
      return;
    }
    if (!PASSWORD_RULES.every((rule) => rule.test(newPassword))) {
      setError('Your new password does not meet the requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setError(null);
    setStep(3);
  }

  return (
    <main className="wizard-panel">
      <div className="wizard">
        <nav className="progress" aria-label="Password recovery progress">
          {STEPS.map((label, index) => {
            const number = index + 1;
            const state = step > number ? 'done' : step === number ? 'active' : '';
            return (
              <Fragment key={label}>
                {index > 0 && <div className={`progress-line ${step > 1 ? 'active' : ''}`} />}
                <div className={`progress-step ${state}`} aria-current={step === number ? 'step' : undefined}>
                  <span>{step > number ? '✓' : number}</span>
                  <div>
                    <strong>{label}</strong>
                    <small>Step {number} of 2</small>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </nav>

        {step === 1 && (
          <>
            <div className="wizard-heading">
              <span className="step-kicker">Account recovery</span>
              <h2>Forgot your password?</h2>
              <p>Enter the email linked to your account and we will send a 6-digit PIN to verify it is you.</p>
            </div>

            <form onSubmit={handleSendPin} noValidate>
              <label className="field">
                <span>Email address</span>
                <div className="input-wrap">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@university.edu"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button className="primary-button" type="submit">
                <span>Send PIN</span>
              </button>
            </form>

            <p className="register-copy">
              <a href="#">Back to sign in</a>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="wizard-heading">
              <span className="step-kicker">Account recovery</span>
              <h2>Enter your PIN</h2>
              <p>
                We sent a 6-digit code to <strong>{email.trim()}</strong>. Set a new password below.
              </p>
            </div>

            <form onSubmit={handleReset} noValidate>
              <fieldset className="pin-fieldset">
                <legend>6-digit PIN</legend>
                <div className="pin-row">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        pinRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      aria-label={`PIN digit ${index + 1}`}
                      value={digit}
                      autoFocus={index === 0}
                      onChange={(event) => handlePinChange(index, event)}
                      onKeyDown={(event) => handlePinKeyDown(index, event)}
                      onPaste={handlePinPaste}
                    />
                  ))}
                </div>
                <div className="pin-meta">
                  <span>Code expires in 10 minutes</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPin(Array(6).fill(''));
                      pinRefs.current[0]?.focus();
                    }}
                  >
                    Resend PIN
                  </button>
                </div>
              </fieldset>

              <label className="field">
                <span>New Password</span>
                <div className="input-wrap">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </div>
              </label>

              <div className="password-hint">
                {PASSWORD_RULES.map((rule) => (
                  <span key={rule.label} className={rule.test(newPassword) ? 'met' : ''}>
                    <i />
                    {rule.label}
                  </span>
                ))}
              </div>

              <label className="field">
                <span>Confirm New Password</span>
                <div className="input-wrap">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat the new password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button className="primary-button" type="submit">
                <span>Reset Password</span>
              </button>
            </form>

            <button
              className="back-button"
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
            >
              Use a different email
            </button>
          </>
        )}

        {step === 3 && (
          <div className="success-state">
            <div className="success-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 4.2 4.2L19 6.5" />
              </svg>
            </div>
            <h2>Password updated</h2>
            <p>Your password has been reset. You can now sign in with your new password.</p>
            <a className="primary-button" href="#">
              <span>Back to sign in</span>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
