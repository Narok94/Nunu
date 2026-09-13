import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShapeCavitySlot, ShapeItemData } from './shapeTypes';
import { ShapeBlockSvg, ShapeCavitySvg } from './shapeSvgComponents';

interface ShapeTargetCavityProps {
  cavity: ShapeCavitySlot;
  fittedPiece: ShapeItemData | null;
  isHovered: boolean;
  onTapCavity?: () => void;
}

export const ShapeTargetCavity: React.FC<ShapeTargetCavityProps> = ({
  cavity,
  fittedPiece,
  isHovered,
  onTapCavity,
}) => {
  return (
    <div
      id={`cavity-target-${cavity.id}`}
      onClick={onTapCavity}
      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center p-2 transition-all duration-200 select-none ${
        isHovered ? 'scale-105 filter drop-shadow-md' : ''
      }`}
      aria-label={`Encaixe para ${cavity.shape}`}
    >
      {/* Background Cavity Recess */}
      <div className="absolute inset-0">
        <ShapeCavitySvg shape={cavity.shape} isHovered={isHovered} />
      </div>

      {/* Fitted Piece (When successfully placed) */}
      <AnimatePresence>
        {fittedPiece && (
          <motion.div
            key={`fitted-${fittedPiece.id}`}
            initial={{ scale: 1.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-sm"
          >
            <ShapeBlockSvg
              shape={fittedPiece.shape}
              colorHex={fittedPiece.colorHex}
              gradientFrom={fittedPiece.gradientFrom}
              gradientTo={fittedPiece.gradientTo}
            />

            {/* Sparkle burst on snap */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0.6, 1.3, 0], opacity: [1, 0.9, 0] }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center text-2xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
