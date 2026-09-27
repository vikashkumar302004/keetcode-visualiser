import React, { useState } from 'react';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onExploreClick?: () => void;
  onOpenLogin?: () => void;
  onOpenSheet?: () => void;
  onOpenContact?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onExploreClick, 
  onOpenLogin, 
  onOpenSheet, 
  onOpenContact,
  onOpenProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="relative z-20 font-sans">
      <nav className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <a 
          href="#" 
          className="text-3xl tracking-tight text-white font-semibold hover:opacity-90 transition-opacity flex items-center gap-0.5"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
        >
          Keetcode<sup className="text-xs font-sans tracking-normal ml-0.5 font-normal">®</sup>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm text-white font-semibold transition-colors">
            Home
          </a>
          <a 
            href="#visualizers" 
            onClick={(e) => { e.preventDefault(); onExploreClick?.(); }}
            className="text-sm text-gray-300 font-medium hover:text-white transition-colors"
          >
            Visualizer
          </a>
          <button 
            onClick={onOpenSheet}
            className="text-sm text-gray-300 font-medium hover:text-white transition-colors cursor-pointer"
          >
            DSA Sheet
          </button>
          <button 
            onClick={onOpenContact}
            className="text-sm text-gray-300 font-medium hover:text-white transition-colors cursor-pointer"
          >
            Contact Us
          </button>
        </div>

        {/* CTA Buttons (Login with Google Symbol & Begin Journey) */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            /* Logged In User Avatar Badge (Clickable to open Profile Modal) */
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full liquid-glass border border-white/20 hover:border-white/40 transition-all cursor-pointer group shadow-lg"
              >
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-xs font-bold font-mono">
                    {user?.name?.[0]?.toUpperCase() || 'V'}
                  </div>
                )}
                <span className="text-xs text-white font-semibold group-hover:text-blue-200 transition-colors">{user?.name || 'Developer'}</span>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Login button with Google Icon & Begin Journey */
            <>
              <button
                onClick={onOpenLogin}
                className="liquid-glass rounded-full px-5 py-2.5 text-xs text-white font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Login</span>
              </button>

              <button
                onClick={onExploreClick}
                className="liquid-glass rounded-full px-6 py-2.5 text-xs text-white font-semibold transition-transform duration-300 hover:scale-[1.03] cursor-pointer hidden sm:block"
              >
                Begin Journey
              </button>
            </>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden liquid-glass mx-6 rounded-2xl p-6 flex flex-col space-y-4 text-center border border-white/10 backdrop-blur-md">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white font-semibold">
            Home
          </a>
          <a 
            href="#visualizers" 
            onClick={() => { setMobileMenuOpen(false); onExploreClick?.(); }} 
            className="text-sm text-gray-300 font-medium hover:text-white"
          >
            Visualizer
          </a>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenSheet?.(); }} 
            className="text-sm text-gray-300 font-medium hover:text-white"
          >
            DSA Sheet
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenContact?.(); }} 
            className="text-sm text-gray-300 font-medium hover:text-white"
          >
            Contact Us
          </button>

          <div className="pt-2 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenProfile?.(); }}
                  className="w-full py-2.5 text-xs text-blue-300 font-semibold rounded-full border border-blue-500/30 flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile ({user?.name})</span>
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-xs text-rose-300 font-semibold rounded-full border border-rose-500/30"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLogin?.(); }}
                className="w-full liquid-glass py-2.5 text-xs text-white font-semibold rounded-full flex items-center justify-center gap-2"
              >
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
