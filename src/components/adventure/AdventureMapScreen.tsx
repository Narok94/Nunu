import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Volume2, VolumeX, ShieldCheck, Sparkles, X } from 'lucide-react';
import { TrailNode } from './TrailNode';
import { NunuAvatar } from '../common/NunuAvatar';
import { JARDIM_DA_NUNU } from '../../data/adventureData';
import { AdventureNode, UserAdventureProgress } from '../../types';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';

interface AdventureMapScreenProps {
  progress: UserAdventureProgress;
  onSelectNode: (node: AdventureNode) => void;
  onBackToWelcome: () => void;
  onOpenParentsGate: () => void;
  justCompletedNodeId?: string | null;
}

export const AdventureMapScreen: React.FC<AdventureMapScreenProps> = ({
  progress,
  onSelectNode,
  onBackToWelcome,
  onOpenParentsGate,
  justCompletedNodeId,
}) => {
  const [sfxEnabled, setSfxEnabled] = useState(() => soundManager.getSettings().soundEffects);
  const [upcomingNodeModal, setUpcomingNodeModal] = useState<AdventureNode | null>(null);
  const [isNunuHopping, setIsNunuHopping] = useState(false);

  // Trigger celebratory hop if an activity was just completed
  useEffect(() => {
    if (justCompletedNodeId) {
      setIsNunuHopping(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch {}

      const timer = setTimeout(() => {
        setIsNunuHopping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [justCompletedNodeId]);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundManager.setSoundEffects(next);
    if (next) soundManager.playPop(600);
  };

  const handleNodeClick = (node: AdventureNode) => {
    soundManager.playPop(580);
    onSelectNode(node);
  };

  // Vertical offsets for gentle undulating wave along horizontal trail
  const nodeWaveOffsets = [
    'translate-y-2',   // 0
    '-translate-y-4',  // 1
    'translate-y-3',   // 2
    '-translate-y-3',  // 3
    'translate-y-4',   // 4
    '-translate-y-2',  // 5
    'translate-y-3',   // 6
    '-translate-y-4',  // 7
    'translate-y-2',   // 8
    '-translate-y-1',  // 9
  ];

  return (
    <div className="relative h-[100dvh] w-full flex flex-col justify-between bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#FDF4FF] select-none overflow-hidden">
      {/* Garden Scenery Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Garden Sunlight */}
        <div className="absolute top-6 left-1/4 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-1/2 right-12 w-80 h-80 rounded-full bg-emerald-100/35 blur-3xl" />
        <div className="absolute bottom-6 left-10 w-80 h-80 rounded-full bg-pink-100/30 blur-3xl" />

        {/* Ambient garden butterflies & decorative nature elements */}
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-24 text-3xl opacity-75"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, -12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-20 right-32 text-2xl opacity-75"
        >
          🌸
        </motion.div>

        {/* Rolling garden grass hill spanning bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-200/50 via-emerald-100/30 to-transparent pointer-events-none rounded-t-[50%] scale-110" />
      </div>

      {/* Top Navigation Bar: Safe from notch and dynamic island */}
      <header className="relative z-30 w-full safe-px safe-pt pb-1.5 flex items-center justify-between border-b border-emerald-100/40 bg-[#F0FDF4]/80 backdrop-blur-xs">
        {/* Left: Back to Welcome / Home */}
        <button
          id="map-back-button"
          onClick={() => {
            soundManager.playPop(480);
            onBackToWelcome();
          }}
          aria-label="Voltar para tela inicial"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-700 font-medium text-xs sm:text-sm border border-stone-200/70 shadow-xs active:scale-95 transition-all cursor-pointer min-h-[40px] touch-none"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] text-stone-600" />
          <span>Início</span>
        </button>

        {/* Center: Current World Title */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 bg-white/90 rounded-full border border-emerald-200/70 shadow-xs">
          <span className="text-base">{JARDIM_DA_NUNU.emoji}</span>
          <span className="text-xs sm:text-sm font-bold text-stone-800">
            {JARDIM_DA_NUNU.name}
          </span>
        </div>

        {/* Right: Stars Total & Sound */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 font-bold text-xs sm:text-sm shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 stroke-[2]" />
            <span>{progress.starsCount}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="map-sfx-toggle"
            onClick={toggleSfx}
            aria-label="Alternar som"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95 touch-none cursor-pointer"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 stroke-[2]" /> : <VolumeX className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>
      </header>

      {/* Main Adventure Trail Content: Horizontal Scrolling Landscape Garden */}
      <main className="relative z-10 flex-1 w-full overflow-x-auto overflow-y-hidden flex items-center safe-px py-2 scroll-smooth">
        <div className="relative flex items-center gap-10 sm:gap-14 px-8 py-4 min-w-max">
          {/* Decorative Horizontal Cobblestone Winding Path SVG */}
          <div className="absolute inset-0 pointer-events-none flex items-center z-0">
            <svg
              className="w-full h-32"
              viewBox="0 0 1900 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M 20 60 Q 200 20, 380 60 T 740 60 T 1100 60 T 1460 60 T 1820 60"
                stroke="#CBD5E1"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray="6 26"
                opacity="0.5"
              />
              <path
                d="M 20 60 Q 200 20, 380 60 T 740 60 T 1100 60 T 1460 60 T 1820 60"
                stroke="#34D399"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="16 20"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Render Each of the 10 Nodes along the Horizontal Path */}
          {JARDIM_DA_NUNU.nodes.map((node, index) => {
            const isUnlocked = index <= progress.unlockedNodeIndex;
            const isCurrent = index === progress.currentNodeIndex;
            const isCompleted = progress.completedNodeIds.includes(node.id);
            const hasNunuHere = isCurrent;

            return (
              <div
                key={node.id}
                className={`relative z-10 flex flex-col items-center transition-transform ${nodeWaveOffsets[index % nodeWaveOffsets.length]}`}
              >
                {/* Nunu Companion standing on or next to the current node */}
                {hasNunuHere && (
                  <motion.div
                    layoutId="nunu-trail-avatar"
                    initial={{ scale: 0.8, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className="absolute z-30 -top-11 pointer-events-auto"
                  >
                    <NunuAvatar
                      size="sm"
                      isHopping={isNunuHopping}
                      isHappy={isNunuHopping}
                      interactive={true}
                    />
                  </motion.div>
                )}

                {/* Trail Node Button */}
                <TrailNode
                  node={node}
                  isUnlocked={isUnlocked}
                  isCurrent={isCurrent}
                  isCompleted={isCompleted}
                  hasNunu={hasNunuHere}
                  onSelect={handleNodeClick}
                />
              </div>
            );
          })}

          {/* Trail End Decor: Garden Gate / Castle at the end of the horizontal path */}
          <div className="relative z-10 flex flex-col items-center justify-center pl-6 pr-10 text-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-100/90 border-2 border-emerald-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
              🏰
            </div>
            <span className="text-xs font-bold text-emerald-800 mt-2 bg-white/90 px-3 py-0.5 rounded-full border border-emerald-200 shadow-2xs whitespace-nowrap">
              Fim do Jardim
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5 whitespace-nowrap">
              Novos mundos em breve! 🌊
            </span>
          </div>
        </div>
      </main>

      {/* Subtle bottom indicator */}
      <footer className="safe-pb pb-1 text-center text-[11px] text-stone-400 font-medium pointer-events-none">
        Arraste para o lado para ver toda a trilha ✨
      </footer>

      {/* Friendly Modal for Upcoming Activities */}
      <AnimatePresence>
        {upcomingNodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setUpcomingNodeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border border-amber-200/80 text-center flex flex-col items-center"
            >
              {/* Close Icon */}
              <button
                onClick={() => setUpcomingNodeModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Nunu Avatar */}
              <div className="mb-2">
                <NunuAvatar size="sm" isHappy={true} interactive={false} />
              </div>

              {/* Node Icon */}
              <div className="text-4xl mb-2">{upcomingNodeModal.emoji}</div>

              <h3 className="text-lg font-bold text-stone-800">
                {upcomingNodeModal.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 mt-1 mb-4 leading-relaxed">
                A Nunu está preparando esta novidade com muito carinho para você! 💛
              </p>

              <button
                onClick={() => {
                  setUpcomingNodeModal(null);
                  // Guide child back to the available game
                  const playable = JARDIM_DA_NUNU.nodes.find((n) => n.isPlayable);
                  if (playable) onSelectNode(playable);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🍎 Jogar Alimente o Bichinho</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
