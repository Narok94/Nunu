import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Volume2, VolumeX, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { ShapeItemData, ShapeType } from './shapeTypes';
import { generateShapeRounds, TOTAL_SHAPE_ROUNDS } from './shapeGameData';
import { ShapePieceCard, CavityTarget } from './ShapePieceCard';
import { ShapeTargetCavity } from './ShapeTargetCavity';

interface ShapeSorterGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (starsEarned: number) => void;
  onOpenParentsGate?: () => void;
}

export const ShapeSorterGame: React.FC<ShapeSorterGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [roundsData, setRoundsData] = useState(() => generateShapeRounds());
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  // Map of cavityId -> fitted ShapeItemData
  const [fittedMap, setFittedMap] = useState<Record<string, ShapeItemData>>({});
  const fittedMapRef = useRef<Record<string, ShapeItemData>>({});

  // Set of fitted piece IDs for deterministic round completion
  const fittedPieceIdsRef = useRef<Set<string>>(new Set());
  const currentRoundRef = useRef<number>(0);
  const completedRoundsRef = useRef<number>(0);
  const roundsDataRef = useRef(roundsData);
  const isTransitioningRef = useRef<boolean>(false);

  // Interaction feedback states
  const [selectedPiece, setSelectedPiece] = useState<ShapeItemData | null>(null);
  const [hoveredShape, setHoveredShape] = useState<ShapeType | null>(null);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [isRoundTransition, setIsRoundTransition] = useState<boolean>(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [showContinueButton, setShowContinueButton] = useState<boolean>(false);

  // Mascot excitement state
  const [isNunuHappy, setIsNunuHappy] = useState<boolean>(false);

  // Sound settings state
  const [sfxEnabled, setSfxEnabled] = useState(() => soundManager.getSettings().soundEffects);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSoundEffects(next);
    if (next) soundManager.playPop(600);
  };

  // Start fresh 3-round session
  const startSession = () => {
    const rounds = generateShapeRounds();
    roundsDataRef.current = rounds;
    setRoundsData(rounds);
    currentRoundRef.current = 0;
    setCurrentRound(0);
    completedRoundsRef.current = 0;
    setCompletedRounds(0);

    fittedMapRef.current = {};
    setFittedMap({});
    fittedPieceIdsRef.current = new Set();
    isTransitioningRef.current = false;

    setSelectedPiece(null);
    setHoveredShape(null);
    setDraggingPieceId(null);
    setIsLevelCompleted(false);
    setShowContinueButton(false);
    setIsRoundTransition(false);
    setIsNunuHappy(false);
  };

  useEffect(() => {
    startSession();
  }, []);

  // Pre-calculate target cavity bounding boxes once per gesture
  const getCavityTargets = useCallback((): CavityTarget[] => {
    const roundInfo = roundsDataRef.current[currentRoundRef.current];
    if (!roundInfo) return [];

    const targets: CavityTarget[] = [];
    for (const cavity of roundInfo.cavities) {
      // Don't target already filled cavities
      if (fittedMapRef.current[cavity.id]) continue;

      const element = document.getElementById(`cavity-target-${cavity.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        targets.push({
          id: cavity.id,
          shape: cavity.shape,
          rect,
          center: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          },
        });
      }
    }
    return targets;
  }, []);

  // Handle successful shape fitting
  const handleDropCorrect = (piece: ShapeItemData, cavityId: string) => {
    if (isTransitioningRef.current) return;
    if (fittedPieceIdsRef.current.has(piece.id)) return;

    fittedPieceIdsRef.current.add(piece.id);
    const updatedMap = { ...fittedMapRef.current, [cavityId]: piece };
    fittedMapRef.current = updatedMap;
    setFittedMap(updatedMap);

    setSelectedPiece(null);
    setHoveredShape(null);

    // Audio & tactile feedback
    soundManager.playSnap();
    setTimeout(() => soundManager.playSuccessChime(), 120);

    // Mascot joyful reaction
    setIsNunuHappy(true);
    setTimeout(() => setIsNunuHappy(false), 800);

    // Check if all pieces of this round are fitted
    const currentRoundIdx = currentRoundRef.current;
    const currentRoundPieces = roundsDataRef.current[currentRoundIdx]?.pieces || [];
    const totalInRound = currentRoundPieces.length;
    const isRoundDone = totalInRound > 0 && fittedPieceIdsRef.current.size >= totalInRound;

    if (isRoundDone) {
      isTransitioningRef.current = true;
      completedRoundsRef.current += 1;
      const nextCompleted = completedRoundsRef.current;
      setCompletedRounds(nextCompleted);

      if (nextCompleted < TOTAL_SHAPE_ROUNDS) {
        // Intermediate round transition
        setIsRoundTransition(true);
        setTimeout(() => {
          soundManager.playGiggle();
        }, 180);

        setTimeout(() => {
          currentRoundRef.current += 1;
          setCurrentRound(currentRoundRef.current);
          fittedMapRef.current = {};
          setFittedMap({});
          fittedPieceIdsRef.current = new Set();
          setIsRoundTransition(false);
          isTransitioningRef.current = false;
          soundManager.playPop(540);
        }, 800);
      } else {
        // Final celebration after Round 3!
        setTimeout(() => {
          setIsLevelCompleted(true);
          soundManager.playFanfare();
          try {
            confetti({
              particleCount: 65,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
            });
          } catch {}
          onCompleteActivity?.(3);
        }, 350);

        setTimeout(() => {
          setShowContinueButton(true);
        }, 1500);
      }
    }
  };

  // Handle wrong attempt (no penalty, no harsh sound, no red X)
  const handleDropWrong = () => {
    soundManager.playSoftBoing();
  };

  // Tap-to-place fallback for young toddlers
  const handlePieceSelect = (piece: ShapeItemData) => {
    setSelectedPiece(selectedPiece?.id === piece.id ? null : piece);
  };

  const handleCavityTap = (cavityId: string, cavityShape: ShapeType) => {
    if (!selectedPiece) {
      soundManager.playPop(480);
      return;
    }

    if (selectedPiece.shape === cavityShape) {
      handleDropCorrect(selectedPiece, cavityId);
    } else {
      handleDropWrong();
    }
  };

  const activeRoundData = roundsData[currentRound] || roundsData[0];
  const activeCavities = activeRoundData?.cavities || [];
  const activePieces = activeRoundData?.pieces || [];

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#ECFDF5]">
      {/* Garden Scenery Background: Sunlight, Soft Clouds & Flying Butterfly */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-emerald-150/25 blur-3xl" />

        {/* Drifting Clouds */}
        <motion.div
          animate={{ x: [-15, 20, -15] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-14 left-10 text-3xl opacity-60"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-20 right-16 text-4xl opacity-50"
        >
          ☁️
        </motion.div>

        {/* Fluttering Butterfly */}
        <motion.div
          animate={{
            x: [0, 25, 10, 0],
            y: [0, -20, -8, 0],
            rotate: [0, 10, -6, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-1/4 text-2xl sm:text-3xl opacity-80"
        >
          🦋
        </motion.div>

        {/* Grassy Rolling Hill Background */}
        <div className="absolute bottom-0 inset-x-0 h-64 sm:h-72 bg-gradient-to-t from-emerald-200/70 via-emerald-100/50 to-transparent pointer-events-none rounded-t-[50%] scale-110" />
      </div>

      {/* Header Bar: Back, 3-Star Indicator, Sound & Restart with safe areas */}
      <header className="relative z-30 w-full max-w-5xl mx-auto safe-px safe-pt pb-1 flex items-center justify-between">
        {/* Left: Back to Trail */}
        <button
          id="shape-game-back-button"
          onClick={() => {
            soundManager.playPop(480);
            onBackToHome();
          }}
          aria-label="Voltar para a trilha"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center border border-stone-200/70 shadow-xs transition-all active:scale-95 cursor-pointer touch-none"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Center: 3 Stars Progress Pill */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-amber-200/80 shadow-xs"
          aria-label={`Progresso: ${completedRounds} de ${TOTAL_SHAPE_ROUNDS} rodadas`}
        >
          {Array.from({ length: TOTAL_SHAPE_ROUNDS }).map((_, i) => {
            const isEarned = i < completedRounds;
            return (
              <motion.span
                key={i}
                initial={false}
                animate={{
                  scale: isEarned ? [1, 1.35, 1] : 1,
                  rotate: i === completedRounds - 1 ? [0, -12, 12, 0] : 0,
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`text-xl sm:text-2xl select-none transition-all duration-300 ${
                  isEarned ? 'opacity-100 filter drop-shadow-sm' : 'opacity-25 grayscale'
                }`}
              >
                ⭐
              </motion.span>
            );
          })}
        </div>

        {/* Right: Restart, Sound, Parents Gate */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="shape-game-restart-button"
            onClick={() => {
              soundManager.playPop(480);
              startSession();
            }}
            aria-label="Reiniciar atividade"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            id="shape-game-sound-toggle"
            onClick={toggleSfx}
            aria-label={sfxEnabled ? 'Desativar som' : 'Ativar som'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 stroke-[2.2]" /> : <VolumeX className="w-4 h-4 stroke-[2.2]" />}
          </button>

          {onOpenParentsGate && (
            <button
              id="shape-game-parents-gate"
              onClick={() => {
                soundManager.playPop(500);
                onOpenParentsGate();
              }}
              aria-label="Área dos Pais"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-stone-500 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Play Area: Landscape Dual-Panel (Left: Wooden Board with Cavities, Center: Nunu, Right: Toy Tray with Shapes) */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-3 sm:gap-6">
        {/* Upper / Left Board: The Montessori Wooden Puzzle Board with Carved Cavities */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative px-4 py-3 sm:px-6 sm:py-4 rounded-[2rem] bg-[#EFE4CE] border-4 border-[#D4C3A3] shadow-lg flex items-center justify-center"
          >
            {/* Soft wooden board inner bevel */}
            <div className="absolute inset-1.5 rounded-[1.7rem] border-2 border-[#FAF5EA] pointer-events-none opacity-60" />

            {/* Cavity Slots Row */}
            <div className="relative z-10 flex flex-nowrap items-center justify-center gap-2 sm:gap-4 md:gap-5">
              {activeCavities.map((cavity) => {
                const fitted = fittedMap[cavity.id] || null;
                const isHovered = hoveredShape === cavity.shape && !fitted;

                return (
                  <ShapeTargetCavity
                    key={cavity.id}
                    cavity={cavity}
                    fittedPiece={fitted}
                    isHovered={isHovered}
                    onTapCavity={() => handleCavityTap(cavity.id, cavity.shape)}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Mascot Nunu: Peeking out happily and celebrating with the child */}
        <div className="flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: isNunuHappy ? [1, 1.2, 1.05, 1] : [1, 1.04, 1],
              rotate: isNunuHappy ? [0, -8, 8, 0] : [0, 1.5, -1.5, 0],
              y: isNunuHappy ? [-4, -10, 0] : 0,
            }}
            transition={{
              duration: isNunuHappy ? 0.55 : 3.5,
              repeat: isNunuHappy ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-md">🐰</span>
            <span className="text-xl sm:text-2xl opacity-85">✨</span>
          </motion.div>
        </div>

        {/* Lower / Right Shelf: The Wooden Toy Tray Holding the Loose Shape Blocks */}
        <div className="flex flex-col items-center">
          <div className="relative px-3 py-2.5 sm:px-5 sm:py-3 rounded-3xl bg-white/80 backdrop-blur-xs border-2 border-emerald-200/80 shadow-xs flex items-center justify-center">
            {/* Stable Slots Row */}
            <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <AnimatePresence mode="wait">
                {!isRoundTransition && (
                  <motion.div
                    key={`round-pieces-${currentRound}`}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -10 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4"
                  >
                    {activePieces.map((piece) => {
                      const isFitted = fittedPieceIdsRef.current.has(piece.id);

                      return (
                        <div
                          key={piece.id}
                          className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0"
                        >
                          {/* If fitted, keep the stable empty indentation in the shelf */}
                          {isFitted ? (
                            <div className="w-full h-full rounded-2xl bg-stone-100/60 border-2 border-dashed border-stone-200/60 flex items-center justify-center">
                              <span className="text-stone-300 text-lg">✓</span>
                            </div>
                          ) : (
                            <ShapePieceCard
                              piece={piece}
                              isSelected={selectedPiece?.id === piece.id}
                              onSelect={handlePieceSelect}
                              getCavityTargets={getCavityTargets}
                              onHoverTarget={(shape) => setHoveredShape(shape)}
                              onDropCorrect={handleDropCorrect}
                              onDropWrong={handleDropWrong}
                              onDragStateChange={(id) => setDraggingPieceId(id)}
                              isLocked={isRoundTransition || isLevelCompleted}
                            />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Round Transition Flash (Stars celebration) */}
      <AnimatePresence>
        {isRoundTransition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none bg-white/20 backdrop-blur-[2px]"
          >
            <div className="flex items-center gap-3 text-5xl sm:text-6xl filter drop-shadow-lg animate-bounce">
              <span>✨</span>
              <span>⭐</span>
              <span>✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Celebration Overlay after finishing Round 3 */}
      <AnimatePresence>
        {isLevelCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-amber-50/80 backdrop-blur-sm"
          >
            {/* Joyful Mascot & Stars Celebration */}
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: [0.9, 1.1, 1], y: [0, -10, 0] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Happy Nunu Mascot */}
              <div className="text-7xl sm:text-8xl mb-3 filter drop-shadow-lg animate-bounce">🐰</div>

              {/* 3 Full Golden Stars */}
              <div className="flex items-center gap-3 mb-6">
                {[0, 1, 2].map((starIdx) => (
                  <motion.span
                    key={starIdx}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring', stiffness: 400 }}
                    className="text-5xl sm:text-6xl filter drop-shadow-md"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              {/* Big, friendly Continue Arrow Button returning to Trail */}
              {showContinueButton && (
                <motion.button
                  id="shape-game-continue-button"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    soundManager.playPop(620);
                    onBackToHome();
                  }}
                  aria-label="Voltar para a trilha"
                  className="mt-2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-xl hover:shadow-2xl flex items-center justify-center border-4 border-white cursor-pointer active:scale-95 transition-transform"
                >
                  <ArrowRight className="w-10 h-10 sm:w-12 sm:h-12 stroke-[3]" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
