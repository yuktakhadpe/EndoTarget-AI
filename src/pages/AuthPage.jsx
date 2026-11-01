import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { USER_ROLES } from '../services/userService';
import {
  Dna,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';

export function AuthPage() {
  const { login, register, navigateTo, showNotification } = useResearch();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Form states - clean initial values (not hardcoded to Dr. Elena Vance)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES[4], // 'Research Scientist'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showNotification('Please enter your email and password.', 'warning');
      return;
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        showNotification('Please enter your full name.', 'warning');
        return;
      }
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    } else {
      login({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const handleInstantDemoLogin = () => {
    login({
      email: 'elena.vance@reproductive-genomics.org',
      password: 'demo',
    });
  };

  const handleSendPasswordReset = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showNotification('Please provide your email address.', 'warning');
      return;
    }
    setShowForgotModal(false);
    showNotification(`Password reset link dispatched to ${forgotEmail}`, 'success');
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to landing link */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          ← Return to Landing Page
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 items-center justify-center text-slate-950 shadow-lg shadow-teal-500/25 mb-3">
          <Dna className="w-7 h-7 text-slate-950" />
        </div>
        <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
          EndoTarget<span className="text-teal-600">.AI</span> Research Access
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to access your research library, discovery tools, and priority rankings
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-200 sm:px-10">
          
          {/* Quick Instant Demo Access Pill */}
          <div className="mb-6 p-3.5 rounded-xl bg-teal-50 border border-teal-200/90 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>One-Click Academic & Drug Discovery Access</span>
            </div>
            <p className="text-[11px] text-teal-800 leading-tight">
              Explore all platform features preloaded with scientific literature and target dossiers.
            </p>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="mt-1 w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Instant Access as Dr. Elena Vance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Researcher Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    User Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900 font-medium"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@university-or-pharma.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>{mode === 'login' ? 'Sign In to Research Workspace' : 'Register Researcher Account'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Scientific Compliance Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Encrypted biomedical workspace session
            </span>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-heading font-bold text-sm text-slate-900">Reset Account Password</h4>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your institutional email address and we'll dispatch a secure recovery token.
            </p>
            <form onSubmit={handleSendPasswordReset} className="space-y-3">
              <input
                type="email"
                required
                placeholder="name@institution.org"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
