import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../../data/categories';
import { CategoryInfo } from '../../types';
import { CategoryCard } from './CategoryCard';
import { Mascot } from './Mascot';

interface HomeScreenProps {
  onSelectCategory: (category: CategoryInfo) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectCategory }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 flex flex-col items-center">
      {/* Central Mascot Hero Area */}
      <Mascot />

      {/* Gentle Header: Clean & Inviting */}
      <div className="w-full text-center mt-1 mb-5 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
          Mundo da Nunu
        </h2>
        <p className="text-sm sm:text-base font-normal text-stone-500 mt-0.5">
          Vamos brincar?
        </p>
      </div>

      {/* 6 Category Cards Grid: 2 columns on mobile, 3 columns on tablet/desktop */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 w-full pb-8"
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onSelect={onSelectCategory}
          />
        ))}
      </motion.div>

      {/* Discrete Safe Environment Footer */}
      <div className="text-center py-3 text-stone-400 text-xs font-normal flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Ambiente seguro • Sem anúncios</span>
      </div>
    </div>
  );
};
