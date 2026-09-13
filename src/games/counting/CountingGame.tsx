import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { COUNTING_ROUNDS } from './countingTypes';

interface CountingGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const CountingGame: React.FC<CountingGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [tappedCreatures, setTappedCreatures] = useState<number[]>([]);

  const activeRound = COUNTING_ROUNDS[currentRoundIdx];

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setIsRoundWon(false);
    setWrongOption(null);
    setTappedCreatures([]);
  };

  const handleCreatureTap = (index: number) => {
    if (isRoundWon) return;
    soundManager.playCountChime(index + 1);
    setTappedCreatures((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const handleNumberSelect = (num: number) => {
    if (isRoundWon || isCompleted) return;

    if (num === activeRound.targetCount) {
      // Correct!
      setIsRoundWon(true);
      setWrongOption(null);
      soundManager.playSuccessChime();

      const nextCompleted = completedRounds + 1;
      setCompletedRounds(nextCompleted);

      setTimeout(() => {
        soundManager.playGiggle();
      }, 300);

      setTimeout(() => {
        if (nextCompleted >= COUNTING_ROUNDS.length) {
          setIsCompleted(true);
          onCompleteActivity?.(3);
        } else {
          setCurrentRoundIdx((prev) => prev + 1);
          setIsRoundWon(false);
          setTappedCreatures([]);
        }
      }, 1300);
    } else {
      // Gentle wrong feedback
      setWrongOption(num);
      soundManager.playSoftBoing();
      setTimeout(() => setWrongOption(null), 600);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#ECFDF5]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-emerald-200/60 to-transparent pointer-events-none rounded-t-[50%] scale-110" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={COUNTING_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Center Creature Garden Area: Landscape 2-Panel (Left: Animals to Count, Center: Nunu, Right: Number Options) */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
        {/* Left Side: Soft Garden Clearing Card with the Animals */}
        <motion.div
          key={currentRoundIdx}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative px-6 py-4 sm:px-8 sm:py-6 rounded-3xl bg-white/85 border-4 border-emerald-200/70 shadow-lg flex flex-col items-center justify-center min-h-[140px] sm:min-h-[170px]"
        >
          {/* Creatures Row */}
          <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-5">
            {Array.from({ length: activeRound.targetCount }).map((_, idx) => {
              const isTapped = tappedCreatures.includes(idx);
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleCreatureTap(idx)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    isRoundWon
                      ? {
                          y: [-8, 0, -8, 0],
                          scale: [1, 1.2, 1],
                          rotate: [0, -8, 8, 0],
                        }
                      : isTapped
                      ? { scale: [1, 1.18, 1], y: [-6, 0] }
                      : { y: [0, -3, 0] }
                  }
                  transition={
                    isRoundWon
                      ? { duration: 0.6, repeat: Infinity, delay: idx * 0.1 }
                      : { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }
                  }
                  className="relative p-1 rounded-2xl cursor-pointer select-none filter drop-shadow-md touch-none"
                  aria-label={`${activeRound.creatureName} ${idx + 1}`}
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl block">
                    {activeRound.creatureEmoji}
                  </span>
                  {/* Gentle touch ripple indicator */}
                  {isTapped && (
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute -top-1 -right-1 text-xl"
                    >
                      ✨
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Sparkles on win */}
          {isRoundWon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.4, 1] }}
              className="absolute -top-4 text-3xl sm:text-4xl"
            >
              🎉
            </motion.div>
          )}
        </motion.div>

        {/* Center: Mascot Nunu cheering */}
        <div className="flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              y: isRoundWon ? [-6, 0, -6] : [0, -3, 0],
              scale: isRoundWon ? 1.15 : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-md">🐰</span>
            <span className="text-xl sm:text-2xl opacity-75">✨</span>
          </motion.div>
        </div>

        {/* Right Side: Giant Number Options */}
        <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
          {activeRound.options.map((num) => {
            const isWrong = wrongOption === num;
            const isCorrect = isRoundWon && num === activeRound.targetCount;

            return (
              <motion.button
                key={num}
                onClick={() => handleNumberSelect(num)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={
                  isWrong
                    ? { x: [-8, 8, -6, 6, 0] }
                    : isCorrect
                    ? {
                        scale: [1, 1.25, 1.15],
                        boxShadow: '0 0 25px rgba(245, 158, 11, 0.7)',
                      }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className={`w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-3xl font-black text-3xl sm:text-4xl md:text-5xl flex items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md active:scale-95 touch-none ${
                  isCorrect
                    ? 'bg-amber-400 text-amber-950 border-white ring-4 ring-amber-300'
                    : 'bg-white text-stone-800 border-emerald-300 hover:border-emerald-400 active:bg-emerald-50'
                }`}
                aria-label={`Número ${num}`}
              >
                {num}
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
