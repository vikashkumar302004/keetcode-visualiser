import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome back to Keetcode! Logged in as ${email || 'Developer'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans">
      <div className="relative w-full max-w-md liquid-glass rounded-3xl border border-white/20 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl liquid-glass border border-white/15 flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 
            className="text-3xl text-white font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            Welcome Back
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-sans">
            Sign in to sync your algorithmic progress and problem solutions.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="vikash@keetcode.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-0" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:text-white transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full liquid-glass rounded-xl py-3 text-sm text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 cursor-pointer mt-6"
          >
            <span>Sign In to Keetcode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 font-sans">
          Don't have an account?{' '}
          <a href="#" className="text-white font-semibold hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};
