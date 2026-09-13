import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { HABITAT_ROUNDS, AnimalHabitItem } from './habitatTypes';

interface AnimalHabitatsGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const AnimalHabitatsGame: React.FC<AnimalHabitatsGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [wrongHabitatId, setWrongHabitatId] = useState<string | null>(null);

  const activeRound = HABITAT_ROUNDS[currentRoundIdx];

  // Shuffled habitats order for the round
  const [shuffledHabitats, setShuffledHabitats] = useState<AnimalHabitItem[]>([]);

  useEffect(() => {
    const round = HABITAT_ROUNDS[currentRoundIdx];
    setShuffledHabitats([...round.items].sort(() => Math.random() - 0.5));
    setSelectedAnimalId(null);
    setResolvedIds([]);
    setWrongHabitatId(null);
  }, [currentRoundIdx]);

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setSelectedAnimalId(null);
    setResolvedIds([]);
    setWrongHabitatId(null);
  };

  const handleAnimalSelect = (item: AnimalHabitItem) => {
    if (resolvedIds.includes(item.id)) return;
    soundManager.playPop(520);
    setSelectedAnimalId(item.id);
  };

  const handleHabitatSelect = (habitatItem: AnimalHabitItem) => {
    if (resolvedIds.includes(habitatItem.id)) return;
    if (!selectedAnimalId) {
      soundManager.playPop(420);
      return;
    }

    if (selectedAnimalId === habitatItem.id) {
      // Correct habitat!
      soundManager.playSuccessChime();
      const nextResolved = [...resolvedIds, habitatItem.id];
      setResolvedIds(nextResolved);
      setSelectedAnimalId(null);

      // Check if round complete
      if (nextResolved.length === activeRound.items.length) {
        const nextCompleted = completedRounds + 1;
        setCompletedRounds(nextCompleted);

        setTimeout(() => {
          soundManager.playGiggle();
        }, 300);

        setTimeout(() => {
          if (nextCompleted >= HABITAT_ROUNDS.length) {
            setIsCompleted(true);
            onCompleteActivity?.(3);
          } else {
            setCurrentRoundIdx((prev) => prev + 1);
          }
        }, 1200);
      }
    } else {
      // Mismatch
      setWrongHabitatId(habitatItem.id);
      soundManager.playSoftBoing();
      setTimeout(() => setWrongHabitatId(null), 600);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE] to-[#F0FDF4]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={HABITAT_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Main Habitats Arena: Side-by-side in Landscape (Left: Habitats/Homes, Center: Mascot, Right: Animals) */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
        {/* Left Side: Habitats/Homes Column */}
        <div className="flex flex-col gap-2.5 sm:gap-3 items-center">
          {shuffledHabitats.map((item) => {
            const isResolved = resolvedIds.includes(item.id);
            const isWrong = wrongHabitatId === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleHabitatSelect(item)}
                whileHover={{ scale: isResolved ? 1 : 1.05 }}
                whileTap={{ scale: isResolved ? 1 : 0.94 }}
                animate={
                  isWrong
                    ? { x: [-8, 8, -6, 6, 0] }
                    : isResolved
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                className={`relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-3xl flex flex-col items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md touch-none ${
                  isResolved
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : `${item.habitatBg} ${item.borderColor} hover:border-sky-400`
                }`}
                aria-label={`Casinha ${item.id}`}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                  {isResolved ? item.animalEmoji : item.habitatEmoji}
                </span>

                {isResolved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Mascot Center Bridge */}
        <div className="flex flex-col items-center gap-1 pointer-events-none select-none">
          <motion.div
            animate={{
              y: [-4, 0, -4],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🐰</span>
            <span className="text-xl sm:text-2xl">🏡</span>
          </motion.div>
          <div className="flex items-center gap-1 text-sky-400 opacity-70">
            <span className="text-sm">✨</span>
            <span className="text-xs">🐾</span>
            <span className="text-sm">✨</span>
          </div>
        </div>

        {/* Right Side: Animals Column */}
        <div className="flex flex-col gap-2.5 sm:gap-3 items-center">
          {activeRound.items.map((item) => {
            const isResolved = resolvedIds.includes(item.id);
            const isSelected = selectedAnimalId === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleAnimalSelect(item)}
                whileHover={{ scale: isResolved ? 1 : 1.1 }}
                whileTap={{ scale: isResolved ? 1 : 0.92 }}
                animate={
                  isSelected
                    ? { y: -4, scale: 1.12 }
                    : isResolved
                    ? { opacity: 0.35, scale: 0.88 }
                    : { y: 0, scale: 1 }
                }
                className={`relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-3xl flex flex-col items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md touch-none ${
                  isResolved
                    ? 'bg-stone-100 border-stone-200 cursor-default'
                    : isSelected
                    ? 'bg-amber-100 border-amber-400 shadow-xl ring-4 ring-amber-300'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
                aria-label={item.animalName}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                  {item.animalEmoji}
                </span>
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
