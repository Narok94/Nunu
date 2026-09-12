import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ColorData } from '../../types';

interface CreatureProps {
  colorData: ColorData;
  isHappy: boolean;
  isHovered: boolean;
  isGentleWiggle: boolean;
  onFeedDirect?: () => void;
  isTargetSelected?: boolean;
}

export const Creature: React.FC<CreatureProps> = ({
  colorData,
  isHappy,
  isHovered,
  isGentleWiggle,
  onFeedDirect,
  isTargetSelected = false,
}) => {
  // Idle blinking state: natural brief blink every 3.5-4.5s
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const interval = setInterval(() => {
      setIsBlinking(true);
      blinkTimeout = setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    }, 3500 + Math.random() * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(blinkTimeout);
    };
  }, []);

  // Determine mouth and expression states
  const isOpenMouth = isHovered || isHappy;

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Grassy Garden Mound / Ground Base where creature sits */}
      <div className="absolute -bottom-6 w-44 xs:w-52 sm:w-64 h-14 pointer-events-none flex items-center justify-center">
        {/* Soft ground shadow */}
        <div className="absolute top-2 w-36 xs:w-44 sm:w-52 h-7 bg-emerald-950/15 rounded-full blur-md" />

        {/* Organic grassy knoll patch */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-emerald-200/90 to-emerald-100/75 rounded-full border-t border-emerald-300/40 shadow-xs" />

        {/* Delicate color harmony accent in the garden (organic color cue without text) */}
        <div
          className="absolute -top-1 w-20 sm:w-24 h-5 rounded-full blur-xs opacity-40 transition-opacity"
          style={{ backgroundColor: colorData.hex }}
        />

        {/* Tiny garden details around the creature: little grass blades and blossoms */}
        <span className="absolute -left-2 bottom-3 text-xs sm:text-sm select-none opacity-85">🌱</span>
        <span className="absolute left-6 bottom-4 text-xs select-none opacity-90">🌿</span>
        {/* Blossom matching creature color theme */}
        <div
          className="absolute right-4 bottom-3 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[9px]"
          style={{ backgroundColor: colorData.hex }}
        >
          <span className="opacity-90">🌸</span>
        </div>
        <span className="absolute -right-2 bottom-2 text-xs sm:text-sm select-none opacity-85">🌼</span>
      </div>

      {/* Main Interactive Creature Body with Idle Breathing, Blinking & Feeding States */}
      <motion.div
        id={`creature-target-${colorData.id}`}
        onClick={onFeedDirect}
        animate={
          isHappy
            ? {
                scale: [1, 1.15, 0.96, 1.12, 1],
                y: [0, -18, 0, -8, 0],
                rotate: [0, -4, 4, -2, 0],
              }
            : isGentleWiggle
            ? {
                scale: [1, 1.04, 1],
                rotate: [0, -7, 7, -5, 5, 0],
                y: [0, -2, 0],
              }
            : isHovered
            ? {
                scale: 1.03,
                y: -2,
                rotate: 0,
              }
            : {
                // Gentle natural idle breathing
                scale: [1, 1.018, 1],
                y: [0, -3.5, 0],
                rotate: [0, 0.8, 0, -0.8, 0],
              }
        }
        transition={
          isHappy
            ? { duration: 0.8, ease: 'easeOut' }
            : isGentleWiggle
            ? { duration: 0.5, ease: 'easeInOut' }
            : isHovered
            ? { duration: 0.25 }
            : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className={`relative z-10 w-38 h-38 xs:w-46 xs:h-46 sm:w-54 sm:h-54 md:w-60 md:h-60 rounded-full flex items-center justify-center cursor-pointer transition-all ${
          isTargetSelected ? 'ring-4 ring-amber-300 ring-offset-4 ring-offset-emerald-100/50' : ''
        }`}
        aria-label={`Bichinho`}
      >
        {/* Happy Hearts & Sparkles Pop on Correct Feed */}
        {isHappy && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.4 }}
            animate={{ opacity: 1, y: -42, scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute -top-6 text-3xl sm:text-4xl pointer-events-none z-30 filter drop-shadow-sm"
          >
            💖 ✨ ⭐
          </motion.div>
        )}

        {/* Feeding Target Glow when food is brought over creature */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full bg-white/45 animate-pulse pointer-events-none" />
        )}

        {/* Creature Vector Illustration */}
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Ear Twitching in Idle */}
          <motion.g
            animate={
              isHovered
                ? { rotate: [-4, 4, -4] }
                : isHappy
                ? { rotate: [-10, 10, -10] }
                : { rotate: [0, 2, 0, -2, 0] }
            }
            transition={{ duration: isHappy ? 0.4 : 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '80px', originY: '40px' }}
          >
            {/* Cute Round Creature Left Ear */}
            <circle cx="36" cy="38" r="18" fill={colorData.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
            <circle cx="36" cy="38" r="10" fill="#FFFFFF" opacity="0.38" />

            {/* Cute Round Creature Right Ear */}
            <circle cx="124" cy="38" r="18" fill={colorData.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
            <circle cx="124" cy="38" r="10" fill="#FFFFFF" opacity="0.38" />
          </motion.g>

          {/* Main Round Body */}
          <circle
            cx="80"
            cy="86"
            r="58"
            fill={colorData.hex}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="2.5"
          />

          {/* Light Belly Highlight */}
          <ellipse cx="80" cy="100" rx="38" ry="32" fill="#FFFFFF" opacity="0.32" />

          {/* Rosy Cheeks */}
          <ellipse cx="44" cy="94" rx="9" ry="5.5" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="116" cy="94" rx="9" ry="5.5" fill="#FDA4AF" opacity="0.85" />

          {/* Expressive Eyes: Joyful Laughing / Natural Blink / Big Attentive */}
          {isHappy ? (
            /* Joyful laughing curved closed eyes */
            <g>
              <path
                d="M 52 78 Q 60 70 68 78"
                stroke="#1E293B"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 92 78 Q 100 70 108 78"
                stroke="#1E293B"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : isBlinking ? (
            /* Natural cute blink */
            <g>
              <line x1="52" y1="75" x2="68" y2="75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <line x1="92" y1="75" x2="108" y2="75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            /* Big, warm attentive toddler eyes */
            <g>
              {/* Left eye */}
              <ellipse cx="60" cy="74" rx="8" ry="10" fill="#1E293B" />
              <circle cx="57" cy="71" r="3.5" fill="#FFFFFF" />
              <circle cx="62" cy="77" r="1.5" fill="#FFFFFF" />

              {/* Right eye */}
              <ellipse cx="100" cy="74" rx="8" ry="10" fill="#1E293B" />
              <circle cx="97" cy="71" r="3.5" fill="#FFFFFF" />
              <circle cx="102" cy="77" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Tiny Cute Nose */}
          <ellipse cx="80" cy="84" rx="4" ry="3" fill="#1E293B" opacity="0.8" />

          {/* Expressive Mouth */}
          {isOpenMouth ? (
            /* Big Wide Open Mouth Ready for Food / Chewing */
            <g>
              <ellipse cx="80" cy="101" rx="16" ry="13" fill="#881337" stroke="#1E293B" strokeWidth="2.5" />
              {/* Cute little tongue inside */}
              <ellipse cx="80" cy="108" rx="10" ry="5.5" fill="#FB7185" />
            </g>
          ) : (
            /* Sweet calm smile */
            <path
              d="M 72 96 Q 80 104 88 96"
              stroke="#1E293B"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Little Front Paws resting comfortably on the ground */}
          <circle cx="48" cy="126" r="8" fill={colorData.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
          <circle cx="112" cy="126" r="8" fill={colorData.hex} stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
        </svg>
      </motion.div>
    </div>
  );
};

