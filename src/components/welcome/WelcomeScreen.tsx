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
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#FFFBEB]">
      {/* Illustrated Scenery: Soft Floating Clouds, Sun, Butterflies & Flowers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gentle Sun in Top-Left */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-amber-200/45 blur-2xl"
        />
        <div className="absolute top-4 left-6 text-3xl opacity-85">☀️</div>

        {/* Floating Clouds */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-1/4 text-3xl opacity-75"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-1/4 text-3xl opacity-60"
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
          className="absolute top-24 left-10 text-2xl sm:text-3xl filter drop-shadow-xs"
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
          className="absolute top-28 right-16 text-2xl filter drop-shadow-xs"
        >
          🌸
        </motion.div>

        {/* Soft rolling hills at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 bg-gradient-to-t from-emerald-200/60 via-emerald-100/40 to-transparent pointer-events-none rounded-t-[50%] scale-110" />

        {/* Little wildflowers at bottom */}
        <div className="absolute bottom-3 left-10 text-2xl opacity-80">🌼</div>
        <div className="absolute bottom-4 left-1/3 text-xl opacity-75">🌷</div>
        <div className="absolute bottom-3 right-1/3 text-2xl opacity-80">🌻</div>
        <div className="absolute bottom-2 right-12 text-xl opacity-75">🌸</div>
      </div>

      {/* Discrete Top Controls: Safe Area Inset with Audio Toggle & Parents Gate */}
      <header className="relative z-20 w-full safe-px safe-pt flex items-center justify-between">
        {/* Sound toggle (left side, clear of notch) */}
        <button
          id="welcome-sfx-toggle"
          onClick={toggleSfx}
          aria-label={sfxEnabled ? 'Desativar som' : 'Ativar som'}
          className="w-10 h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs transition-all active:scale-95 cursor-pointer touch-none"
        >
          {sfxEnabled ? <Volume2 className="w-4 h-4 stroke-[2.2]" /> : <VolumeX className="w-4 h-4 stroke-[2.2]" />}
        </button>

        {/* Discrete Parents Gate Button (right side, clear of dynamic island) */}
        <button
          id="welcome-parents-gate"
          onClick={() => {
            soundManager.playPop(500);
            onOpenParentsGate();
          }}
          aria-label="Acesso dos pais"
          title="Área dos Pais"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white text-stone-600 border border-stone-200/60 shadow-xs transition-all active:scale-95 cursor-pointer text-xs touch-none min-h-[40px]"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
          <span className="text-xs font-semibold text-stone-600">Pais</span>
        </button>
      </header>

      {/* Landscape-First Central Play Section: 2 Balanced Columns */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto safe-px flex flex-row items-center justify-around gap-6 py-2">
        {/* Left Column: Mascot & Title */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center sm:items-start mb-2"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-800 tracking-tight leading-none drop-shadow-xs">
              Mundo da <span className="text-amber-500">Nunu</span>
            </h1>
            <span className="text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-100/80 px-3 py-0.5 rounded-full mt-1.5 border border-emerald-200/60">
              Jardim de Aventuras 🌻
            </span>
          </motion.div>

          {/* Nunu Mascot with soft animation */}
          <div className="mt-1">
            <NunuAvatar size="lg" interactive={true} isHappy={true} />
          </div>
        </div>

        {/* Right Column: Big Breathing PLAY Button */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Ambient Pulse Ring */}
            <div className="absolute -inset-3 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />

            <motion.button
              id="welcome-play-button"
              onClick={handlePlayClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                scale: [1, 1.06, 1],
                boxShadow: [
                  '0 12px 28px -4px rgba(245, 158, 11, 0.45), 0 8px 12px -6px rgba(245, 158, 11, 0.25)',
                  '0 20px 40px -4px rgba(245, 158, 11, 0.65), 0 10px 16px -6px rgba(245, 158, 11, 0.35)',
                  '0 12px 28px -4px rgba(245, 158, 11, 0.45), 0 8px 12px -6px rgba(245, 158, 11, 0.25)',
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 border-4 border-white flex items-center justify-center cursor-pointer select-none transition-transform touch-none focus:outline-none overflow-hidden"
              aria-label="Jogar"
            >
              {/* Inner highlight */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

              {/* Shimmer gleam */}
              <motion.div
                animate={{ x: [-100, 160] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                className="absolute -inset-y-2 -inset-x-8 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-25 pointer-events-none"
              />

              {/* Big Triangle Play Icon */}
              <Play
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white fill-white ml-2 filter drop-shadow-sm group-hover:scale-105 transition-transform"
                strokeWidth={1}
              />
            </motion.button>
          </div>

          {/* Sparkles below button */}
          <div className="flex items-center gap-2 text-xl sm:text-2xl mt-2 select-none opacity-80">
            <span>✨</span>
            <span>⭐</span>
            <span>✨</span>
          </div>
        </div>
      </main>

      {/* Safe bottom spacer */}
      <div className="safe-pb h-2 w-full" />
    </div>
  );
};
