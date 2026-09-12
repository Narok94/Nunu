import React, { useState, useRef, useEffect } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { ColorId, FoodItemData } from '../../types';
import { soundManager } from '../../audio/soundManager';

interface FoodItemCardProps {
  food: FoodItemData;
  isSelected: boolean;
  onSelect: (food: FoodItemData) => void;
  checkDropTarget: (point: { x: number; y: number }) => ColorId | null;
  getCreatureMouth: (colorId: ColorId) => { x: number; y: number } | null;
  onHoverTarget: (colorId: ColorId | null) => void;
  onDropCorrect: (food: FoodItemData, creatureColorId: ColorId) => void;
  onDropWrong: (wrongColorId: ColorId) => void;
  onDragStateChange?: (foodId: string | null) => void;
  isLocked?: boolean;
}

// Calibration constants based on exact toddler UX requirements
const TARGET_OFFSET_Y = 28; // 25-35px rule: center of food slightly above touch point
const ELEVATION_DURATION = 100; // 80-120ms rule: smooth natural lift without teleportation
const TARGET_SCALE = 1.08; // scale ~1.08 rule
const EATEN_DURATION = 190; // quick swoosh into creature's mouth
const RETURN_DURATION = 240; // 200-300ms return animation with easing on release

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  food,
  isSelected,
  onSelect,
  checkDropTarget,
  getCreatureMouth,
  onHoverTarget,
  onDropCorrect,
  onDropWrong,
  onDragStateChange,
  isLocked = false,
}) => {
  const [isPortalVisible, setIsPortalVisible] = useState(false);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const lastHoveredColorRef = useRef<ColorId | null>(null);
  const isAnimatingRef = useRef(false);
  const elevationRafRef = useRef<number | null>(null);

  interface DragSession {
    pointerId: number;
    startTime: number;
    startPointerX: number;
    startPointerY: number;
    currentPointerX: number;
    currentPointerY: number;
    slotCenterX: number;
    slotCenterY: number;
    isMoved: boolean;
  }
  const dragDataRef = useRef<DragSession | null>(null);

  useEffect(() => {
    return () => {
      if (elevationRafRef.current) {
        cancelAnimationFrame(elevationRafRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary pointer (left mouse click or touch contact)
    if (!e.isPrimary && e.button !== 0) return;
    if (isLocked || isAnimatingRef.current) return;

    e.preventDefault();

    const slot = slotRef.current;
    if (!slot) return;

    const rect = slot.getBoundingClientRect();
    const slotCenterX = rect.left + rect.width / 2;
    const slotCenterY = rect.top + rect.height / 2;

    dragDataRef.current = {
      pointerId: e.pointerId,
      startTime: performance.now(),
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      currentPointerX: e.clientX,
      currentPointerY: e.clientY,
      slotCenterX,
      slotCenterY,
      isMoved: false,
    };

    try {
      slot.setPointerCapture(e.pointerId);
    } catch {}

    // Synchronously mount portal element directly on document.body to avoid stacking context traps
    flushSync(() => {
      setIsPortalVisible(true);
    });

    onDragStateChange?.(food.id);

    const el = dragElementRef.current;
    if (el) {
      el.style.transition = 'none';
      el.style.opacity = '1';
      // Starts EXACTLY at slot center, scale 1.0 (NO TELEPORTATION)
      el.style.transform = `translate3d(${slotCenterX - 44}px, ${slotCenterY - 44}px, 0) scale(1)`;
    }

    // Run natural 100ms elevation loop (80-120ms rule)
    const runElevation = () => {
      const data = dragDataRef.current;
      const elNode = dragElementRef.current;
      if (!data || !elNode) return;

      const elapsed = performance.now() - data.startTime;
      const progress = Math.min(1, elapsed / ELEVATION_DURATION);
      const eased = 1 - Math.pow(1 - progress, 2);

      const currentLift = TARGET_OFFSET_Y * eased;
      const currentScale = 1 + (TARGET_SCALE - 1) * eased;

      const currentX = data.slotCenterX + (data.currentPointerX - data.slotCenterX) * eased;
      const currentY = data.slotCenterY + (data.currentPointerY - currentLift - data.slotCenterY) * eased;

      elNode.style.transform = `translate3d(${currentX - 44}px, ${currentY - 44}px, 0) scale(${currentScale})`;

      if (progress < 1) {
        elevationRafRef.current = requestAnimationFrame(runElevation);
      } else {
        elevationRafRef.current = null;
      }
    };

    elevationRafRef.current = requestAnimationFrame(runElevation);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const data = dragDataRef.current;
    const el = dragElementRef.current;
    if (!data || !el) return;
    if (data.pointerId !== e.pointerId) return;

    e.preventDefault();

    data.currentPointerX = e.clientX;
    data.currentPointerY = e.clientY;

    const dist = Math.hypot(e.clientX - data.startPointerX, e.clientY - data.startPointerY);
    if (dist > 7) {
      data.isMoved = true;
    }

    const elapsed = performance.now() - data.startTime;
    const progress = Math.min(1, elapsed / ELEVATION_DURATION);

    let currentX: number;
    let currentY: number;

    if (progress >= 1) {
      // Elevation complete -> 100% 1:1 DIRECT TRACKING WITH ZERO DELAY / ZERO EASING
      currentX = e.clientX;
      currentY = e.clientY - TARGET_OFFSET_Y;
      el.style.transform = `translate3d(${currentX - 44}px, ${currentY - 44}px, 0) scale(${TARGET_SCALE})`;
    } else {
      // During initial 100ms elevation
      const eased = 1 - Math.pow(1 - progress, 2);
      const currentLift = TARGET_OFFSET_Y * eased;
      const currentScale = 1 + (TARGET_SCALE - 1) * eased;
      currentX = data.slotCenterX + (e.clientX - data.slotCenterX) * eased;
      currentY = data.slotCenterY + (e.clientY - currentLift - data.slotCenterY) * eased;
      el.style.transform = `translate3d(${currentX - 44}px, ${currentY - 44}px, 0) scale(${currentScale})`;
    }

    // Check collision with creatures
    const targetColorId = checkDropTarget({ x: currentX, y: currentY });
    // Subtle visual feedback triggered only if entering the matching creature
    const matchingTarget = targetColorId === food.colorId ? targetColorId : null;

    if (lastHoveredColorRef.current !== matchingTarget) {
      lastHoveredColorRef.current = matchingTarget;
      onHoverTarget(matchingTarget);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const data = dragDataRef.current;
    const el = dragElementRef.current;
    if (!data || !el) return;
    if (data.pointerId !== e.pointerId) return;

    if (elevationRafRef.current) {
      cancelAnimationFrame(elevationRafRef.current);
      elevationRafRef.current = null;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Tap without drag movement -> Selection / tap-to-feed
    if (!data.isMoved) {
      dragDataRef.current = null;
      setIsPortalVisible(false);
      onDragStateChange?.(null);
      if (lastHoveredColorRef.current) {
        lastHoveredColorRef.current = null;
        onHoverTarget(null);
      }
      soundManager.playPop(520);
      onSelect(food);
      return;
    }

    // Calculate exact release position
    const elapsed = performance.now() - data.startTime;
    const progress = Math.min(1, elapsed / ELEVATION_DURATION);
    const eased = 1 - Math.pow(1 - progress, 2);
    const currentLift = TARGET_OFFSET_Y * (progress >= 1 ? 1 : eased);
    const releaseX = progress >= 1 ? e.clientX : data.slotCenterX + (e.clientX - data.slotCenterX) * eased;
    const releaseY = progress >= 1 ? e.clientY - currentLift : data.slotCenterY + (e.clientY - currentLift - data.slotCenterY) * eased;

    const targetColorId = checkDropTarget({ x: releaseX, y: releaseY });

    if (lastHoveredColorRef.current) {
      lastHoveredColorRef.current = null;
      onHoverTarget(null);
    }

    if (targetColorId === food.colorId) {
      // 7. SOLTAR NO BICHINHO CORRETO:
      // A fruta vai rapidamente até a boca do bichinho e desaparece como se tivesse sido comida.
      isAnimatingRef.current = true;
      const mouth = getCreatureMouth(targetColorId) || { x: releaseX, y: releaseY - 40 };

      el.style.transition = `transform ${EATEN_DURATION}ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity ${EATEN_DURATION - 20}ms ease-out`;
      el.style.transform = `translate3d(${mouth.x - 44}px, ${mouth.y - 44}px, 0) scale(0.12)`;
      el.style.opacity = '0';

      setTimeout(() => {
        isAnimatingRef.current = false;
        dragDataRef.current = null;
        setIsPortalVisible(false);
        onDragStateChange?.(null);
        onDropCorrect(food, targetColorId);
      }, EATEN_DURATION);
    } else {
      // 8. SOLTAR NO LOCAL ERRADO:
      // A fruta retorna suavemente à posição inicial em ~240ms com easing de retorno.
      isAnimatingRef.current = true;

      el.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      el.style.transform = `translate3d(${data.slotCenterX - 44}px, ${data.slotCenterY - 44}px, 0) scale(1)`;

      if (targetColorId && targetColorId !== food.colorId) {
        onDropWrong(targetColorId);
      }

      setTimeout(() => {
        isAnimatingRef.current = false;
        dragDataRef.current = null;
        setIsPortalVisible(false);
        onDragStateChange?.(null);
      }, RETURN_DURATION);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const data = dragDataRef.current;
    const el = dragElementRef.current;
    if (!data || !el) return;
    if (data.pointerId !== e.pointerId) return;

    if (elevationRafRef.current) {
      cancelAnimationFrame(elevationRafRef.current);
      elevationRafRef.current = null;
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (lastHoveredColorRef.current) {
      lastHoveredColorRef.current = null;
      onHoverTarget(null);
    }

    isAnimatingRef.current = true;
    el.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    el.style.transform = `translate3d(${data.slotCenterX - 44}px, ${data.slotCenterY - 44}px, 0) scale(1)`;

    setTimeout(() => {
      isAnimatingRef.current = false;
      dragDataRef.current = null;
      setIsPortalVisible(false);
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
      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      aria-label="Alimento"
    >
      {/* Soft Grassy Ground Shadow where the food rests in the garden */}
      <div
        className={`absolute bottom-1.5 w-12 sm:w-14 h-3.5 bg-emerald-950/20 rounded-full blur-xs transition-opacity pointer-events-none ${
          isPortalVisible ? 'opacity-25 scale-75' : 'opacity-100'
        }`}
      />

      {/* Gentle Garden Nesting Ring when item is tapped/selected */}
      {isSelected && !isPortalVisible && (
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-amber-300/30 border-2 border-amber-400 pointer-events-none"
        />
      )}

      {/* Resting Food Illustration in Slot (hidden while dragged via portal) */}
      <div
        className={`relative z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center select-none pointer-events-none ${
          isPortalVisible ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-5xl sm:text-6xl md:text-7xl select-none pointer-events-none leading-none filter drop-shadow-xs">
          {food.emoji}
        </span>
      </div>

      {/* Direct Fullscreen Drag Portal (Rendered above everything, NO card, NO text, NO container) */}
      {isPortalVisible &&
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
