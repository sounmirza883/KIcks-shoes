import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'recovery';

interface AuthModalProps {
  mode: AuthMode | null; // null = closed
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onToast: (message: string) => void;
}

const TITLES: Record<AuthMode, string> = {
  signin: 'Sign In',
  signup: 'Create Account',
  forgot: 'Reset Password',
  recovery: 'Choose a New Password',
};

const inputClass =
  'w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-black';
const labelClass = 'block text-xs font-bold text-neutral-700 uppercase mb-1';
const linkClass =
  'text-xs font-bold text-neutral-600 hover:text-black underline underline-offset-2 cursor-pointer';

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onModeChange, onClose, onToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // This modal stays mounted while closed, so reset the form whenever the mode changes.
  useEffect(() => {
    setPassword('');
    setError('');
    setNotice('');
    setSubmitting(false);
    if (!mode) setEmail('');
  }, [mode]);

  // Escape closes the dialog (only while it is open).
  useEffect(() => {
    if (!mode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, onClose]);

  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Accounts are unavailable: Supabase is not configured.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(err.message);
        else {
          onToast('Signed in');
          onClose();
        }
      } else if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) setError(err.message);
        else if (data.session) {
          onToast('Account created');
          onClose();
        } else {
          // Same message whether or not the email already exists (no account enumeration).
          setNotice('Check your email to confirm your account, then sign in.');
        }
      } else if (mode === 'forgot') {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        setNotice('If an account exists for that email, a reset link is on its way.');
      } else {
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) setError(err.message);
        else {
          onToast('Password updated');
          onClose();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const showEmail = mode !== 'recovery';
  const showPassword = mode !== 'forgot';
  const newPassword = mode === 'signup' || mode === 'recovery';

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-title"
          className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-1">
            KICKS. ACCOUNT
          </span>
          <h2 id="auth-title" className="text-2xl font-black text-neutral-900 uppercase mb-6">
            {TITLES[mode]}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {showEmail && (
              <div>
                <label htmlFor="auth-email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {showPassword && (
              <div>
                <label htmlFor="auth-password" className={labelClass}>
                  {mode === 'recovery' ? 'New Password' : 'Password'}
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={newPassword ? 8 : undefined}
                  autoComplete={newPassword ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
                {newPassword && (
                  <p className="text-[11px] text-neutral-500 mt-1">At least 8 characters.</p>
                )}
              </div>
            )}

            {error && (
              <p role="alert" className="text-xs font-semibold text-red-600">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="text-xs font-semibold text-emerald-600">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#111111] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
            >
              {submitting ? 'Please wait…' : TITLES[mode]}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-between gap-2">
            {mode === 'signin' && (
              <>
                <button type="button" onClick={() => onModeChange('forgot')} className={linkClass}>
                  Forgot password?
                </button>
                <button type="button" onClick={() => onModeChange('signup')} className={linkClass}>
                  Create an account
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button type="button" onClick={() => onModeChange('signin')} className={linkClass}>
                Already have an account? Sign in
              </button>
            )}
            {mode === 'forgot' && (
              <button type="button" onClick={() => onModeChange('signin')} className={linkClass}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
