import React from 'react';
import { X, User, Mail, ShieldCheck, Sparkles, LogOut, CheckCircle2, Code2, Cpu, Trophy, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans">
      <div className="relative w-full max-w-lg liquid-glass rounded-3xl border border-white/20 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs text-emerald-300 mb-6 border border-emerald-500/30 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google Authenticated Account</span>
        </div>

        {/* Profile Card Info */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/10">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl" 
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl liquid-glass border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
              {user.name?.[0]?.toUpperCase() || 'V'}
            </div>
          )}

          <div>
            <h2 
              className="text-2xl text-white font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {user.name}
            </h2>
            <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1 font-sans">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{user.email}</span>
            </p>
            <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-mono bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Pro Algorist • All 16 Engines Unlocked
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
            <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-white font-mono">16/16</span>
            <p className="text-[10px] text-gray-400 font-sans">Engines Unlocked</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
            <Code2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-white font-mono">150+</span>
            <p className="text-[10px] text-gray-400 font-sans">DSA Problems</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 text-center">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-lg font-bold text-white font-mono">Master</span>
            <p className="text-[10px] text-gray-400 font-sans">Skill Tier</p>
          </div>
        </div>

        {/* Account Features List */}
        <div className="space-y-2.5 mb-8 font-sans bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DSA Sheet Synchronization</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Line-by-Line Code Trace</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">UNLOCKED</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 font-sans">
          <a
            href="https://myaccount.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Google Account</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="liquid-glass rounded-full px-6 py-2.5 text-xs text-rose-300 hover:text-white font-semibold flex items-center gap-2 hover:bg-rose-500/20 transition-all cursor-pointer border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
