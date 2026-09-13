import React, { useState, useRef, useCallback } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { ShapeItemData, ShapeType } from './shapeTypes';
import { ShapeBlockSvg } from './shapeSvgComponents';
import { soundManager } from '../../audio/soundManager';

export interface CavityTarget {
  id: string;
  shape: ShapeType;
  rect: DOMRect;
  center: { x: number; y: number };
}

interface ShapePieceCardProps {
  piece: ShapeItemData;
  isSelected: boolean;
  onSelect: (piece: ShapeItemData) => void;
  getCavityTargets: () => CavityTarget[];
  onHoverTarget: (shape: ShapeType | null) => void;
  onDropCorrect: (piece: ShapeItemData, cavityId: string) => void;
  onDropWrong: () => void;
  onDragStateChange?: (pieceId: string | null) => void;
  isLocked?: boolean;
}

const DRAG_OFFSET_Y = 24; // 24px above finger so piece is fully visible and not blocked by hand
const DRAG_THRESHOLD = 6;
const DRAG_SCALE = 1.08;
const SNAP_DURATION = 150; // Quick satisfying snap into cavity
const RETURN_DURATION = 200; // Gentle return on cancellation/wrong drop

export const ShapePieceCard: React.FC<ShapePieceCardProps> = ({
  piece,
  isSelected,
  onSelect,
  getCavityTargets,
  onHoverTarget,
  onDropCorrect,
  onDropWrong,
  onDragStateChange,
  isLocked = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const hoveredCavityRef = useRef<ShapeType | null>(null);
  const isAnimatingRef = useRef(false);

  // Pre-cached target bounds (zero getBoundingClientRect calls during drag)
  const cachedTargetsRef = useRef<CavityTarget[]>([]);
  const rafIdRef = useRef<number | null>(null);

  // Pointer tracking without React state re-renders on move
  const sessionRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    latestX: number;
    latestY: number;
    isDragging: boolean;
  } | null>(null);

  // RAF synchronization for 60/120fps display updates
  const updateDragVisual = useCallback(() => {
    rafIdRef.current = null;
    const session = sessionRef.current;
    if (!session || !session.isDragging || isAnimatingRef.current) return;

    const currentX = session.latestX;
    const currentY = session.latestY - DRAG_OFFSET_Y;

    // Direct hardware-accelerated transform via element ref
    const el = dragElementRef.current;
    if (el) {
      el.style.transform = `translate3d(${currentX - 48}px, ${currentY - 48}px, 0) scale(${DRAG_SCALE})`;
    }

    // Fast pure-math collision check against pre-cached cavity rects
    const pad = 48; // Generous collision tolerance for 3-year-olds
    let hitCavity: CavityTarget | null = null;
    for (let i = 0; i < cachedTargetsRef.current.length; i++) {
      const target = cachedTargetsRef.current[i];
      const r = target.rect;
      if (
        currentX >= r.left - pad &&
        currentX <= r.right + pad &&
        currentY >= r.top - pad &&
        currentY <= r.bottom + pad
      ) {
        hitCavity = target;
        break;
      }
    }

    const matchingShape = hitCavity?.shape === piece.shape ? hitCavity.shape : null;
    if (hoveredCavityRef.current !== matchingShape) {
      hoveredCavityRef.current = matchingShape;
      onHoverTarget(matchingShape);
    }
  }, [piece.shape, onHoverTarget]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary && e.button !== 0) return;
    if (isLocked || isAnimatingRef.current) return;

    e.preventDefault();

    const slot = slotRef.current;
    if (!slot) return;

    try {
      slot.setPointerCapture(e.pointerId);
    } catch {}

    cachedTargetsRef.current = getCavityTargets();

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

    session.latestX = e.clientX;
    session.latestY = e.clientY;

    if (!session.isDragging) {
      const dist = Math.hypot(e.clientX - session.startX, e.clientY - session.startY);
      if (dist > DRAG_THRESHOLD) {
        session.isDragging = true;
        soundManager.playPop(520);
        onDragStateChange?.(piece.id);

        flushSync(() => {
          setIsDragging(true);
        });

        const el = dragElementRef.current;
        if (el) {
          el.style.transform = `translate3d(${e.clientX - 48}px, ${e.clientY - DRAG_OFFSET_Y - 48}px, 0) scale(${DRAG_SCALE})`;
        }
      }
      return;
    }

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateDragVisual);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = sessionRef.current;
    if (!session || session.pointerId !== e.pointerId) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    try {
      if (slotRef.current?.hasPointerCapture(e.pointerId)) {
        slotRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const wasDragging = session.isDragging;
    const finalX = session.latestX;
    const finalY = session.latestY;
    sessionRef.current = null;

    if (!wasDragging) {
      // Tap selection for toddlers
      soundManager.playPop(580);
      onSelect(piece);
      return;
    }

    onDragStateChange?.(null);

    // Collision check against pre-cached cavities
    const pad = 52;
    let hitCavity: CavityTarget | null = null;
    for (let i = 0; i < cachedTargetsRef.current.length; i++) {
      const target = cachedTargetsRef.current[i];
      const r = target.rect;
      if (
        finalX >= r.left - pad &&
        finalX <= r.right + pad &&
        finalY >= r.top - pad &&
        finalY <= r.bottom + pad
      ) {
        hitCavity = target;
        break;
      }
    }

    onHoverTarget(null);
    hoveredCavityRef.current = null;

    if (hitCavity && hitCavity.shape === piece.shape) {
      // Correct snap into cavity!
      const targetCenter = hitCavity.center;
      const dragEl = dragElementRef.current;

      if (dragEl && targetCenter) {
        isAnimatingRef.current = true;
        dragEl.style.transition = `transform ${SNAP_DURATION}ms cubic-bezier(0.2, 0.9, 0.3, 1.1), opacity ${SNAP_DURATION}ms ease-out`;
        dragEl.style.transform = `translate3d(${targetCenter.x - 48}px, ${targetCenter.y - 48}px, 0) scale(1)`;

        setTimeout(() => {
          setIsDragging(false);
          isAnimatingRef.current = false;
          onDropCorrect(piece, hitCavity!.id);
        }, SNAP_DURATION);
        return;
      }

      setIsDragging(false);
      onDropCorrect(piece, hitCavity.id);
      return;
    }

    // Wrong drop or dropped outside -> Gentle return to shelf slot
    const slotEl = slotRef.current;
    const dragEl = dragElementRef.current;

    if (slotEl && dragEl) {
      isAnimatingRef.current = true;
      const slotRect = slotEl.getBoundingClientRect();
      const originX = slotRect.left + slotRect.width / 2;
      const originY = slotRect.top + slotRect.height / 2;

      dragEl.style.transition = `transform ${RETURN_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      dragEl.style.transform = `translate3d(${originX - 48}px, ${originY - 48}px, 0) scale(1)`;

      setTimeout(() => {
        setIsDragging(false);
        isAnimatingRef.current = false;
        if (hitCavity && hitCavity.shape !== piece.shape) {
          onDropWrong();
        }
      }, RETURN_DURATION);
      return;
    }

    setIsDragging(false);
    if (hitCavity && hitCavity.shape !== piece.shape) {
      onDropWrong();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sessionRef.current?.pointerId === e.pointerId) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      try {
        if (slotRef.current?.hasPointerCapture(e.pointerId)) {
          slotRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {}
      sessionRef.current = null;
      setIsDragging(false);
      isAnimatingRef.current = false;
      onHoverTarget(null);
      hoveredCavityRef.current = null;
      onDragStateChange?.(null);
    }
  };

  return (
    <>
      {/* Stable Slot on the Wooden Toy Shelf */}
      <div
        ref={slotRef}
        id={`shape-slot-${piece.id}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{ touchAction: 'none' }}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform select-none ${
          isSelected ? 'ring-4 ring-amber-400 ring-offset-2 scale-105' : ''
        }`}
        aria-label={`Forma ${piece.shape} cor ${piece.colorName}`}
      >
        {/* Empty shelf indent when piece is lifted/dragged */}
        <div className="absolute inset-2 rounded-xl bg-amber-900/10 border-2 border-dashed border-amber-800/20" />

        {/* The Piece Block resting on shelf (hidden when actively dragged in portal) */}
        {!isDragging && (
          <motion.div
            layoutId={`shape-piece-${piece.id}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full h-full p-2 flex items-center justify-center filter drop-shadow-md"
          >
            <ShapeBlockSvg
              shape={piece.shape}
              colorHex={piece.colorHex}
              gradientFrom={piece.gradientFrom}
              gradientTo={piece.gradientTo}
            />
          </motion.div>
        )}
      </div>

      {/* Floating Drag Portal Element (smooth 1:1 pointer tracking, zero layout shifts) */}
      {isDragging &&
        createPortal(
          <div
            ref={dragElementRef}
            className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-[9999] will-change-transform filter drop-shadow-2xl"
          >
            <ShapeBlockSvg
              shape={piece.shape}
              colorHex={piece.colorHex}
              gradientFrom={piece.gradientFrom}
              gradientTo={piece.gradientTo}
            />
          </div>,
          document.body
        )}
    </>
  );
};
