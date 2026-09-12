import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { CategoryInfo } from '../../types';
import { soundManager } from '../../audio/soundManager';

interface CategoryCardProps {
  category: CategoryInfo;
  onSelect: (category: CategoryInfo) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const handleClick = () => {
    if (category.isAvailable) {
      soundManager.playPop(580);
      onSelect(category);
    } else {
      soundManager.playSoftBoing();
    }
  };

  return (
    <motion.button
      id={`category-card-${category.id}`}
      onClick={handleClick}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-[26px] sm:rounded-[28px] border transition-all duration-300 cursor-pointer text-center w-full min-h-[175px] sm:min-h-[190px] select-none ${
        category.pastelBg
      } ${category.borderColor} ${
        category.isAvailable
          ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
          : 'bg-white/60 opacity-80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:opacity-95'
      }`}
    >
      {/* Top Bar: Discreet Status Indicator */}
      <div className="w-full flex items-center justify-between h-6 px-1">
        {category.isAvailable ? (
          <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-rose-500 bg-rose-100/60 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>Disponível</span>
          </span>
        ) : (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-stone-400 bg-stone-100/80 px-2 py-0.5 rounded-full">
            <Lock className="w-2.5 h-2.5 text-stone-400" />
            <span>Em breve</span>
          </span>
        )}
      </div>

      {/* Central Single Protagonist Illustration */}
      <div className="my-auto py-1 flex items-center justify-center">
        <div
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center ${category.iconBg} transition-transform duration-300 group-hover:scale-108`}
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow-xs select-none">
            {category.emoji}
          </span>
        </div>
      </div>

      {/* Bottom Typography: Clear and Delicate */}
      <div className="w-full pt-1">
        <h3 className="text-lg sm:text-xl font-semibold text-stone-800 tracking-tight leading-tight">
          {category.title}
        </h3>
        <p className="text-xs sm:text-[13px] font-normal text-stone-500 mt-0.5 line-clamp-1">
          {category.subtitle}
        </p>
      </div>
    </motion.button>
  );
};
