import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { PALETTE_COLORS } from './paintingTypes';

interface PaintingGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const PaintingGame: React.FC<PaintingGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0].color);
  const [fills, setFills] = useState<Record<string, string>>({});

  const totalRounds = 3;

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setFills({});
    setSelectedColor(PALETTE_COLORS[0].color);
  };

  const handleSectionClick = (sectionId: string) => {
    soundManager.playPaint();
    setFills((prev) => ({ ...prev, [sectionId]: selectedColor }));
  };

  const handleColorSelect = (color: string) => {
    soundManager.playPop(580);
    setSelectedColor(color);
  };

  const handleRoundFinish = () => {
    soundManager.playSuccessChime();
    const nextCompleted = completedRounds + 1;
    setCompletedRounds(nextCompleted);

    setTimeout(() => {
      soundManager.playGiggle();
    }, 300);

    setTimeout(() => {
      if (nextCompleted >= totalRounds) {
        setIsCompleted(true);
        onCompleteActivity?.(3);
      } else {
        setCurrentRoundIdx((prev) => prev + 1);
        setFills({});
      }
    }, 900);
  };

  // Has child colored at least a few sections?
  const paintedCount = Object.keys(fills).length;
  const canFinish = paintedCount >= 3;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#FDF2F8] via-[#FCE7F3] to-[#F3E8FF]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute bottom-12 right-12 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={totalRounds}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Center Drawing Canvas: Landscape side-by-side easel */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px safe-pb pb-2 pt-1 flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6">
        {/* Drawing Card */}
        <div className="relative w-60 h-60 sm:w-68 sm:h-68 md:w-72 md:h-72 bg-white rounded-3xl border-4 border-pink-200 shadow-lg p-3 sm:p-4 flex items-center justify-center flex-shrink-0">
          {/* Drawing 0: Florzinha 🌸 */}
          {currentRoundIdx === 0 && (
            <svg viewBox="0 0 300 300" className="w-full h-full cursor-pointer">
              {/* Stem */}
              <path
                d="M 150 180 Q 150 250 150 280"
                stroke="#15803D"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left Leaf */}
              <path
                d="M 150 240 Q 100 230 110 210 Q 140 215 150 240"
                fill={fills['leaf1'] || '#DCFCE7'}
                stroke="#15803D"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('leaf1')}
              />
              {/* Right Leaf */}
              <path
                d="M 150 230 Q 200 220 190 200 Q 160 205 150 230"
                fill={fills['leaf2'] || '#DCFCE7'}
                stroke="#15803D"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('leaf2')}
              />
              {/* Top Petal */}
              <circle
                cx="150"
                cy="85"
                r="42"
                fill={fills['petal1'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('petal1')}
              />
              {/* Bottom Petal */}
              <circle
                cx="150"
                cy="195"
                r="42"
                fill={fills['petal2'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('petal2')}
              />
              {/* Left Petal */}
              <circle
                cx="95"
                cy="140"
                r="42"
                fill={fills['petal3'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('petal3')}
              />
              {/* Right Petal */}
              <circle
                cx="205"
                cy="140"
                r="42"
                fill={fills['petal4'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('petal4')}
              />
              {/* Center Core */}
              <circle
                cx="150"
                cy="140"
                r="36"
                fill={fills['core'] || '#FEF08A'}
                stroke="#374151"
                strokeWidth="7"
                onClick={() => handleSectionClick('core')}
              />
              {/* Happy eyes and smile on core */}
              <circle cx="140" cy="135" r="4" fill="#374151" pointerEvents="none" />
              <circle cx="160" cy="135" r="4" fill="#374151" pointerEvents="none" />
              <path
                d="M 142 146 Q 150 154 158 146"
                stroke="#374151"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                pointerEvents="none"
              />
            </svg>
          )}

          {/* Drawing 1: Borboleta 🦋 */}
          {currentRoundIdx === 1 && (
            <svg viewBox="0 0 300 300" className="w-full h-full cursor-pointer">
              {/* Upper Left Wing */}
              <path
                d="M 140 130 C 80 50 30 100 60 160 C 80 180 130 160 140 150 Z"
                fill={fills['wingUL'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('wingUL')}
              />
              {/* Upper Right Wing */}
              <path
                d="M 160 130 C 220 50 270 100 240 160 C 220 180 170 160 160 150 Z"
                fill={fills['wingUR'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('wingUR')}
              />
              {/* Lower Left Wing */}
              <path
                d="M 140 160 C 80 170 60 220 90 250 C 120 260 140 210 140 180 Z"
                fill={fills['wingLL'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('wingLL')}
              />
              {/* Lower Right Wing */}
              <path
                d="M 160 160 C 220 170 240 220 210 250 C 180 260 160 210 160 180 Z"
                fill={fills['wingLR'] || '#F9FAFB'}
                stroke="#374151"
                strokeWidth="6"
                strokeLinejoin="round"
                onClick={() => handleSectionClick('wingLR')}
              />
              {/* Spots inside wings */}
              <circle
                cx="90"
                cy="125"
                r="16"
                fill={fills['spot1'] || '#FEF08A'}
                stroke="#374151"
                strokeWidth="5"
                onClick={() => handleSectionClick('spot1')}
              />
              <circle
                cx="210"
                cy="125"
                r="16"
                fill={fills['spot2'] || '#FEF08A'}
                stroke="#374151"
                strokeWidth="5"
                onClick={() => handleSectionClick('spot2')}
              />
              {/* Body */}
              <rect
                x="142"
                y="110"
                width="16"
                height="90"
                rx="8"
                fill={fills['body'] || '#E5E7EB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('body')}
              />
              {/* Head */}
              <circle
                cx="150"
                cy="95"
                r="16"
                fill={fills['head'] || '#E5E7EB'}
                stroke="#374151"
                strokeWidth="6"
                onClick={() => handleSectionClick('head')}
              />
              {/* Antennae */}
              <path
                d="M 145 85 Q 130 65 125 70"
                stroke="#374151"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 155 85 Q 170 65 175 70"
                stroke="#374151"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Drawing 2: Solzinho Feliz ☀️ */}
          {currentRoundIdx === 2 && (
            <svg viewBox="0 0 300 300" className="w-full h-full cursor-pointer">
              {/* Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <path
                  key={i}
                  d="M 150 35 L 160 70 L 140 70 Z"
                  transform={`rotate(${deg} 150 150)`}
                  fill={fills[`ray${i}`] || '#F9FAFB'}
                  stroke="#374151"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  onClick={() => handleSectionClick(`ray${i}`)}
                />
              ))}
              {/* Sun Main Face */}
              <circle
                cx="150"
                cy="150"
                r="65"
                fill={fills['sunFace'] || '#FEF08A'}
                stroke="#374151"
                strokeWidth="7"
                onClick={() => handleSectionClick('sunFace')}
              />
              {/* Left Cheek */}
              <circle
                cx="120"
                cy="165"
                r="12"
                fill={fills['cheek1'] || '#FCA5A5'}
                stroke="#374151"
                strokeWidth="4"
                onClick={() => handleSectionClick('cheek1')}
              />
              {/* Right Cheek */}
              <circle
                cx="180"
                cy="165"
                r="12"
                fill={fills['cheek2'] || '#FCA5A5'}
                stroke="#374151"
                strokeWidth="4"
                onClick={() => handleSectionClick('cheek2')}
              />
              {/* Eyes & Smile */}
              <circle cx="132" cy="140" r="6" fill="#374151" pointerEvents="none" />
              <circle cx="168" cy="140" r="6" fill="#374151" pointerEvents="none" />
              <path
                d="M 135 158 Q 150 174 165 158"
                stroke="#374151"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                pointerEvents="none"
              />
            </svg>
          )}

        </div>

        {/* Center: Mascot encouraging painting */}
        <div className="flex items-center justify-center pointer-events-none select-none">
          <motion.div
            animate={{
              y: canFinish ? [-4, 0, -4] : 0,
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🐰</span>
            <span className="text-xl sm:text-2xl">🎨</span>
          </motion.div>
        </div>

        {/* Right Side: Palette Container & Giant Finish Button */}
        <div className="flex flex-col items-center gap-3">
          {/* 4x2 Grid of Paint Pots */}
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-pink-200/80 shadow-md">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {PALETTE_COLORS.map((item) => {
                const isSelected = selectedColor === item.color;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleColorSelect(item.color)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      isSelected
                        ? { scale: [1, 1.18, 1.12], y: -2 }
                        : { scale: 1, y: 0 }
                    }
                    style={{ backgroundColor: item.color }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-3 cursor-pointer shadow-md transition-all touch-none flex items-center justify-center ${
                      isSelected ? 'border-white ring-4 ring-pink-400' : 'border-white/80'
                    }`}
                    aria-label={`Cor ${item.label}`}
                  >
                    {isSelected && <span className="text-white text-base font-bold">✓</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Big Finish Button when ready */}
          {canFinish && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleRoundFinish}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 touch-none"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span className="text-base">✨</span>
            </motion.button>
          )}
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
