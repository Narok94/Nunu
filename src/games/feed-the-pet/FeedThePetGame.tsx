import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, RefreshCw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ColorId, FoodItemData, ColorData } from '../../types';
import { COLORS_CONFIG, ALL_FOODS } from '../../data/colorsGameData';
import { Creature } from './Creature';
import { FoodItemCard, CreatureTarget } from './FoodItemCard';
import { soundManager } from '../../audio/soundManager';

interface FeedThePetGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (starsEarned: number) => void;
  onOpenParentsGate?: () => void;
}

const TOTAL_ROUNDS = 3;
const SESSION_COLOR_IDS: ColorId[] = ['red', 'yellow', 'blue'];
const FOODS_PER_COLOR_PER_ROUND = 2; // 2 * 3 = 6 foods per round

// Generate 3 unique rounds of foods ensuring variety and alternating options
const generateThreeRounds = (colorIds: ColorId[]): FoodItemData[][] => {
  const foodsByColor: Record<string, FoodItemData[]> = {};

  colorIds.forEach((cId) => {
    const matching = ALL_FOODS.filter((f) => f.colorId === cId);
    // Shuffle pool for initial variety across sessions
    foodsByColor[cId] = [...matching].sort(() => 0.5 - Math.random());
  });

  const rounds: FoodItemData[][] = [];

  for (let r = 0; r < TOTAL_ROUNDS; r++) {
    const roundFoods: FoodItemData[] = [];

    colorIds.forEach((cId) => {
      const pool = foodsByColor[cId] || [];
      if (pool.length === 0) return;

      // Pick FOODS_PER_COLOR_PER_ROUND items per color with rotating index offset
      for (let i = 0; i < FOODS_PER_COLOR_PER_ROUND; i++) {
        const itemIndex = (r * FOODS_PER_COLOR_PER_ROUND + i) % pool.length;
        const baseFood = pool[itemIndex];
        roundFoods.push({
          ...baseFood,
          id: `${baseFood.id}-r${r}-${i}`,
        });
      }
    });

    // Shuffle display order on the grass so colors are nicely interspersed
    rounds.push([...roundFoods].sort(() => 0.5 - Math.random()));
  }

  return rounds;
};

export const FeedThePetGame: React.FC<FeedThePetGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [roundsData, setRoundsData] = useState<FoodItemData[][]>(() => generateThreeRounds(SESSION_COLOR_IDS));
  const [activeColors, setActiveColors] = useState<ColorData[]>(() => SESSION_COLOR_IDS.map((cId) => COLORS_CONFIG[cId]));
  
  // Track consumed food IDs for the current round:
  // - Fixed list of 6 foods in roundsData[currentRound]
  // - When a food is eaten, its ID is added to consumedFoodIds
  // - Its slot remains reserved (stable, no layout shift)
  // - Round ONLY finishes when consumedFoodIds count reaches the round's total (6 of 6)
  const [consumedFoodIds, setConsumedFoodIds] = useState<string[]>([]);
  const consumedFoodIdsRef = useRef<Set<string>>(new Set());
  const currentRoundRef = useRef<number>(0);
  const completedRoundsRef = useRef<number>(0);
  const roundsDataRef = useRef<FoodItemData[][]>(roundsData);
  const isTransitioningRef = useRef<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<FoodItemData | null>(null);

  // Interaction feedback states (100% visual + sound, zero text)
  const [happyCreatureId, setHappyCreatureId] = useState<ColorId | null>(null);
  const [wigglingCreatureId, setWigglingCreatureId] = useState<ColorId | null>(null);
  const [hoveredCreatureId, setHoveredCreatureId] = useState<ColorId | null>(null);
  const [draggingFoodId, setDraggingFoodId] = useState<string | null>(null);
  const [isRoundTransition, setIsRoundTransition] = useState<boolean>(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);
  const [showContinueButton, setShowContinueButton] = useState<boolean>(false);

  // Sound settings state
  const [sfxEnabled, setSfxEnabled] = useState(() => soundManager.getSettings().soundEffects);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSoundEffects(next);
    if (next) soundManager.playPop(600);
  };

  // References for drop collision detection
  const creatureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Start fresh 3-round session
  const startSession = () => {
    const colors = SESSION_COLOR_IDS.map((cId) => COLORS_CONFIG[cId]);
    setActiveColors(colors);

    const rounds = generateThreeRounds(SESSION_COLOR_IDS);
    roundsDataRef.current = rounds;
    setRoundsData(rounds);
    currentRoundRef.current = 0;
    setCurrentRound(0);
    completedRoundsRef.current = 0;
    setCompletedRounds(0);
    consumedFoodIdsRef.current = new Set();
    setConsumedFoodIds([]);
    isTransitioningRef.current = false;

    setSelectedFood(null);
    setIsLevelCompleted(false);
    setShowContinueButton(false);
    setIsRoundTransition(false);
    setHappyCreatureId(null);
    setWigglingCreatureId(null);
    setHoveredCreatureId(null);
    setDraggingFoodId(null);
  };

  useEffect(() => {
    startSession();
  }, []);

  // Pre-calculate creature targets once per gesture to eliminate layout thrashing
  const getCreatureTargets = useCallback((): CreatureTarget[] => {
    const targets: CreatureTarget[] = [];
    for (const color of activeColors) {
      const element = document.getElementById(`creature-target-${color.id}`);
      if (element) {
        targets.push({ id: color.id, rect: element.getBoundingClientRect() });
      }
    }
    return targets;
  }, [activeColors]);

  // Get creature's mouth coordinates in viewport space for natural eating animation
  const getCreatureMouthPosition = (colorId: ColorId): { x: number; y: number } | null => {
    const element = document.getElementById(`creature-target-${colorId}`);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.62,
    };
  };

  // Handle successful feeding (Sound + animation feedback only, NO TEXT, NO VOICE)
  const handleCorrectFeed = (food: FoodItemData, creatureColor: ColorData) => {
    // Prevent actions while transitioning between rounds
    if (isTransitioningRef.current) {
      return;
    }

    // Guard against duplicate feeding of the exact same food item
    if (consumedFoodIdsRef.current.has(food.id)) {
      return;
    }
    consumedFoodIdsRef.current.add(food.id);
    const newConsumedList = Array.from(consumedFoodIdsRef.current);
    setConsumedFoodIds(newConsumedList);

    setHappyCreatureId(creatureColor.id);
    setSelectedFood(null);

    // Musical/sound feedback: eating yum + happy chime
    soundManager.playYum();
    setTimeout(() => soundManager.playSuccessChime(), 140);

    // Clear happy state after short gentle reaction (400ms)
    setTimeout(() => {
      setHappyCreatureId(null);
    }, 400);

    // Check if ALL foods of the current round are consumed (e.g. exactly 6/6)
    const currentRoundIdx = currentRoundRef.current;
    const currentRoundFoods = roundsDataRef.current[currentRoundIdx] || [];
    const totalInRound = currentRoundFoods.length;
    const isRoundDone = totalInRound > 0 && consumedFoodIdsRef.current.size >= totalInRound;

    if (isRoundDone) {
      isTransitioningRef.current = true;
      completedRoundsRef.current += 1;
      const nextCompleted = completedRoundsRef.current;
      setCompletedRounds(nextCompleted);

      if (nextCompleted < TOTAL_ROUNDS) {
        // Intermediate round transition:
        // 1. Keep creatures in place
        // 2. Small celebration
        // 3. Clear old foods
        // 4. Staggered gentle entry of new round's foods
        setIsRoundTransition(true);
        setTimeout(() => {
          soundManager.playGiggle();
        }, 180);

        setTimeout(() => {
          currentRoundRef.current += 1;
          setCurrentRound(currentRoundRef.current);
          consumedFoodIdsRef.current = new Set();
          setConsumedFoodIds([]);
          setIsRoundTransition(false);
          isTransitioningRef.current = false;
          // Soft sound when new foods appear: "vieram mais comidinhas!"
          soundManager.playPop(540);
        }, 750);
      } else {
        // Round 3 finished -> CELEBRAÇÃO FINAL
        setTimeout(() => {
          setIsLevelCompleted(true);
          soundManager.playFanfare();
          try {
            confetti({
              particleCount: 65,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
            });
          } catch {}
          onCompleteActivity?.(3);
        }, 350);

        // After ~1.5s, show the large visual continue button
        setTimeout(() => {
          setShowContinueButton(true);
        }, 1500);
      }
    }
  };

  // Handle gentle mismatch (NO negative feedback, NO error marks, curious creature tilt)
  const handleMismatch = (creatureColorId: ColorId) => {
    setWigglingCreatureId(creatureColorId);
    soundManager.playSoftBoing();

    setTimeout(() => {
      setWigglingCreatureId(null);
    }, 400);
  };

  // Drag drop callbacks from direct-pointer FoodItemCard
  const handleDropCorrect = (food: FoodItemData, creatureColorId: ColorId) => {
    setHoveredCreatureId(null);
    setDraggingFoodId(null);
    const creatureColor = COLORS_CONFIG[creatureColorId];
    handleCorrectFeed(food, creatureColor);
  };

  const handleDropMismatch = (wrongColorId: ColorId) => {
    setHoveredCreatureId(null);
    setDraggingFoodId(null);
    handleMismatch(wrongColorId);
  };

  // Handle direct tap on food or creature (dual-mode for younger toddlers)
  const handleFoodSelect = (food: FoodItemData) => {
    setSelectedFood(selectedFood?.id === food.id ? null : food);
  };

  const handleCreatureTap = (colorData: ColorData) => {
    if (!selectedFood) {
      soundManager.playPop(520);
      setHappyCreatureId(colorData.id);
      setTimeout(() => setHappyCreatureId(null), 800);
      return;
    }

    if (selectedFood.colorId === colorData.id) {
      handleCorrectFeed(selectedFood, colorData);
    } else {
      handleMismatch(colorData.id);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#ECFDF5]">
      {/* Garden Scenery Background: Sunlight, Soft Clouds, Fluttering Butterflies & Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft sunlight in top corner */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-emerald-150/25 blur-3xl" />

        {/* Ambient floating clouds */}
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

        {/* Fluttering Garden Butterfly */}
        <motion.div
          animate={{
            x: [0, 25, 10, 0],
            y: [0, -20, -8, 0],
            rotate: [0, 10, -6, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-1/4 text-2xl sm:text-3xl opacity-80 filter drop-shadow-xs"
        >
          🦋
        </motion.div>

        {/* Rolling Lush Garden Hill at the base where characters and food play */}
        <div className="absolute bottom-0 inset-x-0 h-64 sm:h-72 bg-gradient-to-t from-emerald-200/70 via-emerald-100/50 to-transparent pointer-events-none rounded-t-[50%] scale-110" />
      </div>

      {/* Discrete Top Scene Controls: Back, Star Progress & Sound with safe areas */}
      <header className="relative z-30 w-full max-w-5xl mx-auto safe-px safe-pt pb-1 flex items-center justify-between">
        {/* Left: Gentle Back Button */}
        <button
          id="minigame-back-button"
          onClick={() => {
            soundManager.playPop(480);
            onBackToHome();
          }}
          aria-label="Voltar para a trilha"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center border border-stone-200/70 shadow-xs transition-all active:scale-95 cursor-pointer touch-none"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Center: Integrated Floating Star Progress Pill representing the 3 rounds */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-amber-200/80 shadow-xs"
          aria-label={`Progresso: ${completedRounds} de ${TOTAL_ROUNDS} rodadas`}
        >
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
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
                  isEarned
                    ? 'opacity-100 filter drop-shadow-sm'
                    : 'opacity-25 grayscale'
                }`}
              >
                ⭐
              </motion.span>
            );
          })}
        </div>

        {/* Right: Sound, Restart & Parents Gate */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Restart Activity (from round 1) */}
          <button
            id="minigame-restart-button"
            onClick={() => {
              soundManager.playPop(480);
              startSession();
            }}
            aria-label="Reiniciar atividade"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="minigame-sound-toggle"
            onClick={toggleSfx}
            aria-label={sfxEnabled ? 'Desativar som' : 'Ativar som'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 stroke-[2.2]" /> : <VolumeX className="w-4 h-4 stroke-[2.2]" />}
          </button>

          {/* Parents Gate (Discreet) */}
          {onOpenParentsGate && (
            <button
              id="minigame-parents-gate"
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

      {/* Middle Garden Scene: The 3 Hungry Creatures sitting on their grassy knolls */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-2 sm:px-6 py-2 sm:py-5">
        <div className="flex flex-nowrap items-center justify-center gap-2 xs:gap-5 sm:gap-12 md:gap-18 max-w-full">
          {activeColors.map((color) => (
            <div
              key={color.id}
              ref={(el) => {
                creatureRefs.current[color.id] = el;
              }}
              className="flex items-center justify-center flex-shrink-0"
            >
              <Creature
                colorData={color}
                isHappy={happyCreatureId === color.id || isRoundTransition}
                isHovered={hoveredCreatureId === color.id}
                isGentleWiggle={wigglingCreatureId === color.id}
                isCelebrating={isLevelCompleted}
                onFeedDirect={() => handleCreatureTap(color)}
                isTargetSelected={selectedFood?.colorId === color.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Garden Transition Layer: Natural wildflowers & greenery separating creatures & food */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-center gap-6 sm:gap-10 opacity-70 pointer-events-none select-none text-base sm:text-lg">
        <span>🌼</span>
        <span>🌿</span>
        <span>🌷</span>
        <span>🍀</span>
        <span>🌸</span>
      </div>

      {/* Bottom Garden Meadow: 6 Foods during gameplay, or pure visual celebration once completed */}
      <div className="relative z-20 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-0 flex flex-col items-center">
        {!isLevelCompleted ? (
          <div className="flex items-center justify-center min-h-[85px] sm:min-h-[100px] w-full">
            {isRoundTransition ? (
              <motion.div
                key="round-transition-sparkles"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center justify-center gap-3 text-3xl sm:text-4xl select-none py-2"
              >
                <motion.span animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 1 }}>
                  ✨
                </motion.span>
                <motion.span animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  ⭐
                </motion.span>
                <motion.span animate={{ rotate: [8, -8, 8] }} transition={{ repeat: Infinity, duration: 1 }}>
                  ✨
                </motion.span>
              </motion.div>
            ) : (
              <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-5 w-full max-w-4xl mx-auto overflow-x-auto py-1">
                {(roundsData[currentRound] || []).map((food, slotIndex) => {
                  const isEaten = consumedFoodIds.includes(food.id);
                  return (
                    <div
                      key={`slot-${currentRound}-${food.id}`}
                      className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 flex items-center justify-center flex-shrink-0"
                    >
                      {!isEaten && (
                        <motion.div
                          key={food.id}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{
                            duration: 0.2,
                            delay: slotIndex * 0.05, // 50ms stagger per food
                            ease: 'easeOut',
                          }}
                          className={`relative ${draggingFoodId === food.id ? 'z-50' : 'z-10'}`}
                        >
                          <FoodItemCard
                            food={food}
                            isSelected={selectedFood?.id === food.id}
                            onSelect={handleFoodSelect}
                            getCreatureTargets={getCreatureTargets}
                            getCreatureMouth={getCreatureMouthPosition}
                            onHoverTarget={(colorId) => setHoveredCreatureId(colorId)}
                            onDropCorrect={handleDropCorrect}
                            onDropWrong={handleDropMismatch}
                            onDragStateChange={(foodId) => setDraggingFoodId(foodId)}
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Pure Visual Celebration — No text, joyful stars, followed by big continue button to trail */
          <div className="flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px]">
            <AnimatePresence mode="wait">
              {showContinueButton ? (
                <motion.div
                  key="continue-action-group"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center gap-5 sm:gap-7"
                >
                  {/* Discreet Replay Round Button (Icon only) */}
                  <motion.button
                    id="minigame-replay-round-button"
                    onClick={() => {
                      soundManager.playPop(480);
                      startSession();
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 border-2 border-stone-200/80 shadow-md text-stone-600 flex items-center justify-center cursor-pointer touch-none active:scale-90"
                    aria-label="Rejogar atividade"
                  >
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
                  </motion.button>

                  {/* Big Visual Continue Button (→) returning to Trail */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
                    <motion.button
                      id="minigame-continue-trail-button"
                      onClick={() => {
                        soundManager.playPop(580);
                        onCompleteActivity?.(3);
                        onBackToHome();
                      }}
                      animate={{ scale: [1, 1.07, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      whileTap={{ scale: 0.92 }}
                      className="relative z-10 w-22 h-22 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-400 border-4 border-white shadow-xl flex items-center justify-center cursor-pointer touch-none"
                      aria-label="Continuar para a trilha"
                    >
                      <ArrowRight className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 text-white stroke-[3.5] drop-shadow-sm" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* Joyful Floating Golden Stars before continue button emerges */
                <motion.div
                  key="celebration-stars"
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-3 text-4xl sm:text-5xl filter drop-shadow-md select-none"
                >
                  <motion.span
                    animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                  >
                    ⭐
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -14, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0], rotate: [6, -6, 6] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  >
                    ⭐
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

