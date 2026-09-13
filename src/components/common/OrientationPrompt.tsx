import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Sparkles } from 'lucide-react';
import { NunuAvatar } from './NunuAvatar';

export const OrientationPrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth;
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Attempt standard Screen Orientation API lock if supported (PWA / full-screen Android Chrome)
    try {
      if (window.screen?.orientation && 'lock' in window.screen.orientation) {
        // @ts-expect-error standard ScreenOrientation API
        window.screen.orientation.lock('landscape').catch(() => {
          // Normal fallback for Safari / browsers that do not allow web lock
        });
      }
    } catch {}

    const checkOrientation = () => {
      // Compare dimensions
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      if (!portrait) {
        // If turned to landscape, reset dismissed so it guards again next time
        setDismissed(false);
      }
    };

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#FEFCE8]/95 backdrop-blur-md select-none touch-none"
      >
        {/* Soft Background Ambiance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>

        {/* Central Non-verbal Card */}
        <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
          {/* Nunu with gentle smile */}
          <div className="mb-4">
            <NunuAvatar size="lg" isHappy={true} interactive={false} />
          </div>

          {/* Animated Rotating Smartphone Indicator */}
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            {/* Ambient pulse ring */}
            <div className="absolute inset-2 rounded-full bg-amber-200/50 animate-pulse pointer-events-none" />

            {/* Rotating device frame */}
            <div className="animate-rotate-device">
              <div className="w-16 h-28 rounded-2xl border-4 border-stone-800 bg-white shadow-xl flex flex-col items-center justify-between p-1.5 relative">
                {/* Speaker pill notch */}
                <div className="w-5 h-1 bg-stone-300 rounded-full" />

                {/* Little cute screen content */}
                <div className="w-full flex-1 my-1 rounded-lg bg-amber-100/70 flex flex-col items-center justify-center">
                  <span className="text-2xl filter drop-shadow-xs">🐰</span>
                </div>

                {/* Home indicator bar */}
                <div className="w-6 h-0.5 bg-stone-300 rounded-full" />
              </div>
            </div>

            {/* Circular Arrow around phone */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none flex items-center justify-between text-amber-500 opacity-70"
            >
              <RotateCw className="w-7 h-7 -translate-x-1" />
              <Sparkles className="w-5 h-5 translate-x-1" />
            </motion.div>
          </div>

          {/* Gentle visual hint - zero reading dependency */}
          <div className="mt-4 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-amber-300/70 shadow-xs">
            <span className="text-2xl">📱</span>
            <span className="text-xl">➡️</span>
            <span className="text-2xl -rotate-90">📱</span>
          </div>

          {/* Discreet bypass button for developers / parents testing on narrow desktop windows */}
          <button
            onClick={() => setDismissed(true)}
            className="mt-6 text-xs text-stone-400 hover:text-stone-600 underline cursor-pointer py-1 px-3"
            aria-label="Continuar em modo vertical"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
