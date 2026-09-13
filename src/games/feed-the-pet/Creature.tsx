import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ColorData } from '../../types';

interface CreatureProps {
  colorData: ColorData;
  isHappy: boolean;
  isHovered: boolean;
  isGentleWiggle: boolean;
  isCelebrating?: boolean;
  onFeedDirect?: () => void;
  isTargetSelected?: boolean;
}

export const Creature: React.FC<CreatureProps> = ({
  colorData,
  isHappy,
  isHovered,
  isGentleWiggle,
  isCelebrating = false,
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
  const isOpenMouth = isHovered || isHappy || isCelebrating;
  const isCurious = isGentleWiggle;

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Grassy Garden Mound / Ground Base where creature sits */}
      <div className="absolute -bottom-4 sm:-bottom-5 w-28 sm:w-34 md:w-40 h-8 sm:h-10 pointer-events-none flex items-center justify-center">
        {/* Soft ground shadow */}
        <div className="absolute top-1 w-24 sm:w-30 h-4 sm:h-5 bg-emerald-950/15 rounded-full blur-md" />

        {/* Organic grassy knoll patch */}
        <div className="absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-emerald-200/90 to-emerald-100/75 rounded-full border-t border-emerald-300/40 shadow-xs" />

        {/* Delicate color harmony accent in the garden (organic color cue without text) */}
        <div
          className="absolute -top-1 w-16 sm:w-22 h-4 sm:h-5 rounded-full blur-xs opacity-40 transition-opacity"
          style={{ backgroundColor: colorData.hex }}
        />

        {/* Tiny garden details around the creature: little grass blades and blossoms */}
        <span className="absolute -left-1 sm:-left-2 bottom-2 sm:bottom-3 text-[10px] sm:text-sm select-none opacity-85">🌱</span>
        <span className="absolute left-4 sm:left-6 bottom-3 sm:bottom-4 text-[10px] sm:text-xs select-none opacity-90">🌿</span>
        {/* Blossom matching creature color theme */}
        <div
          className="absolute right-3 sm:right-4 bottom-2 sm:bottom-3 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[8px] sm:text-[9px]"
          style={{ backgroundColor: colorData.hex }}
        >
          <span className="opacity-90">🌸</span>
        </div>
        <span className="absolute -right-1 sm:-right-2 bottom-1.5 sm:bottom-2 text-[10px] sm:text-sm select-none opacity-85">🌼</span>
      </div>

      {/* Main Interactive Creature Body with Idle Breathing, Blinking, Feeding & Celebration States */}
      <motion.div
        id={`creature-target-${colorData.id}`}
        onClick={onFeedDirect}
        animate={
          isHappy
            ? {
                scale: [1, 1.06, 1],
                y: [0, -4, 0],
                rotate: 0,
              }
            : isCelebrating
            ? {
                scale: [1, 1.06, 1],
                y: [0, -6, 0],
                rotate: [0, -2, 2, 0],
              }
            : isGentleWiggle
            ? {
                scale: [1, 1.02, 1],
                rotate: [0, -3, 3, -1, 0],
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
                scale: [1, 1.015, 1],
                y: [0, -2.5, 0],
                rotate: [0, 0.6, 0, -0.6, 0],
              }
        }
        transition={
          isHappy
            ? { duration: 0.35, ease: 'easeOut' }
            : isCelebrating
            ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
            : isGentleWiggle
            ? { duration: 0.35, ease: 'easeInOut' }
            : isHovered
            ? { duration: 0.2 }
            : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
          isTargetSelected ? 'ring-4 ring-amber-300 ring-offset-4 ring-offset-emerald-100/50' : ''
        }`}
        aria-label={`Bichinho`}
      >
        {/* Happy Hearts & Sparkles Pop on Correct Feed (subtle and short) */}
        {isHappy && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -24, scale: [0.6, 1.1, 1.1, 0.9] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute -top-4 text-2xl sm:text-3xl pointer-events-none z-30 filter drop-shadow-xs"
          >
            💖 ✨ ⭐
          </motion.div>
        )}

        {/* Celebration Stars when all foods are completed */}
        {isCelebrating && (
          <motion.div
            animate={{ y: [-2, -8, -2], opacity: [0.85, 1, 0.85], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 text-2xl sm:text-3xl pointer-events-none z-30 filter drop-shadow-xs"
          >
            ✨ ⭐ ✨
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
          {/* Animated Ear Twitching */}
          <motion.g
            animate={
              isHovered
                ? { rotate: [-4, 4, -4] }
                : isHappy || isCelebrating
                ? { rotate: [-10, 10, -10] }
                : isGentleWiggle
                ? { rotate: [-8, 2, -8] }
                : { rotate: [0, 2, 0, -2, 0] }
            }
            transition={{ duration: isHappy || isCelebrating ? 0.4 : 3, repeat: Infinity, ease: 'easeInOut' }}
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

          {/* Expressive Eyes: Joyful / Curious / Blink / Attentive */}
          {isHappy || isCelebrating ? (
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
          ) : isCurious ? (
            /* Curious inquiring eyes (wondering and friendly) */
            <g>
              {/* Left eye curious wide */}
              <ellipse cx="60" cy="73" rx="8.5" ry="9.5" fill="#1E293B" />
              <circle cx="58" cy="71" r="3.5" fill="#FFFFFF" />
              <circle cx="63" cy="75" r="1.5" fill="#FFFFFF" />

              {/* Right eye wondering slightly tilted */}
              <ellipse cx="100" cy="75" rx="7.5" ry="8" fill="#1E293B" />
              <circle cx="98" cy="73" r="3" fill="#FFFFFF" />
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
          ) : isCurious ? (
            /* Small curious inquisitive mouth */
            <circle cx="80" cy="98" r="4.5" fill="#1E293B" />
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

