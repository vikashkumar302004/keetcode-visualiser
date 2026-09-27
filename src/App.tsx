import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { VisualizerRunner } from './components/VisualizerRunner';
import { AuthModal } from './components/AuthModal';
import { SheetModal } from './components/SheetModal';
import { ContactModal } from './components/ContactModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { VisualizerModule } from './types';
import { Analytics } from '@vercel/analytics/react';

function MainApp() {
  const [selectedModule, setSelectedModule] = useState<VisualizerModule | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const scrollToVisualizers = () => {
    const element = document.getElementById('visualizers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = (promptMsg: string | null = null) => {
    setAuthPromptMessage(promptMsg);
    setIsAuthOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#002a42] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Fullscreen Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      {/* Subtle Dark Vignette Overlay for Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#002a42]/90 z-0 pointer-events-none" />

      {/* Main Page Layout Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Glassmorphic Navigation Bar */}
        <Navbar
          onExploreClick={scrollToVisualizers}
          onOpenLogin={() => handleOpenAuth()}
          onOpenSheet={() => setIsSheetOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Hero Section */}
        <main className="flex-1">
          <Hero onBeginJourneyClick={scrollToVisualizers} />

          {/* Interactive 16 DSA Visualizers Dashboard */}
          <Dashboard onSelectVisualizer={(module) => setSelectedModule(module)} />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Real Visualizer Engine Runner */}
      {selectedModule && (
        <VisualizerRunner
          module={selectedModule}
          onBack={() => setSelectedModule(null)}
          onRequireAuth={(msg) => handleOpenAuth(msg)}
        />
      )}

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => { setIsAuthOpen(false); setAuthPromptMessage(null); }} 
        promptMessage={authPromptMessage}
      />
      <SheetModal isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Real-time Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
