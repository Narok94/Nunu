import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../audio/soundManager';

interface MascotProps {
  onInteract?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({ onInteract }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [message, setMessage] = useState('Olá! Eu sou a Nunu ✨');

  const handleMascotClick = () => {
    setIsHappy(true);
    setShowHeart(true);
    soundManager.playGiggle();
    setMessage('Que bom brincar com você! 💛');

    if (onInteract) onInteract();

    setTimeout(() => {
      setIsHappy(false);
      setShowHeart(false);
      setMessage('Escolha uma brincadeira!');
    }, 2500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-1 sm:my-3">
      {/* Delicate Speech Bubble */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative mb-2.5 px-4 py-1.5 bg-white/95 backdrop-blur-xs rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-amber-100 text-stone-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 select-none"
      >
        <span>{message}</span>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-amber-100" />
      </motion.div>

      {/* Floating Hearts / Stars on Gentle Tap */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.6 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute -top-6 text-2xl sm:text-3xl pointer-events-none z-30 filter drop-shadow-xs"
          >
            🌸 ✨ 💖
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Body - Nunu */}
      <motion.button
        id="mascot-interactive"
        onClick={handleMascotClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={{
          y: isHappy ? [0, -10, 0, -6, 0] : [0, -3, 0],
        }}
        transition={{
          y: isHappy ? { duration: 0.5, repeat: 1 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-32 h-32 sm:w-40 sm:h-40 cursor-pointer focus:outline-none rounded-full select-none"
        aria-label="Mascote Nunu. Toque para interagir!"
      >
        {/* Soft delicate shadow below */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-4 bg-stone-900/6 rounded-full blur-sm pointer-events-none" />

        {/* Mascot SVG Vector Illustration - Premium & Delicate */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nunuBodyGrad" x1="100" y1="50" x2="100" y2="174" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="nunuBellyGrad" x1="100" y1="100" x2="100" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEF9C3" />
            </linearGradient>
          </defs>

          {/* Left Ear */}
          <motion.g
            animate={{ rotate: isHappy ? [-12, 4, -12] : [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ transformOrigin: '56px 68px' }}
          >
            <ellipse
              cx="54"
              cy="58"
              rx="22"
              ry="30"
              transform="rotate(-20 54 58)"
              fill="#FDE047"
              stroke="#A16207"
              strokeWidth="2.5"
            />
            <ellipse cx="54" cy="60" rx="13" ry="18" transform="rotate(-20 54 60)" fill="#FDE68A" />
            <ellipse cx="54" cy="61" rx="8" ry="12" transform="rotate(-20 54 61)" fill="#FBCFE8" opacity="0.8" />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{ rotate: isHappy ? [12, -4, 12] : [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ transformOrigin: '144px 68px' }}
          >
            <ellipse
              cx="146"
              cy="58"
              rx="22"
              ry="30"
              transform="rotate(20 146 58)"
              fill="#FDE047"
              stroke="#A16207"
              strokeWidth="2.5"
            />
            <ellipse cx="146" cy="60" rx="13" ry="18" transform="rotate(20 146 60)" fill="#FDE68A" />
            <ellipse cx="146" cy="61" rx="8" ry="12" transform="rotate(20 146 61)" fill="#FBCFE8" opacity="0.8" />
          </motion.g>

          {/* Head & Body */}
          <ellipse
            cx="100"
            cy="114"
            rx="66"
            ry="60"
            fill="url(#nunuBodyGrad)"
            stroke="#A16207"
            strokeWidth="2.5"
          />

          {/* Soft Belly Patch */}
          <ellipse cx="100" cy="128" rx="38" ry="32" fill="url(#nunuBellyGrad)" />

          {/* Delicate Rosy Cheeks */}
          <ellipse cx="64" cy="116" rx="10" ry="6" fill="#FB7185" opacity="0.5" />
          <ellipse cx="136" cy="116" rx="10" ry="6" fill="#FB7185" opacity="0.5" />

          {/* Sparkling Eyes */}
          {isHappy ? (
            /* Joyful Closed Eyes */
            <>
              <path
                d="M 70 98 Q 80 88 90 98"
                stroke="#573014"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 110 98 Q 120 88 130 98"
                stroke="#573014"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            /* Soft Cartoon Toddler Eyes */
            <>
              <ellipse cx="80" cy="96" rx="9" ry="11" fill="#45220C" />
              <circle cx="77" cy="92" r="4" fill="#FFFFFF" />
              <circle cx="83" cy="99" r="1.8" fill="#FFFFFF" />

              <ellipse cx="120" cy="96" rx="9" ry="11" fill="#45220C" />
              <circle cx="117" cy="92" r="4" fill="#FFFFFF" />
              <circle cx="123" cy="99" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Little Button Nose */}
          <ellipse cx="100" cy="107" rx="5" ry="3.5" fill="#92400E" />

          {/* Gentle Smile */}
          {isHappy ? (
            <path
              d="M 90 115 Q 100 132 110 115 Z"
              fill="#F43F5E"
              stroke="#573014"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M 92 114 Q 100 124 108 114"
              stroke="#573014"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Paws */}
          <motion.ellipse
            cx="48"
            cy="138"
            rx="12"
            ry="9"
            fill="#FDE047"
            stroke="#A16207"
            strokeWidth="2"
            animate={{ rotate: isHappy ? [-15, 15, -15] : 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.ellipse
            cx="152"
            cy="138"
            rx="12"
            ry="9"
            fill="#FDE047"
            stroke="#A16207"
            strokeWidth="2"
            animate={{ rotate: isHappy ? [15, -15, 15] : 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        </svg>
      </motion.button>
    </div>
  );
};
