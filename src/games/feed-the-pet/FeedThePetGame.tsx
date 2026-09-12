import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { ColorId, FoodItemData, ColorData } from '../../types';
import { COLORS_CONFIG, ALL_FOODS } from '../../data/colorsGameData';
import { Creature } from './Creature';
import { FoodItemCard } from './FoodItemCard';
import { soundManager } from '../../audio/soundManager';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';

interface FeedThePetGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (starsEarned: number) => void;
  onOpenParentsGate?: () => void;
}

// Level configurations for graduated learning (2 to 5 years)
const LEVELS = [
  {
    levelNum: 1,
    colors: ['red', 'yellow'] as ColorId[],
    itemsPerColor: 2,
  },
  {
    levelNum: 2,
    colors: ['red', 'green', 'yellow'] as ColorId[],
    itemsPerColor: 1,
  },
  {
    levelNum: 3,
    colors: ['blue', 'yellow', 'green'] as ColorId[],
    itemsPerColor: 2,
  },
  {
    levelNum: 4,
    colors: ['red', 'blue', 'green', 'purple'] as ColorId[],
    itemsPerColor: 1,
  },
];

export const FeedThePetGame: React.FC<FeedThePetGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [levelIndex, setLevelIndex] = useState(0);

  const [activeColors, setActiveColors] = useState<ColorData[]>([]);
  const [foodQueue, setFoodQueue] = useState<FoodItemData[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItemData | null>(null);

  // Interaction feedback states (100% visual + sound, zero text)
  const [happyCreatureId, setHappyCreatureId] = useState<ColorId | null>(null);
  const [wigglingCreatureId, setWigglingCreatureId] = useState<ColorId | null>(null);
  const [hoveredCreatureId, setHoveredCreatureId] = useState<ColorId | null>(null);
  const [draggingFoodId, setDraggingFoodId] = useState<string | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [totalNeededStars, setTotalNeededStars] = useState<number>(4);
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);

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

  // Initialize Level
  useEffect(() => {
    startLevel(levelIndex);
  }, [levelIndex]);

  const startLevel = (lvlIdx: number) => {
    const lvl = LEVELS[lvlIdx % LEVELS.length];
    const colors = lvl.colors.map((cId) => COLORS_CONFIG[cId]);
    setActiveColors(colors);

    // Pick foods matching the level's colors
    const foodsForRound: FoodItemData[] = [];
    lvl.colors.forEach((cId) => {
      const matchingFoods = ALL_FOODS.filter((f) => f.colorId === cId);
      const shuffled = [...matchingFoods].sort(() => 0.5 - Math.random());
      foodsForRound.push(...shuffled.slice(0, lvl.itemsPerColor));
    });

    const shuffledQueue = foodsForRound.sort(() => 0.5 - Math.random());
    setFoodQueue(shuffledQueue);
    setSelectedFood(null);
    setStars(0);
    setTotalNeededStars(shuffledQueue.length);
    setIsLevelCompleted(false);
    setHappyCreatureId(null);
    setWigglingCreatureId(null);
  };

  // Check if drop coordinates overlap a creature (point is already the center of the food)
  const checkDropTarget = (point: { x: number; y: number }): ColorId | null => {
    for (const color of activeColors) {
      const element = document.getElementById(`creature-target-${color.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Generous forgiving padding for toddlers
        const pad = 36;

        if (
          point.x >= rect.left - pad &&
          point.x <= rect.right + pad &&
          point.y >= rect.top - pad &&
          point.y <= rect.bottom + pad
        ) {
          return color.id;
        }
      }
    }
    return null;
  };

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
    setHappyCreatureId(creatureColor.id);
    setSelectedFood(null);

    // Musical/sound feedback: eating yum + happy chime
    soundManager.playYum();
    setTimeout(() => soundManager.playSuccessChime(), 150);

    // Remove fed food from queue
    const remainingQueue = foodQueue.filter((f) => f.id !== food.id);
    setFoodQueue(remainingQueue);

    const newStars = stars + 1;
    setStars(newStars);

    // Clear happy state after animation
    setTimeout(() => {
      setHappyCreatureId(null);
    }, 1100);

    // Check if round is finished
    if (remainingQueue.length === 0) {
      setTimeout(() => {
        setIsLevelCompleted(true);
        onCompleteActivity?.(totalNeededStars);
      }, 700);
    }
  };

  // Handle gentle mismatch (NO negative feedback, NO error marks, curious creature tilt)
  const handleMismatch = (creatureColorId: ColorId) => {
    setWigglingCreatureId(creatureColorId);
    soundManager.playSoftBoing();

    setTimeout(() => {
      setWigglingCreatureId(null);
    }, 600);
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

      {/* Discrete Top Scene Controls: Back, Star Progress & Sound (Clean, no text banners) */}
      <header className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between">
        {/* Left: Gentle Back Button */}
        <button
          id="minigame-back-button"
          onClick={() => {
            soundManager.playPop(480);
            onBackToHome();
          }}
          aria-label="Voltar para a trilha"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-stone-700 flex items-center justify-center border border-stone-200/60 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Center: Integrated Floating Star Progress Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-amber-200/60 shadow-xs">
          {Array.from({ length: totalNeededStars }).map((_, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{
                scale: i < stars ? [1, 1.35, 1] : 1,
                opacity: i < stars ? 1 : 0.28,
              }}
              transition={{ duration: 0.35 }}
              className="text-xl sm:text-2xl filter drop-shadow-xs select-none"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Right: Sound, Restart & Parents Gate */}
        <div className="flex items-center gap-2">
          {/* Restart Round */}
          <button
            id="minigame-restart-button"
            onClick={() => {
              soundManager.playPop(480);
              startLevel(levelIndex);
            }}
            aria-label="Reiniciar rodada"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/50 shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="minigame-sound-toggle"
            onClick={toggleSfx}
            aria-label={sfxEnabled ? 'Desativar som' : 'Ativar som'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/50 shadow-xs active:scale-95 cursor-pointer"
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
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/75 hover:bg-white text-stone-500 flex items-center justify-center border border-stone-200/50 shadow-xs active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
            </button>
          )}
        </div>
      </header>

      {/* Middle Garden Scene: The Hungry Creatures sitting on the grassy knolls */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-3 sm:py-6">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 md:gap-24">
          {activeColors.map((color) => (
            <div
              key={color.id}
              ref={(el) => {
                creatureRefs.current[color.id] = el;
              }}
            >
              <Creature
                colorData={color}
                isHappy={happyCreatureId === color.id}
                isHovered={hoveredCreatureId === color.id}
                isGentleWiggle={wigglingCreatureId === color.id}
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

      {/* Bottom Garden Meadow: Loose, Large Food Items directly on the grass (No white box, no cards, no text!) */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 pb-6 sm:pb-10 pt-2 flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12 min-h-[90px] sm:min-h-[110px]">
          <AnimatePresence>
            {foodQueue.map((food) => (
              <motion.div
                key={food.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`relative ${draggingFoodId === food.id ? 'z-50' : 'z-10'}`}
              >
                <FoodItemCard
                  food={food}
                  isSelected={selectedFood?.id === food.id}
                  onSelect={handleFoodSelect}
                  checkDropTarget={checkDropTarget}
                  getCreatureMouth={getCreatureMouthPosition}
                  onHoverTarget={(colorId) => setHoveredCreatureId(colorId)}
                  onDropCorrect={handleDropCorrect}
                  onDropWrong={handleDropMismatch}
                  onDragStateChange={(foodId) => setDraggingFoodId(foodId)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Victory Celebration Modal (Non-verbal fanfare + confetti) */}
      {isLevelCompleted && (
        <SuccessCelebration
          starsEarned={totalNeededStars}
          onNextRound={() => {
            setLevelIndex((prev) => prev + 1);
          }}
          onGoHome={onBackToHome}
        />
      )}
    </div>
  );
};

