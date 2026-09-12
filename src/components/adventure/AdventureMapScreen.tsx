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
    const isUnlocked = node.order <= progress.unlockedNodeIndex;

    if (!isUnlocked) {
      soundManager.playSoftBoing();
      return;
    }

    if (node.isPlayable) {
      soundManager.playPop(580);
      onSelectNode(node);
    } else {
      // Placeholder activity for future expansion
      soundManager.playPop(520);
      setUpcomingNodeModal(node);
    }
  };

  // Node horizontal offset percentages to create the winding S-curve
  const nodeAlignments = [
    'justify-center',      // Node 0: Center
    'justify-end pr-6 sm:pr-14', // Node 1: Right
    'justify-start pl-6 sm:pl-14', // Node 2: Left
    'justify-end pr-8 sm:pr-16',   // Node 3: Right
    'justify-start pl-8 sm:pl-16', // Node 4: Left
    'justify-center',      // Node 5: Center
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#F0FDF4] via-[#FEFCE8] to-[#FDF4FF] select-none overflow-x-hidden pb-16">
      {/* Garden Scenery Background Visuals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Garden Sunlight */}
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-1/2 right-4 w-80 h-80 rounded-full bg-emerald-100/35 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-pink-100/30 blur-3xl" />

        {/* Ambient garden butterflies & decorative nature elements */}
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-36 left-4 text-3xl opacity-75"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-96 right-4 text-2xl opacity-75"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-48 left-6 text-2xl opacity-70"
        >
          🐞
        </motion.div>
      </div>

      {/* Top Navigation Bar: Clean, Toddler-Safe, Informative */}
      <header className="sticky top-0 z-30 w-full max-w-lg mx-auto px-4 py-3 bg-[#F0FDF4]/90 backdrop-blur-md flex items-center justify-between border-b border-emerald-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Left: Back to Welcome / Home */}
        <button
          id="map-back-button"
          onClick={() => {
            soundManager.playPop(480);
            onBackToWelcome();
          }}
          aria-label="Voltar para tela inicial"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-stone-700 font-medium text-xs sm:text-sm border border-stone-200/70 shadow-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] text-stone-600" />
          <span>Início</span>
        </button>

        {/* Center: Current World Title */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full border border-emerald-200/60 shadow-xs">
          <span className="text-base">{JARDIM_DA_NUNU.emoji}</span>
          <span className="text-xs sm:text-sm font-bold text-stone-800">
            {JARDIM_DA_NUNU.name}
          </span>
        </div>

        {/* Right: Stars Total & Sound */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 font-bold text-xs sm:text-sm shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 stroke-[2]" />
            <span>{progress.starsCount}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="map-sfx-toggle"
            onClick={toggleSfx}
            aria-label="Alternar som"
            className="w-8 h-8 rounded-full bg-white/90 text-stone-600 flex items-center justify-center border border-stone-200/60 shadow-xs active:scale-95"
          >
            {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 stroke-[2]" /> : <VolumeX className="w-3.5 h-3.5 stroke-[2]" />}
          </button>
        </div>
      </header>

      {/* Main Adventure Trail Content */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 flex-1 flex flex-col pt-4">
        {/* World Welcome Banner */}
        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm font-medium text-stone-600 bg-white/80 inline-block px-4 py-1 rounded-full border border-emerald-200/60 shadow-xs">
            Siga a trilha e brinque com a Nunu! 🌻
          </p>
        </div>

        {/* Vertical Winding Trail */}
        <div className="relative flex flex-col gap-10 sm:gap-12 my-2 py-4">
          {/* Decorative Path Stones Connecting Nodes */}
          <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 380 960"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Soft Garden Cobblestone Trail */}
              <path
                d="M 190 60 C 260 120, 290 160, 290 220 C 290 280, 100 320, 100 390 C 100 460, 290 500, 290 570 C 290 640, 100 680, 100 750 C 100 820, 190 870, 190 920"
                stroke="#CBD5E1"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="4 22"
                opacity="0.45"
              />
              <path
                d="M 190 60 C 260 120, 290 160, 290 220 C 290 280, 100 320, 100 390 C 100 460, 290 500, 290 570 C 290 640, 100 680, 100 750 C 100 820, 190 870, 190 920"
                stroke="#34D399"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="14 18"
                opacity="0.75"
              />
            </svg>
          </div>

          {/* Render Each Node along the Trail */}
          {JARDIM_DA_NUNU.nodes.map((node, index) => {
            const isUnlocked = index <= progress.unlockedNodeIndex;
            const isCurrent = index === progress.currentNodeIndex;
            const isCompleted = progress.completedNodeIds.includes(node.id);
            const hasNunuHere = isCurrent;

            return (
              <div
                key={node.id}
                className={`relative z-10 flex items-center ${nodeAlignments[index % nodeAlignments.length]}`}
              >
                {/* Nunu Companion standing on or next to the current node */}
                {hasNunuHere && (
                  <motion.div
                    initial={{ scale: 0.8, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className={`absolute z-30 ${
                      index % 2 === 1 ? '-left-6 sm:left-2' : '-right-6 sm:right-2'
                    } -top-12 pointer-events-auto`}
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
        </div>

        {/* Trail End Decor: Garden Gate / Castle */}
        <div className="text-center my-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs">
            🏰
          </div>
          <span className="text-xs font-semibold text-emerald-800 mt-2 bg-white/80 px-3 py-1 rounded-full border border-emerald-200">
            Fim do Jardim da Nunu
          </span>
          <span className="text-[11px] text-stone-500 mt-1">
            Novos mundos em breve! 🌊 🦕
          </span>
        </div>
      </main>

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
