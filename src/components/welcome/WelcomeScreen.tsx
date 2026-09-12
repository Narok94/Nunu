import React from 'react';
import { motion } from 'motion/react';
import { Play, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { NunuAvatar } from '../common/NunuAvatar';
import { soundManager } from '../../audio/soundManager';

interface WelcomeScreenProps {
  onPlay: () => void;
  onOpenParentsGate: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPlay,
  onOpenParentsGate,
}) => {
  const [sfxEnabled, setSfxEnabled] = React.useState(() => soundManager.getSettings().soundEffects);

  const toggleSfx = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSoundEffects(next);
    if (next) soundManager.playPop(600);
  };

  const handlePlayClick = () => {
    soundManager.playPop(650);
    onPlay();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 py-6 overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#FFFBEB]">
      {/* Illustrated Scenery: Soft Floating Clouds, Sun, Butterflies & Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gentle Sun in Top-Left */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-amber-200/45 blur-2xl"
        />
        <div className="absolute top-5 left-6 text-3xl opacity-85">☀️</div>

        {/* Floating Clouds */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-1/4 text-4xl opacity-75"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-10 text-3xl opacity-60"
        >
          ☁️
        </motion.div>

        {/* Fluttering Butterflies */}
        <motion.div
          animate={{
            x: [0, 30, 10, 0],
            y: [0, -25, -10, 0],
            rotate: [0, 12, -8, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-36 left-8 text-2xl sm:text-3xl filter drop-shadow-xs"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{
            x: [0, -25, -10, 0],
            y: [0, -18, -30, 0],
            rotate: [0, -10, 12, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-44 right-12 text-2xl filter drop-shadow-xs"
        >
          🌸
        </motion.div>

        {/* Soft rolling hills at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-100/60 to-transparent pointer-events-none rounded-t-[50%] scale-110" />

        {/* Little wildflowers at bottom */}
        <div className="absolute bottom-4 left-6 text-2xl opacity-80">🌼</div>
        <div className="absolute bottom-6 left-1/3 text-xl opacity-75">🌷</div>
        <div className="absolute bottom-5 right-1/4 text-2xl opacity-80">🌻</div>
        <div className="absolute bottom-3 right-8 text-xl opacity-75">🌸</div>
      </div>

      {/* Discrete Top Controls: Small Audio Toggle & Parents Gate (Non-distracting for child) */}
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-1 px-2">
        {/* Sound toggle */}
        <button
          id="welcome-sfx-toggle"
          onClick={toggleSfx}
          aria-label={sfxEnabled ? 'Desativar som' : 'Ativar som'}
          className="w-9 h-9 rounded-full bg-white/75 hover:bg-white text-stone-500 hover:text-stone-700 flex items-center justify-center border border-stone-200/50 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          {sfxEnabled ? <Volume2 className="w-4 h-4 stroke-[2]" /> : <VolumeX className="w-4 h-4 stroke-[2]" />}
        </button>

        {/* Discrete Parents Gate Button */}
        <button
          id="welcome-parents-gate"
          onClick={() => {
            soundManager.playPop(500);
            onOpenParentsGate();
          }}
          aria-label="Acesso dos pais"
          title="Área dos Pais"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-stone-500 hover:text-stone-700 border border-stone-200/50 shadow-xs transition-all active:scale-95 cursor-pointer text-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
          <span className="text-[11px] font-medium text-stone-500">Pais</span>
        </button>
      </div>

      {/* Center Section: App Logo -> Nunu Mascot -> Big Breathing PLAY Button */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-sm text-center py-2 sm:py-4">
        {/* App Title & Logo */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center mb-2 sm:mb-3"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-stone-800 tracking-tight leading-none drop-shadow-xs">
            Mundo da <span className="text-amber-500">Nunu</span>
          </h1>
        </motion.div>

        {/* Nunu Mascot with silent animations */}
        <div className="my-1 sm:my-2">
          <NunuAvatar
            size="xl"
            interactive={true}
          />
        </div>

        {/* Big Breathing PLAY Button - Connected closely to Nunu */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center">
          <motion.button
            id="welcome-play-button"
            onClick={handlePlayClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -3, 0],
              boxShadow: [
                '0 12px 28px -4px rgba(245, 158, 11, 0.42), 0 8px 12px -6px rgba(245, 158, 11, 0.25)',
                '0 20px 38px -4px rgba(245, 158, 11, 0.58), 0 10px 16px -6px rgba(245, 158, 11, 0.35)',
                '0 12px 28px -4px rgba(245, 158, 11, 0.42), 0 8px 12px -6px rgba(245, 158, 11, 0.25)',
              ],
            }}
            transition={{
              scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
              boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="group relative w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-4 border-white flex items-center justify-center cursor-pointer select-none transition-transform touch-none focus:outline-none overflow-hidden"
            aria-label="Jogar"
          >
            {/* Subtle inner highlight */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

            {/* Animated subtle shimmer gleam */}
            <motion.div
              animate={{ x: [-100, 140] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
              className="absolute -inset-y-2 -inset-x-8 w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-25 pointer-events-none"
            />

            {/* Universal Big Triangle Play Icon */}
            <Play
              className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 text-white fill-white ml-1.5 filter drop-shadow-sm group-hover:scale-105 transition-transform"
              strokeWidth={1}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
