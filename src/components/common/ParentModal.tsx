import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, WifiOff, HeartHandshake, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress?: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
}) => {
  // Parental gate challenge
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [userAnswer, setUserAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [sfx, setSfx] = useState(() => soundManager.getSettings().soundEffects);

  // Generate new math problem whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const a = Math.floor(Math.random() * 5) + 3;
      const b = Math.floor(Math.random() * 5) + 2;
      setNum1(a);
      setNum2(b);
      setUserAnswer('');
      setIsUnlocked(false);
      setErrorMessage('');
      setSfx(soundManager.getSettings().soundEffects);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = num1 + num2;
    if (parseInt(userAnswer.trim(), 10) === expected) {
      setIsUnlocked(true);
      setErrorMessage('');
      soundManager.playSuccessChime();
    } else {
      setErrorMessage('Resposta incorreta. Tente novamente!');
      soundManager.playSoftBoing();
    }
  };

  const handleClose = () => {
    soundManager.playPop(480);
    onClose();
  };

  return (
    <div
      id="parent-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.08)] border border-stone-200/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-parent-modal-button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 flex items-center justify-center text-stone-500 transition-all cursor-pointer"
          aria-label="Fechar área dos pais"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* Locked State - Toddler Gate */
          <div className="text-center py-3">
            <div className="w-14 h-14 mx-auto mb-3 bg-amber-100/70 text-amber-700 rounded-2xl flex items-center justify-center border border-amber-200/60 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-1.5">
              Área Exclusiva para os Pais
            </h2>
            <p className="text-stone-500 mb-5 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Para segurança dos pequenos, resolva a conta matemática simples:
            </p>

            <form onSubmit={handleVerifyAnswer} className="space-y-3.5 max-w-xs mx-auto">
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70">
                <span className="text-2xl font-bold text-amber-900 tracking-wide">
                  {num1} + {num2} = ?
                </span>
              </div>

              <input
                id="parent-gate-input"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Resposta"
                className="w-full text-center text-xl font-semibold py-2.5 px-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
              />

              {errorMessage && (
                <p className="text-xs font-medium text-rose-500">{errorMessage}</p>
              )}

              <button
                id="parent-gate-submit-button"
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base rounded-xl shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Parent Dashboard */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
                  Painel de Segurança & Guia dos Pais
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Ambiente protegido para crianças de 2 a 5 anos
                </p>
              </div>
            </div>

            {/* Child Safety Commitments */}
            <div className="space-y-3 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Compromissos de Proteção Infantil
              </h3>
              <ul className="text-xs sm:text-sm text-emerald-900 space-y-1.5 list-disc list-inside ml-1">
                <li><strong>100% Livre de Anúncios:</strong> Nenhuma publicidade ou pop-up.</li>
                <li><strong>Sem Compras no App:</strong> Nenhuma cobrança durante as brincadeiras.</li>
                <li><strong>Sem Links Externos:</strong> A criança não é direcionada para a web.</li>
                <li><strong>Funciona Offline:</strong> Áudios sintetizados e jogos locais sem internet.</li>
              </ul>
            </div>

            {/* Audio Preferences */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-800 text-sm">Controle de Áudio</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                  <Volume2 className="w-5 h-5 text-amber-600" />
                  <span>Efeitos Sonoros (Pop, Aplausos)</span>
                </div>
                <input
                  type="checkbox"
                  checked={sfx}
                  onChange={(e) => {
                    setSfx(e.target.checked);
                    soundManager.setSoundEffects(e.target.checked);
                  }}
                  className="w-6 h-6 rounded text-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Pedagogical info */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Pedagogia do Aplicativo
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Desenvolvido com base no reforço positivo e aprendizagem sem frustração. Tentativas incorretas não punem e não tiram pontos; apenas convidam a criança a tentar com calma até encontrar a cor correspondente.
              </p>
            </div>

            {onResetProgress && (
              <button
                id="reset-progress-button"
                onClick={() => {
                  onResetProgress();
                  soundManager.playPop(500);
                  setIsUnlocked(false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold rounded-2xl border border-stone-300 transition-all cursor-pointer"
              >
                Reiniciar estrelas da sessão
              </button>
            )}

            <button
              id="close-parent-gate-dashboard-button"
              onClick={handleClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl shadow-sm border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            >
              Voltar ao Jogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
