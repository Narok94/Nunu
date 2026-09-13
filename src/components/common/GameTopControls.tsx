import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface GameTopControlsProps {
  onBack: () => void;
  completedRounds: number;
  totalRounds?: number;
  onRestart: () => void;
  onOpenParentsGate?: () => void;
  sfxEnabled?: boolean;
  onToggleSfx?: () => void;
}

export const GameTopControls: React.FC<GameTopControlsProps> = ({
  onBack,
  completedRounds,
  totalRounds = 3,
  onRestart,
  onOpenParentsGate,
  sfxEnabled: customSfxEnabled,
  onToggleSfx: customOnToggleSfx,
}) => {
  const [internalSfx, setInternalSfx] = useState(() => soundManager.getSettings().soundEffects);

  const sfxActive = customSfxEnabled !== undefined ? customSfxEnabled : internalSfx;

  const handleToggleSfx = () => {
    if (customOnToggleSfx) {
      customOnToggleSfx();
    } else {
      const next = !internalSfx;
      setInternalSfx(next);
      soundManager.setSoundEffects(next);
      if (next) soundManager.playPop(600);
    }
  };

  return (
    <header className="relative z-30 w-full max-w-5xl mx-auto safe-px safe-pt pb-1.5 flex items-center justify-between">
      {/* Left: Back to Trail (Notch-safe with safe-px) */}
      <button
        id="top-back-button"
        onClick={() => {
          soundManager.playPop(480);
          onBack();
        }}
        aria-label="Voltar para a trilha"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center border border-stone-200/70 shadow-xs transition-all active:scale-95 cursor-pointer touch-none"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
      </button>

      {/* Center: Stars Progress Pill */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-amber-200/80 shadow-xs"
        aria-label={`Progresso: ${completedRounds} de ${totalRounds} rodadas`}
      >
        {Array.from({ length: totalRounds }).map((_, i) => {
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

      {/* Right: Restart, Sound, Parents Gate (Safe from Dynamic Island/Right border) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          id="top-restart-button"
          onClick={() => {
            soundManager.playPop(480);
            onRestart();
          }}
          aria-label="Reiniciar atividade"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          id="top-sound-toggle"
          onClick={handleToggleSfx}
          aria-label={sfxActive ? 'Desativar som' : 'Ativar som'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 cursor-pointer touch-none"
        >
          {sfxActive ? <Volume2 className="w-4 h-4 stroke-[2.2]" /> : <VolumeX className="w-4 h-4 stroke-[2.2]" />}
        </button>

        {onOpenParentsGate && (
          <button
            id="top-parents-gate"
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
  );
};
