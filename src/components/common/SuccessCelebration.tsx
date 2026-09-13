import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/soundManager';

interface SuccessCelebrationProps {
  onContinue: () => void;
  starsCount?: number;
  mascotEmoji?: string;
  delayContinueMs?: number;
}

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  onContinue,
  starsCount = 3,
  mascotEmoji = '🐰',
  delayContinueMs = 1200,
}) => {
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    soundManager.playFanfare();
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {}

    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, delayContinueMs);

    return () => clearTimeout(timer);
  }, [delayContinueMs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-amber-50/85 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.5, y: 20 }}
        animate={{ scale: [0.9, 1.1, 1], y: [0, -10, 0] }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Mascot */}
        <div className="text-7xl sm:text-8xl mb-3 filter drop-shadow-lg animate-bounce select-none">
          {mascotEmoji}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-3 mb-6">
          {Array.from({ length: starsCount }).map((_, starIdx) => (
            <motion.span
              key={starIdx}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring', stiffness: 400 }}
              className="text-5xl sm:text-6xl filter drop-shadow-md select-none"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Big, toddler-friendly Continue Button */}
        <AnimatePresence>
          {showContinueButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playPop(620);
                onContinue();
              }}
              aria-label="Voltar para a trilha"
              className="mt-2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-xl hover:shadow-2xl flex items-center justify-center border-4 border-white cursor-pointer active:scale-95 transition-transform"
            >
              <ArrowRight className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
