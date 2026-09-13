import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { PATTERN_ROUNDS } from './patternTypes';

interface PatternGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const PatternGame: React.FC<PatternGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [wrongOption, setWrongOption] = useState<string | null>(null);

  const activeRound = PATTERN_ROUNDS[currentRoundIdx];

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setIsRoundWon(false);
    setWrongOption(null);
  };

  const handleOptionSelect = (optionEmoji: string) => {
    if (isRoundWon || isCompleted) return;

    if (optionEmoji === activeRound.correctAnswer) {
      // Success
      setIsRoundWon(true);
      setWrongOption(null);
      soundManager.playSnap();
      soundManager.playSuccessChime();

      const nextCompleted = completedRounds + 1;
      setCompletedRounds(nextCompleted);

      setTimeout(() => {
        soundManager.playGiggle();
      }, 300);

      setTimeout(() => {
        if (nextCompleted >= PATTERN_ROUNDS.length) {
          setIsCompleted(true);
          onCompleteActivity?.(3);
        } else {
          setCurrentRoundIdx((prev) => prev + 1);
          setIsRoundWon(false);
        }
      }, 1200);
    } else {
      // Mismatch
      setWrongOption(optionEmoji);
      soundManager.playSoftBoing();
      setTimeout(() => setWrongOption(null), 500);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5] to-[#FEF3C7]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={PATTERN_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Main Pattern Stage: Landscape side-by-side */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
        {/* Left Side: Pattern Train / Ribbon */}
        <div className="bg-white/90 rounded-3xl border-4 border-orange-200/80 shadow-lg px-4 py-3 sm:px-6 sm:py-5 flex flex-nowrap items-center justify-center gap-2 sm:gap-3">
          {activeRound.sequence.map((emoji, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-xs flex-shrink-0"
            >
              {emoji}
            </motion.div>
          ))}

          {/* Missing slot box */}
          <motion.div
            animate={
              isRoundWon
                ? { scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl border-4 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl shadow-md flex-shrink-0 ${
              isRoundWon
                ? 'bg-amber-300 border-amber-500 shadow-amber-300/50'
                : 'bg-amber-100/80 border-dashed border-amber-400'
            }`}
          >
            {isRoundWon ? activeRound.correctAnswer : '❓'}
          </motion.div>
        </div>

        {/* Center: Mascot Nunu */}
        <div className="flex items-center justify-center pointer-events-none select-none">
          <motion.div
            animate={{
              y: isRoundWon ? [-6, 0, -6] : [0, -2, 0],
              scale: isRoundWon ? 1.15 : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🐰</span>
            <span className="text-xl sm:text-2xl">✨</span>
          </motion.div>
        </div>

        {/* Right Side: Options Row */}
        <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4">
          {activeRound.options.map((emoji) => {
            const isWrong = wrongOption === emoji;

            return (
              <motion.button
                key={emoji}
                onClick={() => handleOptionSelect(emoji)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : {}}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-3xl bg-white border-4 border-orange-300 hover:border-orange-400 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-md active:scale-95 cursor-pointer touch-none"
                aria-label={`Opção ${emoji}`}
              >
                {emoji}
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Success Celebration */}
      <AnimatePresence>
        {isCompleted && (
          <SuccessCelebration onContinue={onBackToHome} starsCount={3} />
        )}
      </AnimatePresence>
    </div>
  );
};
