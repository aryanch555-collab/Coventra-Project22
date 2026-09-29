import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AgentDialerView } from './components/AgentDialerView';
import { ManagerDashboardView } from './components/ManagerDashboardView';
import { CoventraLogo } from './components/CoventraLogo';
import { 
  PhoneCall, 
  LayoutDashboard, 
  LogOut, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const { 
    user, 
    profile, 
    role, 
    loading, 
    signIn,
    requestPasswordReset,
    signOut 
  } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple password reset state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ message?: string; error?: string } | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await signIn(emailInput, passwordInput);
      if (!res.success) {
        setAuthError(res.error || 'Invalid email or password.');
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    setResetLoading(true);
    try {
      const res = await requestPasswordReset(resetEmail);
      if (res.success) {
        setResetStatus({ message: res.message || 'Password reset request submitted. Please check with your manager.' });
      } else {
        setResetStatus({ error: res.error || 'Failed to submit request.' });
      }
    } catch {
      setResetStatus({ error: 'Failed to submit request.' });
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white animate-fade-in">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-slate-300">Loading CallFlow...</p>
        </div>
      </div>
    );
  }

  // Simplified Sign-In Screen
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-in">
          {/* Coventra Global Logo in neat light container */}
          <div className="flex justify-center mb-4">
            <CoventraLogo size="lg" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>CallFlow</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to your account
          </p>
        </div>

        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 animate-fade-in">
          <div className="bg-slate-800/90 backdrop-blur-xs py-8 px-6 shadow-xl border border-slate-700/80 rounded-2xl sm:px-8">
            {authError && (
              <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900/90 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(emailInput);
                      setResetStatus(null);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900/90 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.985] shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Simple Password Reset Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-700 animate-fade-in text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <h3 className="text-base font-bold text-white">Reset Password</h3>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-400 hover:text-white text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 my-3">
                Enter your account email below. Your manager will be notified to set a new password.
              </p>

              {resetStatus?.message && (
                <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resetStatus.message}</span>
                </div>
              )}

              {resetStatus?.error && (
                <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{resetStatus.error}</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.985] text-white rounded-lg font-semibold text-xs transition"
                  >
                    {resetLoading ? 'Submitting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Signed In Application View
  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col">
      {/* Dark Navigation Header with Coventra Global Logo in neat light container */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Group */}
            <div className="flex items-center space-x-3.5">
              {/* Coventra Global Logo in neat light-coloured container */}
              <CoventraLogo size="md" />

              <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

              {/* CallFlow App Name & Section */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                  role === 'manager' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {role === 'manager' ? <LayoutDashboard className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight text-white block leading-tight">
                    CallFlow
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {role === 'manager' ? 'Manager Portal' : 'Agent Calling Console'}
                  </span>
                </div>
              </div>
            </div>

            {/* Authenticated User Status & Sign Out */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 leading-tight">
                  {profile?.displayName || user.displayName || 'User'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {user.email}
                </span>
              </div>

              {/* Role Badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                role === 'manager'
                  ? 'bg-indigo-950 text-indigo-200 border-indigo-700/60'
                  : 'bg-emerald-950 text-emerald-200 border-emerald-700/60'
              }`}>
                {role === 'manager' ? 'Manager' : 'Agent'}
              </span>

              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition active:scale-[0.95]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main View with subtle fade-in */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {role === 'agent' ? (
          <AgentDialerView />
        ) : (
          <ManagerDashboardView />
        )}
      </main>
    </div>
  );
}
