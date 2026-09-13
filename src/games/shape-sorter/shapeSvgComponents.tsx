import React from 'react';
import { ShapeType } from './shapeTypes';

interface ShapeSvgProps {
  shape: ShapeType;
  colorHex: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

/**
 * Renders the tactile, vibrant shape block with soft highlights and bevel for toddlers.
 */
export const ShapeBlockSvg: React.FC<ShapeSvgProps> = ({
  shape,
  colorHex,
  gradientFrom,
  gradientTo,
  className = 'w-full h-full',
}) => {
  const gradientId = `grad-${shape}-${colorHex.replace('#', '')}`;

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>

        <filter id={`shadow-${gradientId}`} x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
        </filter>
      </defs>

      {shape === 'circle' && (
        <g filter={`url(#shadow-${gradientId})`}>
          <circle cx="50" cy="50" r="39" fill={`url(#${gradientId})`} stroke="#FFFFFF" strokeWidth="2.5" />
          {/* Gentle top specular gloss */}
          <ellipse cx="43" cy="32" rx="16" ry="9" fill="#FFFFFF" opacity="0.35" transform="rotate(-15 43 32)" />
        </g>
      )}

      {shape === 'square' && (
        <g filter={`url(#shadow-${gradientId})`}>
          <rect
            x="13"
            y="13"
            width="74"
            height="74"
            rx="18"
            fill={`url(#${gradientId})`}
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {/* Gentle top specular gloss */}
          <rect x="22" y="20" width="30" height="12" rx="6" fill="#FFFFFF" opacity="0.32" />
        </g>
      )}

      {shape === 'triangle' && (
        <g filter={`url(#shadow-${gradientId})`}>
          <path
            d="M 50 14 C 54 14 58 19 61 24 L 86 70 C 89 76 86 82 80 82 L 20 82 C 14 82 11 76 14 70 L 39 24 C 42 19 46 14 50 14 Z"
            fill={`url(#${gradientId})`}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gentle top specular gloss */}
          <path
            d="M 50 24 L 62 48 C 58 46 54 45 50 45 C 46 45 42 46 38 48 Z"
            fill="#FFFFFF"
            opacity="0.35"
          />
        </g>
      )}

      {shape === 'star' && (
        <g filter={`url(#shadow-${gradientId})`}>
          <path
            d="M 50 12 L 60.8 34.5 L 85.6 38.1 L 67.8 55.4 L 72 80.1 L 50 68.5 L 28 80.1 L 32.2 55.4 L 14.4 38.1 L 39.2 34.5 Z"
            fill={`url(#${gradientId})`}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gentle specular gloss */}
          <circle cx="50" cy="42" r="10" fill="#FFFFFF" opacity="0.32" />
        </g>
      )}
    </svg>
  );
};

interface CavitySvgProps {
  shape: ShapeType;
  isHovered?: boolean;
  className?: string;
}

/**
 * Renders the carved wooden cavity on the Montessori puzzle board.
 * Intentionally neutral-toned (wood inset) so the child focuses strictly on GEOMETRIC SHAPE, not color matching.
 */
export const ShapeCavitySvg: React.FC<CavitySvgProps> = ({
  shape,
  isHovered = false,
  className = 'w-full h-full',
}) => {
  const strokeColor = isHovered ? '#F59E0B' : '#BFA882';
  const strokeWidth = isHovered ? 4 : 2.5;

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Recessed wooden cavity inner shadow gradient */}
        <radialGradient id="cavityInnerGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#DFD2B4" />
          <stop offset="85%" stopColor="#C9B896" />
          <stop offset="100%" stopColor="#B3A27F" />
        </radialGradient>
      </defs>

      {shape === 'circle' && (
        <g>
          {/* Deep recessed interior */}
          <circle cx="50" cy="50" r="39" fill="url(#cavityInnerGradient)" />
          {/* Inset top inner shadow arc */}
          <path
            d="M 15 42 A 39 39 0 0 1 85 42"
            stroke="#8C7954"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Carved wooden perimeter boundary */}
          <circle
            cx="50"
            cy="50"
            r="39"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isHovered ? '4 4' : undefined}
          />
        </g>
      )}

      {shape === 'square' && (
        <g>
          {/* Deep recessed interior */}
          <rect x="13" y="13" width="74" height="74" rx="18" fill="url(#cavityInnerGradient)" />
          {/* Inset top inner shadow */}
          <path
            d="M 22 17 L 78 17"
            stroke="#8C7954"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Carved wooden perimeter boundary */}
          <rect
            x="13"
            y="13"
            width="74"
            height="74"
            rx="18"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={isHovered ? '4 4' : undefined}
          />
        </g>
      )}

      {shape === 'triangle' && (
        <g>
          {/* Deep recessed interior */}
          <path
            d="M 50 14 C 54 14 58 19 61 24 L 86 70 C 89 76 86 82 80 82 L 20 82 C 14 82 11 76 14 70 L 39 24 C 42 19 46 14 50 14 Z"
            fill="url(#cavityInnerGradient)"
            strokeLinejoin="round"
          />
          {/* Inset top inner shadow */}
          <path
            d="M 46 22 L 54 22"
            stroke="#8C7954"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Carved wooden perimeter boundary */}
          <path
            d="M 50 14 C 54 14 58 19 61 24 L 86 70 C 89 76 86 82 80 82 L 20 82 C 14 82 11 76 14 70 L 39 24 C 42 19 46 14 50 14 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeDasharray={isHovered ? '4 4' : undefined}
          />
        </g>
      )}

      {shape === 'star' && (
        <g>
          {/* Deep recessed interior */}
          <path
            d="M 50 12 L 60.8 34.5 L 85.6 38.1 L 67.8 55.4 L 72 80.1 L 50 68.5 L 28 80.1 L 32.2 55.4 L 14.4 38.1 L 39.2 34.5 Z"
            fill="url(#cavityInnerGradient)"
            strokeLinejoin="round"
          />
          {/* Inset shadow */}
          <circle cx="50" cy="38" r="8" fill="#8C7954" opacity="0.2" />
          {/* Carved wooden perimeter boundary */}
          <path
            d="M 50 12 L 60.8 34.5 L 85.6 38.1 L 67.8 55.4 L 72 80.1 L 50 68.5 L 28 80.1 L 32.2 55.4 L 14.4 38.1 L 39.2 34.5 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeDasharray={isHovered ? '4 4' : undefined}
          />
        </g>
      )}
    </svg>
  );
};
