import React from 'react';
import { motion } from 'motion/react';
import { Lock, Star, Check } from 'lucide-react';
import { AdventureNode } from '../../types';
import { soundManager } from '../../audio/soundManager';

interface TrailNodeProps {
  node: AdventureNode;
  isUnlocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  hasNunu: boolean;
  onSelect: (node: AdventureNode) => void;
}

export const TrailNode: React.FC<TrailNodeProps> = ({
  node,
  isUnlocked,
  isCurrent,
  isCompleted,
  hasNunu,
  onSelect,
}) => {
  const handleClick = () => {
    if (isUnlocked) {
      soundManager.playPop(550);
    } else {
      soundManager.playSoftBoing();
    }
    onSelect(node);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Node Interactive Large Button */}
      <motion.button
        id={`trail-node-${node.id}`}
        onClick={handleClick}
        whileHover={{ scale: isUnlocked ? 1.08 : 1.02 }}
        whileTap={{ scale: 0.94 }}
        animate={
          isCurrent
            ? {
                scale: [1, 1.06, 1],
                boxShadow: [
                  '0 10px 25px -5px rgba(245, 158, 11, 0.35)',
                  '0 16px 32px -4px rgba(245, 158, 11, 0.55)',
                  '0 10px 25px -5px rgba(245, 158, 11, 0.35)',
                ],
              }
            : {}
        }
        transition={
          isCurrent
            ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.2 }
        }
        className={`relative w-22 h-22 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-3xl flex flex-col items-center justify-center cursor-pointer select-none border-4 transition-all touch-none ${
          isUnlocked
            ? isCurrent
              ? 'bg-gradient-to-tr from-amber-100 via-white to-amber-50 border-amber-400 shadow-lg'
              : 'bg-white border-emerald-300 shadow-md hover:shadow-lg'
            : 'bg-stone-100/90 border-stone-200/80 shadow-xs opacity-75 cursor-default'
        }`}
        aria-label={`${node.title}${isUnlocked ? '' : ' (Bloqueado)'}`}
      >
        {/* Soft Background Tint */}
        <div
          className="absolute inset-2 rounded-2xl opacity-25 pointer-events-none"
          style={{ backgroundColor: isUnlocked ? node.themeColor : '#D6D3D1' }}
        />

        {/* Large Central Emoji/Icon */}
        <span
          className={`text-4xl sm:text-5xl md:text-5xl select-none pointer-events-none filter drop-shadow-xs transition-transform ${
            isUnlocked ? 'group-hover:scale-110' : 'grayscale-[40%] opacity-60'
          }`}
        >
          {node.emoji}
        </span>

        {/* Status Badges */}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
          </div>
        )}

        {!isUnlocked && (
          <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-400 text-white border-2 border-white flex items-center justify-center shadow-xs">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        )}

        {isCurrent && !isCompleted && (
          <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-amber-400 text-amber-950 border-2 border-white flex items-center justify-center shadow-sm animate-pulse">
            <Star className="w-4 h-4 fill-amber-950 stroke-[2]" />
          </div>
        )}
      </motion.button>

      {/* Clear Text Label below Node */}
      <div className="mt-2 text-center max-w-[140px] select-none pointer-events-none">
        <span
          className={`text-xs sm:text-sm font-bold block leading-tight ${
            isUnlocked ? 'text-stone-800' : 'text-stone-400'
          }`}
        >
          {node.title}
        </span>
        <span className="text-[10px] sm:text-xs text-stone-500 block leading-tight mt-0.5">
          {node.subtitle}
        </span>
      </div>
    </div>
  );
};
