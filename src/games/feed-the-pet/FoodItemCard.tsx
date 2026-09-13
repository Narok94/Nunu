import React, { useState, useRef, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { ColorId, FoodItemData } from '../../types';
import { soundManager } from '../../audio/soundManager';

export interface CreatureTarget {
  id: ColorId;
  rect: DOMRect;
}

interface FoodItemCardProps {
  food: FoodItemData;
  isSelected: boolean;
  onSelect: (food: FoodItemData) => void;
  getCreatureTargets: () => CreatureTarget[];
  getCreatureMouth: (colorId: ColorId) => { x: number; y: number } | null;
  onHoverTarget: (colorId: ColorId | null) => void;
  onDropCorrect: (food: FoodItemData, creatureColorId: ColorId) => void;
  onDropWrong: (wrongColorId: ColorId) => void;
  onDragStateChange?: (foodId: string | null) => void;
  isLocked?: boolean;
}

// Toddler interaction constants
const DRAG_OFFSET_Y = 20; // 20px above finger so food stays visible and comfortable
const DRAG_THRESHOLD = 7; // 7px movement threshold before converting touch to drag
const DRAG_SCALE = 1.05; // Subtle scale 1.05 during drag
const EATEN_DURATION = 160; // Smooth 160ms animation directly into mouth upon correct drop
const RETURN_DURATION = 200; // Smooth 200ms return animation upon wrong drop or cancellation

const FoodItemCardComponent: React.FC<FoodItemCardProps> = ({
  food,
  isSelected,
  onSelect,
  getCreatureTargets,
  getCreatureMouth,
  onHoverTarget,
  onDropCorrect,
  onDropWrong,
  onDragStateChange,
  isLocked = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const hoveredTargetRef = useRef<ColorId | null>(null);
  const isAnimatingRef = useRef(false);

  // Pre-cached creature target bounds (zero getBoundingClientRect calls during pointermove)
  const cachedTargetsRef = useRef<CreatureTarget[]>([]);

  // RAF synchronization for 60/120fps display updates
  const rafIdRef = useRef<number | null>(null);

  // Active pointer session tracking (stores only coordinates, zero React state re-renders on move)
  const sessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    latestX: number;
    latestY: number;
    isDragging: boolean;
  } | null>(null);

  // Direct visual transform update batching via requestAnimationFrame
  const updateDragVisual = useCallback(() => {
    rafIdRef.current = null;
    const session = sessionRef.current;
    if (!session || !session.isDragging || isAnimatingRef.current) return;

    const currentX = session.latestX;
    const currentY = session.latestY - DRAG_OFFSET_Y;

    // Direct hardware-accelerated transform via element ref (no React component re-render)
    const el = dragElementRef.current;
    if (el) {
      el.style.transform = `translate3d(${currentX - 44}px, ${currentY - 44}px, 0) scale(${DRAG_SCALE})`;
    }

    // Fast pure-math collision check against pre-cached creature target rects (no layout thrashing)
    const pad = 44;
    let hitColor: ColorId | null = null;
    for (let i = 0; i < cachedTargetsRef.current.length; i++) {
      const target = cachedTargetsRef.current[i];
      const r = target.rect;
      if (
        currentX >= r.left - pad &&
        currentX <= r.right + pad &&
        currentY >= r.top - pad &&
        currentY <= r.bottom + pad
      ) {
        hitColor = target.id;
        break;
      }
    }

    const matchingColor = hitColor === food.colorId ? hitColor : null;
    if (hoveredTargetRef.current !== matchingColor) {
      hoveredTargetRef.current = matchingColor;
      onHoverTarget(matchingColor);
    }
  }, [food.colorId, onHoverTarget]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary pointer (finger or left-click)
    if (!e.isPrimary && e.button !== 0) return;
    if (isLocked || isAnimatingRef.current) return;

    e.preventDefault();

    const slot = slotRef.current;
    if (!slot) return;

    try {
      slot.setPointerCapture(e.pointerId);
    } catch {}

    // Cache target rects once on pointer down so pointermove never triggers getBoundingClientRect
    cachedTargetsRef.current = getCreatureTargets();

    sessionRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      latestX: e.clientX,
      latestY: e.clientY,
      isDragging: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId || isAnimatingRef.current) return;

    e.preventDefault();

    session.latestX = e.clientX;
    session.latestY = e.clientY;

    // Distinguish initial tap from real drag
    if (!session.isDragging) {
      const distance = Math.hypot(e.clientX - session.startX, e.clientY - session.startY);
      if (distance >= DRAG_THRESHOLD) {
        session.isDragging = true;

        // Synchronously mount portal element directly on body
        flushSync(() => {
          setIsDragging(true);
        });

        onDragStateChange?.(food.id);

        const el = dragElementRef.current;
        if (el) {
          el.style.transition = 'none';
          el.style.opacity = '1';
          const currentX = e.clientX;
          const currentY = e.clientY - DRAG_OFFSET_Y;
          el.style.transform = `translate3d(${currentX - 44}px, ${currentY - 44}px, 0) scale(${DRAG_SCALE})`;
        }
      } else {
        return;
      }
    }

    // Schedule RAF update for the next display frame (smooth 60/120fps, zero lag)
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(updateDragVisual);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    // Cancel any pending RAF frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (hoveredTargetRef.current) {
      hoveredTargetRef.current = null;
      onHoverTarget(null);
    }

    // Case A: Tap without drag
    if (!session.isDragging) {
      sessionRef.current = null;
      soundManager.playPop(520);
      onSelect(food);
      return;
    }

    // Case B: Drag release
    const releaseX = e.clientX;
    const releaseY = e.clientY - DRAG_OFFSET_Y;

    // Find dropped creature target
    const pad = 44;
    let targetColorId: ColorId | null = null;
    for (let i = 0; i < cachedTargetsRef.current.length; i++) {
      const target = cachedTargetsRef.current[i];
      const r = target.rect;
      if (
        releaseX >= r.left - pad &&
        releaseX <= r.right + pad &&
        releaseY >= r.top - pad &&
        releaseY <= r.bottom + pad
      ) {
        targetColorId = target.id;
        break;
      }
    }

    const el = dragElementRef.current;

    if (targetColorId === food.colorId) {
      // Correct creature drop: smooth 160ms animation directly into mouth using transform + opacity
      isAnimatingRef.current = true;
      const mouth = getCreatureMouth(targetColorId) || { x: releaseX, y: releaseY - 30 };

      if (el) {
        el.style.transition = `transform ${EATEN_DURATION}ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity ${EATEN_DURATION - 20}ms ease-out`;
        el.style.transform = `translate3d(${mouth.x - 44}px, ${mouth.y - 44}px, 0) scale(0.08)`;
        el.style.opacity = '0';
      }

      setTimeout(() => {
        isAnimatingRef.current = false;
        sessionRef.current = null;
        setIsDragging(false);
        onDragStateChange?.(null);
        onDropCorrect(food, targetColorId!);
      }, EATEN_DURATION);
    } else {
      // Wrong drop / dropped on ground: smooth return animation to slot (200ms)
      isAnimatingRef.current = true;

      const slot = slotRef.current;
      const slotRect = slot?.getBoundingClientRect();
      const slotCenterX = slotRect ? slotRect.left + slotRect.width / 2 : releaseX;
      const slotCenterY = slotRect ? slotRect.top + slotRect.height / 2 : releaseY;

      if (el) {
        el.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
        el.style.transform = `translate3d(${slotCenterX - 44}px, ${slotCenterY - 44}px, 0) scale(1)`;
      }

      if (targetColorId && targetColorId !== food.colorId) {
        onDropWrong(targetColorId);
      }

      setTimeout(() => {
        isAnimatingRef.current = false;
        sessionRef.current = null;
        setIsDragging(false);
        onDragStateChange?.(null);
      }, RETURN_DURATION);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (hoveredTargetRef.current) {
      hoveredTargetRef.current = null;
      onHoverTarget(null);
    }

    if (!session.isDragging) {
      sessionRef.current = null;
      return;
    }

    isAnimatingRef.current = true;
    const slot = slotRef.current;
    const slotRect = slot?.getBoundingClientRect();
    const slotCenterX = slotRect ? slotRect.left + slotRect.width / 2 : e.clientX;
    const slotCenterY = slotRect ? slotRect.top + slotRect.height / 2 : e.clientY;
    const el = dragElementRef.current;

    if (el) {
      el.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      el.style.transform = `translate3d(${slotCenterX - 44}px, ${slotCenterY - 44}px, 0) scale(1)`;
    }

    setTimeout(() => {
      isAnimatingRef.current = false;
      sessionRef.current = null;
      setIsDragging(false);
      onDragStateChange?.(null);
    }, RETURN_DURATION);
  };

  return (
    <div
      ref={slotRef}
      id={`food-item-slot-${food.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing flex-shrink-0"
      aria-label="Alimento"
    >
      {/* Soft ground shadow where the food rests in the garden */}
      <div
        className={`absolute bottom-1.5 w-12 sm:w-14 h-3.5 bg-emerald-950/20 rounded-full blur-xs transition-opacity pointer-events-none ${
          isDragging ? 'opacity-25 scale-75' : 'opacity-100'
        }`}
      />

      {/* Gentle nesting ring when item is tapped/selected */}
      {isSelected && !isDragging && (
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-amber-300/30 border-2 border-amber-400 pointer-events-none"
        />
      )}

      {/* Resting food illustration in slot (hidden while dragged) */}
      <div
        className={`relative z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center select-none pointer-events-none ${
          isDragging ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-5xl sm:text-6xl md:text-7xl select-none pointer-events-none leading-none filter drop-shadow-xs">
          {food.emoji}
        </span>
      </div>

      {/* Direct Fullscreen Drag Portal (Only the food, no card, no background, z-index: 9999) */}
      {isDragging &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dragElementRef}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: 88,
              height: 88,
              pointerEvents: 'none',
              zIndex: 9999,
              willChange: 'transform',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            <span className="text-5xl sm:text-6xl md:text-7xl select-none pointer-events-none leading-none filter drop-shadow-lg">
              {food.emoji}
            </span>
          </div>,
          document.body
        )}
    </div>
  );
};

export const FoodItemCard = React.memo(FoodItemCardComponent);

