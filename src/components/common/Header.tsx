import React from 'react';
import { Volume2, VolumeX, ShieldCheck, ArrowLeft, Home } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onOpenParentsGate: () => void;
  isGameScreen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  onOpenParentsGate,
  isGameScreen = false,
}) => {
  const [sfxEnabled, setSfxEnabled] = React.useState(() => soundManager.getSettings().soundEffects);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSoundEffects(next);
    if (next) soundManager.playPop(600);
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20">
      {/* Left Area: Back Button or App Brand */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            id="header-back-button"
            onClick={() => {
              soundManager.playPop(480);
              onBack();
            }}
            aria-label="Voltar para a tela inicial"
            className="group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/90 hover:bg-white text-stone-700 font-medium rounded-2xl border border-stone-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xs active:scale-95 transition-all cursor-pointer text-sm sm:text-base min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2] text-stone-600" />
            <span>Voltar</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-xl shadow-xs">
              ✨
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 leading-tight tracking-tight">
                Mundo da Nunu
              </h1>
              <span className="text-[11px] font-normal text-stone-400">
                2 a 5 anos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Middle: Game Title if in Game */}
      {isGameScreen && title && (
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-xs rounded-full border border-stone-200/60 shadow-xs">
          <span className="text-sm font-medium text-stone-700">{title}</span>
        </div>
      )}

      {/* Right Area: Audio Controls & Parents Gate */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* SFX Toggle */}
        <button
          id="toggle-sfx-button"
          onClick={toggleSfx}
          aria-label={sfxEnabled ? 'Desativar efeitos sonoros' : 'Ativar efeitos sonoros'}
          title={sfxEnabled ? 'Sons ativos' : 'Sons mudos'}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border shadow-xs active:scale-95 ${
            sfxEnabled
              ? 'bg-sky-50 text-sky-600 border-sky-200/70 hover:bg-sky-100/80'
              : 'bg-white/80 text-stone-400 border-stone-200/70 hover:bg-stone-100'
          }`}
        >
          {sfxEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />}
        </button>

        {/* Parent Protected Gate */}
        <button
          id="open-parent-gate-button"
          onClick={() => {
            soundManager.playPop(520);
            onOpenParentsGate();
          }}
          aria-label="Abrir Área dos Pais"
          className="flex items-center gap-1.5 px-3 h-10 sm:h-11 rounded-2xl bg-white/90 hover:bg-white text-stone-600 font-medium border border-stone-200/70 shadow-xs active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
          <span className="hidden sm:inline text-stone-600">Pais</span>
        </button>
      </div>
    </header>
  );
};
