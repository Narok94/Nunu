import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { MEMORY_ROUNDS, MemoryCard } from './memoryTypes';

interface MemoryGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const activeRound = MEMORY_ROUNDS[currentRoundIdx];

  const setupCards = (roundIdx: number) => {
    const round = MEMORY_ROUNDS[roundIdx];
    const deck: MemoryCard[] = [];
    round.pairs.forEach((p, idx) => {
      deck.push({ id: `${p.pairKey}-1`, pairKey: p.pairKey, emoji: p.emoji, label: p.label });
      deck.push({ id: `${p.pairKey}-2`, pairKey: p.pairKey, emoji: p.emoji, label: p.label });
    });

    // Shuffle deck
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCardIds([]);
    setMatchedKeys([]);
    setIsChecking(false);
  };

  useEffect(() => {
    setupCards(currentRoundIdx);
  }, [currentRoundIdx]);

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setupCards(0);
  };

  const handleCardClick = (card: MemoryCard) => {
    if (isChecking) return;
    if (flippedCardIds.includes(card.id)) return;
    if (matchedKeys.includes(card.pairKey)) return;

    soundManager.playCardFlip();
    const newFlipped = [...flippedCardIds, card.id];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const first = cards.find((c) => c.id === newFlipped[0])!;
      const second = card;

      if (first.pairKey === second.pairKey) {
        // Matched!
        soundManager.playSuccessChime();
        const nextMatched = [...matchedKeys, first.pairKey];
        setMatchedKeys(nextMatched);
        setFlippedCardIds([]);
        setIsChecking(false);

        // Check round completion
        if (nextMatched.length === activeRound.pairs.length) {
          const nextCompleted = completedRounds + 1;
          setCompletedRounds(nextCompleted);

          setTimeout(() => {
            soundManager.playGiggle();
          }, 300);

          setTimeout(() => {
            if (nextCompleted >= MEMORY_ROUNDS.length) {
              setIsCompleted(true);
              onCompleteActivity?.(3);
            } else {
              setCurrentRoundIdx((prev) => prev + 1);
            }
          }, 1200);
        }
      } else {
        // Not a match - flip back gently after pause
        setTimeout(() => {
          soundManager.playPop(340);
          setFlippedCardIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#FEFCE8] via-[#FFFBEB] to-[#FEF3C7]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-orange-200/25 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={MEMORY_ROUNDS.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Center Cards Grid: Landscape friendly, pure visual cues */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col items-center justify-center">
        {/* Visual Cue Pill: Non-verbal icon */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 border border-amber-200 shadow-xs mb-2 sm:mb-3">
          <span className="text-lg">🐰</span>
          <span className="text-xs text-amber-500 font-bold">⭐</span>
          <span className="text-lg">🃏</span>
        </div>

        {/* Dynamic Responsive Landscape Row/Grid */}
        <div
          className={`grid gap-2.5 sm:gap-4 justify-center items-center ${
            cards.length === 4
              ? 'grid-cols-4 max-w-xl'
              : 'grid-cols-3 sm:grid-cols-6 max-w-3xl'
          }`}
        >
          {cards.map((card) => {
            const isFlipped = flippedCardIds.includes(card.id);
            const isMatched = matchedKeys.includes(card.pairKey);
            const isRevealed = isFlipped || isMatched;

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card)}
                whileHover={{ scale: isRevealed ? 1 : 1.05 }}
                whileTap={{ scale: isRevealed ? 1 : 0.94 }}
                animate={
                  isMatched
                    ? { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className={`relative w-20 h-24 sm:w-22 sm:h-28 md:w-24 md:h-30 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center border-4 cursor-pointer select-none transition-all shadow-md touch-none ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : isRevealed
                    ? 'bg-white border-amber-400 shadow-lg'
                    : 'bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-200 border-amber-400 hover:border-amber-500 active:scale-95'
                }`}
                aria-label={isRevealed ? card.label : 'Carta virada'}
              >
                {isRevealed ? (
                  <>
                    <span className="text-4xl sm:text-5xl filter drop-shadow-xs">
                      {card.emoji}
                    </span>
                    {isMatched && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-85">
                    <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                      🐰
                    </span>
                    <span className="text-xs font-bold text-amber-900/60 mt-0.5">
                      ⭐
                    </span>
                  </div>
                )}
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
