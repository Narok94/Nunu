import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { SIZE_ROUNDS, SizeItem } from './sizeTypes';

interface SizeOrderingGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const SizeOrderingGame: React.FC<SizeOrderingGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Placed slots: [smallPlaced, mediumPlaced, largePlaced]
  const [placedItems, setPlacedItems] = useState<(SizeItem | null)[]>([null, null, null]);
  const [shuffledChoices, setShuffledChoices] = useState<SizeItem[]>([]);
  const [wrongItemId, setWrongItemId] = useState<string | null>(null);

  const activeRound = SIZE_ROUNDS[currentRoundIdx];

  const setupRound = (roundIdx: number) => {
    const round = SIZE_ROUNDS[roundIdx];
    // Shuffle the 3 choices
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setShuffledChoices(shuffled);
    setPlacedItems([null, null, null]);
    setWrongItemId(null);
  };

  useEffect(() => {
    setupRound(currentRoundIdx);
  }, [currentRoundIdx]);

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setupRound(0);
  };

  const handleChoiceClick = (item: SizeItem) => {
    // Determine expected sizeKey for the next empty slot:
    // Slot 0 requires 'small'
    // Slot 1 requires 'medium'
    // Slot 2 requires 'large'
    const nextSlotIdx = placedItems.findIndex((p) => p === null);
    if (nextSlotIdx === -1) return;

    const expectedKeys: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const expectedKey = expectedKeys[nextSlotIdx];

    if (item.sizeKey === expectedKey) {
      // Correct size placement!
      soundManager.playSnap();
      const updatedPlaced = [...placedItems];
      updatedPlaced[nextSlotIdx] = item;
      setPlacedItems(updatedPlaced);

      // Remove from choices
      setShuffledChoices((prev) => prev.filter((c) => c.id !== item.id));

      // If all 3 slots filled
      if (nextSlotIdx === 2) {
        soundManager.playSuccessChime();
        const nextCompleted = completedRounds + 1;
        setCompletedRounds(nextCompleted);

        setTimeout(() => {
          soundManager.playGiggle();
        }, 350);

        setTimeout(() => {
          if (nextCompleted >= SIZE_ROUNDS.length) {
            setIsCompleted(true);
            onCompleteActivity?.(3);
          } else {
            setCurrentRoundIdx((prev) => prev + 1);
          }
        }, 1300);
      }
    } else {
      // Wrong size chosen
      setWrongItemId(item.id);
      soundManager.playSoftBoing();
      setTimeout(() => setWrongItemId(null), 500);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDFA] via-[#CCFBF1] to-[#ECFDF5]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-teal-200/35 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={SIZE_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Main Pedestals Stage: Landscape side-by-side (Left: Pedestals, Center: Mascot, Right: Choices) */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
        {/* Left Side: 3 Ascending Pedestals (Pequeno, Médio, Grande) */}
        <div className="flex items-end justify-center gap-2.5 sm:gap-4 p-3 rounded-3xl bg-white/60 border-2 border-teal-200/60 shadow-xs">
          {/* Slot 0: Pequeno */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-3 border-dashed border-teal-400 bg-white/80 flex items-center justify-center mb-1">
              {placedItems[0] ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={placedItems[0].fontSizeClass}
                >
                  {activeRound.emoji}
                </motion.span>
              ) : (
                <span className="text-lg opacity-35">🌱</span>
              )}
            </div>
            <div className="w-16 h-5 sm:w-18 sm:h-6 rounded-t-lg bg-teal-300/80 border-t-2 border-teal-400 shadow-xs" />
          </div>

          {/* Slot 1: Médio */}
          <div className="flex flex-col items-center">
            <div className="w-18 h-18 sm:w-21 sm:h-21 rounded-2xl border-3 border-dashed border-teal-400 bg-white/80 flex items-center justify-center mb-1">
              {placedItems[1] ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={placedItems[1].fontSizeClass}
                >
                  {activeRound.emoji}
                </motion.span>
              ) : (
                <span className="text-xl opacity-35">🌿</span>
              )}
            </div>
            <div className="w-18 h-8 sm:w-21 sm:h-10 rounded-t-lg bg-teal-400/80 border-t-2 border-teal-500 shadow-xs" />
          </div>

          {/* Slot 2: Grande */}
          <div className="flex flex-col items-center">
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl border-3 border-dashed border-teal-400 bg-white/80 flex items-center justify-center mb-1">
              {placedItems[2] ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={placedItems[2].fontSizeClass}
                >
                  {activeRound.emoji}
                </motion.span>
              ) : (
                <span className="text-2xl opacity-35">🌳</span>
              )}
            </div>
            <div className="w-22 h-11 sm:w-24 sm:h-13 rounded-t-lg bg-teal-500/80 border-t-2 border-teal-600 shadow-xs" />
          </div>
        </div>

        {/* Center: Mascot Hint Bridge */}
        <div className="flex items-center justify-center pointer-events-none select-none">
          <motion.div
            animate={{
              y: [-4, 0, -4],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🐰</span>
            <span className="text-xl sm:text-2xl">✨</span>
          </motion.div>
        </div>

        {/* Right Side: Shuffled Choices */}
        <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4">
          {shuffledChoices.map((item) => {
            const isWrong = wrongItemId === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleChoiceClick(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : {}}
                className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-3xl bg-white border-4 border-teal-300 hover:border-teal-400 flex items-center justify-center shadow-md active:scale-95 cursor-pointer touch-none"
                aria-label={`Item tamanho ${item.sizeKey}`}
              >
                <span className={item.fontSizeClass}>{activeRound.emoji}</span>
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
