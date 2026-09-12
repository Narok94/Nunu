import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../audio/soundManager';

interface NunuAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isHappy?: boolean;
  isHopping?: boolean;
  speechText?: string | null;
  interactive?: boolean;
  showShadow?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-14 h-14',
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36 sm:w-44 sm:h-44',
  xl: 'w-48 h-48 sm:w-56 sm:h-56',
};

export const NunuAvatar: React.FC<NunuAvatarProps> = ({
  size = 'md',
  isHappy: controlledHappy,
  isHopping = false,
  interactive = true,
  showShadow = true,
  onClick,
  className = '',
}) => {
  const [internalHappy, setInternalHappy] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const isHappy = controlledHappy !== undefined ? controlledHappy : internalHappy;

  const handleClick = () => {
    if (!interactive) return;

    setInternalHappy(true);
    setShowHearts(true);
    // Sound effect only (gentle giggle chime), NO synthetic voice
    soundManager.playGiggle();

    onClick?.();

    setTimeout(() => {
      setInternalHappy(false);
      setShowHearts(false);
    }, 2200);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Floating Sparkles/Hearts when happy */}
      <AnimatePresence>
        {showHearts && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -45, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute -top-10 text-2xl sm:text-3xl pointer-events-none z-50 filter drop-shadow-xs"
          >
            🌸 ✨ 💖
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nunu Animated Container: Silent animations with sway, breathing, and occasional gentle hop */}
      <motion.div
        animate={
          isHopping
            ? {
                y: [0, -22, 0, -14, 0],
                rotate: [-4, 4, -4, 2, 0],
                scale: [1, 1.08, 0.95, 1.04, 1],
              }
            : isHappy
            ? {
                y: [0, -14, 0, -8, 0],
                rotate: [-3, 3, -2, 0],
                scale: [1, 1.06, 1],
              }
            : {
                // Sway gently, breath, and give an occasional cute little hop
                y: [0, -3, 0, -10, 0, -2, 0],
                rotate: [0, -1.8, 0, 1.8, 0],
                scale: [1, 1.01, 1, 1.04, 1, 1.01, 1],
              }
        }
        transition={
          isHopping
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : isHappy
            ? { duration: 0.6, repeat: 1, ease: 'easeInOut' }
            : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
        }
        whileHover={interactive ? { scale: 1.04 } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
        onClick={handleClick}
        className={`relative ${SIZE_MAP[size]} cursor-${interactive ? 'pointer' : 'default'} focus:outline-none select-none`}
        role={interactive ? 'button' : undefined}
        aria-label="Mascote Nunu"
      >
        {/* Soft shadow */}
        {showShadow && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-3.5 bg-stone-900/8 rounded-full blur-[3px] pointer-events-none" />
        )}

        {/* Vector SVG Character */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nunuBodyGradGlobal" x1="100" y1="50" x2="100" y2="174" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="nunuBellyGradGlobal" x1="100" y1="100" x2="100" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FEF9C3" />
            </linearGradient>
          </defs>

          {/* Left Ear */}
          <motion.g
            animate={{ rotate: isHappy || isHopping ? [-12, 6, -12] : [0, -4, 0] }}
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
            <ellipse cx="54" cy="61" rx="8" ry="12" transform="rotate(-20 54 61)" fill="#FBCFE8" opacity="0.85" />
          </motion.g>

          {/* Right Ear */}
          <motion.g
            animate={{ rotate: isHappy || isHopping ? [12, -6, 12] : [0, 4, 0] }}
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
            <ellipse cx="146" cy="61" rx="8" ry="12" transform="rotate(20 146 61)" fill="#FBCFE8" opacity="0.85" />
          </motion.g>

          {/* Head & Body */}
          <ellipse
            cx="100"
            cy="114"
            rx="66"
            ry="60"
            fill="url(#nunuBodyGradGlobal)"
            stroke="#A16207"
            strokeWidth="2.5"
          />

          {/* Soft Belly Patch */}
          <ellipse cx="100" cy="128" rx="38" ry="32" fill="url(#nunuBellyGradGlobal)" />

          {/* Delicate Rosy Cheeks */}
          <ellipse cx="64" cy="116" rx="10" ry="6" fill="#FB7185" opacity="0.6" />
          <ellipse cx="136" cy="116" rx="10" ry="6" fill="#FB7185" opacity="0.6" />

          {/* Sparkling Eyes with natural periodic blink */}
          {isHappy || isHopping ? (
            /* Joyful Closed Smile Eyes */
            <>
              <path
                d="M 70 98 Q 80 87 90 98"
                stroke="#573014"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 110 98 Q 120 87 130 98"
                stroke="#573014"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            /* Warm Toddler Eyes with gentle periodic blink */
            <motion.g
              animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                times: [0, 0.88, 0.92, 0.96, 1],
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '100px 96px' }}
            >
              <ellipse cx="80" cy="96" rx="9" ry="11" fill="#45220C" />
              <circle cx="77" cy="92" r="4" fill="#FFFFFF" />
              <circle cx="83" cy="99" r="2" fill="#FFFFFF" />

              <ellipse cx="120" cy="96" rx="9" ry="11" fill="#45220C" />
              <circle cx="117" cy="92" r="4" fill="#FFFFFF" />
              <circle cx="123" cy="99" r="2" fill="#FFFFFF" />
            </motion.g>
          )}

          {/* Little Button Nose */}
          <ellipse cx="100" cy="107" rx="5" ry="3.5" fill="#92400E" />

          {/* Gentle Smile */}
          {isHappy || isHopping ? (
            <path
              d="M 90 115 Q 100 134 110 115 Z"
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

          {/* Cute Flower on Ear */}
          <g transform="translate(132, 70)">
            <circle cx="0" cy="-5" r="4" fill="#F472B6" />
            <circle cx="5" cy="0" r="4" fill="#F472B6" />
            <circle cx="0" cy="5" r="4" fill="#F472B6" />
            <circle cx="-5" cy="0" r="4" fill="#F472B6" />
            <circle cx="0" cy="0" r="3.5" fill="#FDE047" />
          </g>

          {/* Left Paw */}
          <motion.ellipse
            cx="48"
            cy="138"
            rx="12"
            ry="9"
            fill="#FDE047"
            stroke="#A16207"
            strokeWidth="2"
            animate={{ rotate: isHappy || isHopping ? [-18, 18, -18] : 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />

          {/* Right Paw */}
          <motion.ellipse
            cx="152"
            cy="138"
            rx="12"
            ry="9"
            fill="#FDE047"
            stroke="#A16207"
            strokeWidth="2"
            animate={{ rotate: isHappy || isHopping ? [18, -18, 18] : 0 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};
