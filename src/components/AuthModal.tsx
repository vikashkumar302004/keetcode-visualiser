import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  promptMessage = null 
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Sign-In failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans">
      <div className="relative w-full max-w-md liquid-glass rounded-3xl border border-white/20 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Custom Gated Problem Prompt Message if present */}
        {promptMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{promptMessage}</p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl liquid-glass border border-white/15 flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 
            className="text-3xl text-white font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            Sign In to Keetcode
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-sans leading-relaxed">
            Unlock all 16 Data Structures & Algorithms visualizer suites with 1-click authentication.
          </p>
        </div>

        {/* Big 1-Click Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full bg-white text-slate-900 rounded-2xl py-4 px-6 text-sm font-semibold flex items-center justify-center gap-3 hover:bg-slate-100 hover:scale-[1.02] transition-all cursor-pointer shadow-2xl mb-8 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-base font-bold">Continue with Google</span>
            </>
          )}
        </button>

        {/* Feature Highlights */}
        <div className="space-y-2.5 pt-4 border-t border-white/10 font-sans">
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant access to all 16 algorithm visualizers</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Save & track DSA Sheet problem status</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Line-by-line code trace & memory inspection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
