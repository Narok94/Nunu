import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { MATCHING_ROUNDS, MatchingPair } from './matchingTypes';

interface MatchingGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

interface ShuffledItem {
  key: string;
  pairId: string;
  emoji: string;
  color: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [leftCol, setLeftCol] = useState<ShuffledItem[]>([]);
  const [rightCol, setRightCol] = useState<ShuffledItem[]>([]);
  const [selectedLeftKey, setSelectedLeftKey] = useState<string | null>(null);
  const [selectedRightKey, setSelectedRightKey] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);

  const activeRound = MATCHING_ROUNDS[currentRoundIdx];

  const setupRound = (roundIdx: number) => {
    const round = MATCHING_ROUNDS[roundIdx];
    const left: ShuffledItem[] = round.pairs.map((p) => ({
      key: `left-${p.id}`,
      pairId: p.id,
      emoji: p.emoji,
      color: p.color,
    }));

    // Shuffle right column independently
    const right: ShuffledItem[] = [...round.pairs]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({
        key: `right-${p.id}`,
        pairId: p.id,
        emoji: p.emoji,
        color: p.color,
      }));

    setLeftCol(left);
    setRightCol(right);
    setSelectedLeftKey(null);
    setSelectedRightKey(null);
    setMatchedPairIds([]);
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

  const handleLeftTap = (item: ShuffledItem) => {
    if (matchedPairIds.includes(item.pairId)) return;
    soundManager.playPop(520);
    setSelectedLeftKey(item.key);

    // If right item is already selected, check match
    if (selectedRightKey) {
      const rightItem = rightCol.find((r) => r.key === selectedRightKey);
      if (rightItem) {
        checkMatch(item, rightItem);
      }
    }
  };

  const handleRightTap = (item: ShuffledItem) => {
    if (matchedPairIds.includes(item.pairId)) return;
    soundManager.playPop(520);
    setSelectedRightKey(item.key);

    // If left item is already selected, check match
    if (selectedLeftKey) {
      const leftItem = leftCol.find((l) => l.key === selectedLeftKey);
      if (leftItem) {
        checkMatch(leftItem, item);
      }
    }
  };

  const checkMatch = (left: ShuffledItem, right: ShuffledItem) => {
    if (left.pairId === right.pairId) {
      // Match found!
      soundManager.playSuccessChime();
      const nextMatched = [...matchedPairIds, left.pairId];
      setMatchedPairIds(nextMatched);
      setSelectedLeftKey(null);
      setSelectedRightKey(null);

      // Check if round is complete
      if (nextMatched.length === activeRound.pairs.length) {
        const nextCompleted = completedRounds + 1;
        setCompletedRounds(nextCompleted);

        setTimeout(() => {
          soundManager.playGiggle();
        }, 300);

        setTimeout(() => {
          if (nextCompleted >= MATCHING_ROUNDS.length) {
            setIsCompleted(true);
            onCompleteActivity?.(3);
          } else {
            setCurrentRoundIdx((prev) => prev + 1);
          }
        }, 1200);
      }
    } else {
      // Mismatch
      soundManager.playSoftBoing();
      setTimeout(() => {
        setSelectedLeftKey(null);
        setSelectedRightKey(null);
      }, 500);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F5F3FF] via-[#EDE9FE] to-[#FDF4FF]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-purple-200/35 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={MATCHING_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Main Matching Stage: Pure visual cues, no text */}
      <main className="relative z-10 flex-1 w-full max-w-xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col items-center justify-center">
        {/* Visual Cue Pill: Non-verbal pairs icon */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-purple-200 shadow-xs mb-2">
          <span className="text-lg">🐰</span>
          <span className="text-xs text-purple-400 font-bold">✨</span>
          <span className="text-lg">🌸</span>
        </div>

        {/* 2 Parallel Matching Columns with Central Floral Bridge */}
        <div className="w-full flex items-center justify-center gap-8 sm:gap-14 max-w-md my-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5 items-center">
            {leftCol.map((item) => {
              const isMatched = matchedPairIds.includes(item.pairId);
              const isSelected = selectedLeftKey === item.key;

              return (
                <motion.button
                  key={item.key}
                  onClick={() => handleLeftTap(item)}
                  whileHover={{ scale: isMatched ? 1 : 1.06 }}
                  whileTap={{ scale: isMatched ? 1 : 0.92 }}
                  animate={
                    isMatched
                      ? { scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }
                      : isSelected
                      ? { scale: 1.1, ring: '4px #8B5CF6' }
                      : {}
                  }
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md touch-none ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 opacity-90'
                      : isSelected
                      ? 'bg-purple-100 border-purple-500 shadow-lg ring-4 ring-purple-300'
                      : 'bg-white border-purple-200 hover:border-purple-300'
                  }`}
                  aria-label={item.pairId}
                >
                  <span className="text-3xl sm:text-4xl select-none filter drop-shadow-xs">
                    {item.emoji}
                  </span>
                  {isMatched && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Central Friendly Divider Sparkle */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-purple-300 pointer-events-none select-none">
            <span className="text-xl sm:text-2xl">🌱</span>
            <span className="text-2xl sm:text-3xl">🌸</span>
            <span className="text-xl sm:text-2xl">🌿</span>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5 items-center">
            {rightCol.map((item) => {
              const isMatched = matchedPairIds.includes(item.pairId);
              const isSelected = selectedRightKey === item.key;

              return (
                <motion.button
                  key={item.key}
                  onClick={() => handleRightTap(item)}
                  whileHover={{ scale: isMatched ? 1 : 1.06 }}
                  whileTap={{ scale: isMatched ? 1 : 0.92 }}
                  animate={
                    isMatched
                      ? { scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }
                      : isSelected
                      ? { scale: 1.1, ring: '4px #8B5CF6' }
                      : {}
                  }
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md touch-none ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 opacity-90'
                      : isSelected
                      ? 'bg-purple-100 border-purple-500 shadow-lg ring-4 ring-purple-300'
                      : 'bg-white border-purple-200 hover:border-purple-300'
                  }`}
                  aria-label={item.pairId}
                >
                  <span className="text-3xl sm:text-4xl select-none filter drop-shadow-xs">
                    {item.emoji}
                  </span>
                  {isMatched && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
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
