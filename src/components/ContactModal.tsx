import React, { useState } from 'react';
import { X, Linkedin, Mail, User, GraduationCap, Send, CheckCircle2, Sparkles, Cpu, Terminal, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-rise font-sans overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl liquid-glass rounded-3xl border border-white/20 p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl my-auto scrollbar-thin focus:outline-none"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header & Vision Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs tracking-wider uppercase text-blue-300 mb-4 border border-blue-500/20 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Keetcode® Vision & Contact</span>
          </div>

          <h2 
            className="text-3xl sm:text-5xl text-white font-semibold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            Crafting digital spaces for <em className="not-italic text-gray-400">deep algorithmic focus.</em>
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed mt-3 font-sans">
            Keetcode® transforms complex Data Structures and Algorithms from theoretical concepts into vivid, step-by-step visual experiences for competitive programmers and software engineers.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <Cpu className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="text-sm text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              16 Algorithm Engines
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">Dedicated visualizer suites across all major DSA topics.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <Terminal className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-sm text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Line-by-Line Execution
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">Synchronized state memory and code trace inspection.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-sm text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Glassmorphic UI
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">Zero-distraction dark mode designed with Playfair & Inter.</p>
          </div>
        </div>

        {/* 2. Developer Bio & LinkedIn Section (Directly under Vision) */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl liquid-glass border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-xl shrink-0">
              V
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full border border-white/10">
                Founder & Lead Developer
              </span>
              <h3 
                className="text-2xl text-white font-semibold mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Vikash
              </h3>
              <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5 mt-0.5 font-sans">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>B.Tech</span>
              </p>
            </div>
          </div>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/feed"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-full px-5 py-2.5 text-xs text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
          >
            <Linkedin className="w-4 h-4 text-blue-400" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>

        {/* 3. Direct Contact Form */}
        <div className="pt-6 border-t border-white/10">
          <h3 
            className="text-2xl text-white font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Send a Message
          </h3>
          <p className="text-xs text-gray-400 mb-6 font-sans">
            Have questions, feature suggestions, or feedback? Reach out directly.
          </p>

          {submitted ? (
            <div className="py-8 text-center space-y-3 bg-white/[0.02] rounded-2xl border border-white/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-base text-white font-semibold">Message Sent Successfully!</p>
              <p className="text-xs text-gray-400">Thank you for getting in touch with Vikash.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 font-medium mb-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-medium mb-1">Your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your feedback or inquiry here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Close Window
                </button>
                <button
                  type="submit"
                  className="liquid-glass rounded-full px-8 py-3 text-xs text-white font-semibold flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
