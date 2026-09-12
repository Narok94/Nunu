import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ChildButton } from './ChildButton';
import { soundManager } from '../../audio/soundManager';

interface SuccessCelebrationProps {
  onNextRound: () => void;
  onGoHome: () => void;
  starsEarned?: number;
}

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  onNextRound,
  onGoHome,
  starsEarned = 5,
}) => {
  useEffect(() => {
    // Play celebratory musical fanfare (gentle sound effects only, no voice)
    soundManager.playFanfare();

    // Trigger canvas confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);

      return () => clearTimeout(timeout);
    } catch {}
  }, []);

  return (
    <motion.div
      id="success-celebration-overlay"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-white/98 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-amber-100 text-center flex flex-col items-center">
        {/* Star Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -4, 4, 0],
          }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100/80 flex items-center justify-center border border-amber-200/70 mb-3 text-4xl sm:text-5xl"
        >
          ⭐
        </motion.div>

        {/* Celebratory Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1">
          Muito Bem!
        </h2>
        <p className="text-sm sm:text-base font-normal text-stone-500 mb-5">
          Você alimentou todos os bichinhos! 🎉
        </p>

        {/* Stars Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-6 bg-amber-50/60 px-5 py-2 rounded-full border border-amber-100">
          {Array.from({ length: starsEarned }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.12 * i, type: 'spring', stiffness: 300 }}
              className="text-2xl sm:text-3xl filter drop-shadow-xs"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          <ChildButton
            id="celebration-play-again-button"
            variant="success"
            size="lg"
            onClick={onNextRound}
            className="flex-1"
          >
            <span>Brincar de Novo! 🎈</span>
          </ChildButton>

          <ChildButton
            id="celebration-home-button"
            variant="ghost"
            size="lg"
            onClick={onGoHome}
            className="sm:w-auto"
          >
            <span>Início 🏠</span>
          </ChildButton>
        </div>
      </div>
    </motion.div>
  );
};
