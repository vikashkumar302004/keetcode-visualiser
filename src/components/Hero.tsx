import React from 'react';

interface HeroProps {
  onBeginJourneyClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBeginJourneyClick }) => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px]">
      {/* H1 Headline */}
      <h1 
        className="animate-fade-rise hero-title text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-7xl font-semibold text-white"
        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
      >
        Where <em className="not-italic font-bold text-gray-400">dreams</em> rise <em className="not-italic font-bold text-gray-400">through the silence.</em>
      </h1>

      {/* Subtext */}
      <p className="animate-fade-rise-delay subtext text-gray-400 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans font-normal">
        We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
      </p>

      {/* CTA Button */}
      <div className="animate-fade-rise-delay-2 mt-12">
        <button
          onClick={onBeginJourneyClick}
          className="liquid-glass rounded-full px-14 py-5 text-base text-white font-semibold font-sans hover:scale-[1.03] transition-transform duration-300 cursor-pointer shadow-2xl"
        >
          Begin Journey
        </button>
      </div>
    </section>
  );
};
