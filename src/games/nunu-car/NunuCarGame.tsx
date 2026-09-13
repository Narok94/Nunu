import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTopControls } from '../../components/common/GameTopControls';
import { SuccessCelebration } from '../../components/common/SuccessCelebration';
import { soundManager } from '../../audio/soundManager';
import { CAR_STAGES } from './carTypes';

interface NunuCarGameProps {
  onBackToHome: () => void;
  onCompleteActivity?: (stars: number) => void;
  onOpenParentsGate?: () => void;
}

export const NunuCarGame: React.FC<NunuCarGameProps> = ({
  onBackToHome,
  onCompleteActivity,
  onOpenParentsGate,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ducklingsPassed, setDucklingsPassed] = useState(false);
  const [stageCleared, setStageCleared] = useState(false);

  // High-performance physics refs (zero React re-renders during 60fps frame ticks)
  const speedRef = useRef(0);
  const distanceRef = useRef(0);
  const isAcceleratingRef = useRef(false);
  const isBrakingRef = useRef(false);

  // Scenery DOM refs for smooth translation
  const sceneryFarRef = useRef<HTMLDivElement>(null);
  const sceneryNearRef = useRef<HTMLDivElement>(null);
  const roadStripesRef = useRef<HTMLDivElement>(null);
  const carBobbleRef = useRef<HTMLDivElement>(null);
  const ducklingsRef = useRef<HTMLDivElement>(null);

  const activeStage = CAR_STAGES[currentStageIdx];

  const handleRestart = () => {
    setCurrentStageIdx(0);
    setCompletedRounds(0);
    setIsCompleted(false);
    setDucklingsPassed(false);
    setStageCleared(false);
    speedRef.current = 0;
    distanceRef.current = 0;
    isAcceleratingRef.current = false;
    isBrakingRef.current = false;
  };

  const handleHorn = () => {
    soundManager.playCarHorn();
  };

  // Main 60fps physics loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Physics parameters
      const ACCELERATION = 280; // px/s^2
      const BRAKE_DECEL = 480;  // px/s^2
      const NATURAL_FRICTION = 90; // px/s^2
      const MAX_SPEED = 260; // px/s

      let curSpeed = speedRef.current;

      if (isBrakingRef.current) {
        curSpeed = Math.max(0, curSpeed - BRAKE_DECEL * dt);
      } else if (isAcceleratingRef.current) {
        curSpeed = Math.min(MAX_SPEED, curSpeed + ACCELERATION * dt);
      } else {
        curSpeed = Math.max(0, curSpeed - NATURAL_FRICTION * dt);
      }

      speedRef.current = curSpeed;
      distanceRef.current += curSpeed * dt;

      const dist = distanceRef.current;

      // Translate scenery seamlessly
      if (sceneryFarRef.current) {
        sceneryFarRef.current.style.transform = `translateX(-${(dist * 0.2) % 360}px)`;
      }
      if (sceneryNearRef.current) {
        sceneryNearRef.current.style.transform = `translateX(-${(dist * 0.7) % 480}px)`;
      }
      if (roadStripesRef.current) {
        roadStripesRef.current.style.transform = `translateX(-${(dist * 1.5) % 120}px)`;
      }
      if (carBobbleRef.current) {
        // Gentle engine vibration proportional to speed
        const bob = curSpeed > 10 ? Math.sin(time * 0.02) * 2.5 : 0;
        carBobbleRef.current.style.transform = `translateY(${bob}px)`;
      }

      // Check Stage 2 Ducklings obstacle
      if (activeStage.obstacleType === 'ducklings' && !ducklingsPassed) {
        if (dist > 350 && dist < 450) {
          // Slow down or stop for ducklings
          if (curSpeed < 50) {
            setDucklingsPassed(true);
            soundManager.playGiggle();
          }
        }
      }

      // Check stage target distance
      if (dist >= activeStage.targetDistance && !stageCleared) {
        setStageCleared(true);
        soundManager.playSuccessChime();
        const nextCompleted = completedRounds + 1;
        setCompletedRounds(nextCompleted);

        setTimeout(() => {
          if (nextCompleted >= CAR_STAGES.length) {
            setIsCompleted(true);
            onCompleteActivity?.(3);
          } else {
            setCurrentStageIdx((prev) => prev + 1);
            distanceRef.current = 0;
            speedRef.current = 0;
            setDucklingsPassed(false);
            setStageCleared(false);
          }
        }, 1200);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentStageIdx, completedRounds, ducklingsPassed, stageCleared, activeStage, onCompleteActivity]);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#38BDF8]">
      {/* Top Header */}
      <GameTopControls
        onBack={onBackToHome}
        completedRounds={completedRounds}
        totalRounds={CAR_STAGES.length}
        onRestart={handleRestart}
        onOpenParentsGate={onOpenParentsGate}
      />

      {/* Main Road Scene: Landscape Panoramic Vista with Safe-Area Thumb Controls */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col justify-between overflow-hidden safe-pb pb-1">
        {/* Sky with Fluffy Sun & Clouds */}
        <div className="relative w-full h-16 sm:h-20 overflow-hidden pointer-events-none">
          {/* Smiling Sun */}
          <div className="absolute top-1 right-8 text-3xl sm:text-4xl animate-pulse">
            ☀️
          </div>
          {/* Moving Clouds Layer */}
          <div ref={sceneryFarRef} className="absolute inset-0 flex items-center gap-24 whitespace-nowrap opacity-80">
            <span className="text-2xl sm:text-3xl">☁️</span>
            <span className="text-3xl sm:text-4xl">☁️</span>
            <span className="text-2xl">☁️</span>
            <span className="text-3xl sm:text-4xl">☁️</span>
            <span className="text-2xl sm:text-3xl">☁️</span>
          </div>
        </div>

        {/* Rolling Hills & Garden Scenery Layer */}
        <div className="relative w-full h-16 sm:h-20 overflow-hidden pointer-events-none">
          <div ref={sceneryNearRef} className="absolute bottom-0 flex items-end gap-16 whitespace-nowrap">
            <span className="text-3xl sm:text-4xl filter drop-shadow-xs">🌳</span>
            <span className="text-2xl sm:text-3xl">🌸</span>
            <span className="text-3xl sm:text-4xl">🌲</span>
            <span className="text-2xl sm:text-3xl">🌻</span>
            <span className="text-3xl sm:text-4xl">🏡</span>
            <span className="text-2xl sm:text-3xl">🌷</span>
            <span className="text-3xl sm:text-4xl">🌳</span>
            <span className="text-2xl sm:text-3xl">🍄</span>
          </div>
        </div>

        {/* Stage Obstacle / Landmark Zone (Pure non-verbal badges) */}
        {activeStage.obstacleType === 'ducklings' && (
          <div className="w-full flex justify-center -mb-2 pointer-events-none select-none">
            <motion.div
              animate={{ x: ducklingsPassed ? [0, 80] : [0, 5, 0] }}
              className="flex items-center gap-2 bg-white/80 px-3.5 py-1 rounded-full border border-amber-300 shadow-xs"
            >
              <span className="text-2xl">🦆</span>
              <span className="text-xl">🐥</span>
              <span className="text-xl">🐥</span>
              <span className="text-sm">✨</span>
            </motion.div>
          </div>
        )}

        {activeStage.obstacleType === 'finish_line' && (
          <div className="w-full flex justify-center -mb-2 pointer-events-none select-none">
            <div className="flex items-center gap-2 bg-white/80 px-3.5 py-1 rounded-full border border-indigo-300 shadow-xs">
              <span className="text-2xl">🏁</span>
              <span className="text-2xl">🎈</span>
              <span className="text-2xl">🍰</span>
              <span className="text-sm">✨</span>
            </div>
          </div>
        )}

        {/* The Road Surface */}
        <div className="relative w-full h-28 sm:h-32 bg-[#475569] border-t-6 sm:border-t-8 border-emerald-400 flex flex-col justify-center overflow-hidden shadow-inner">
          {/* Road Stripes */}
          <div
            ref={roadStripesRef}
            className="w-[200%] h-3 flex items-center gap-12 pointer-events-none"
          >
            {Array.from({ length: 30 }).map((_, idx) => (
              <div
                key={idx}
                className="w-10 h-2 sm:h-2.5 bg-yellow-300 rounded-full shrink-0"
              />
            ))}
          </div>

          {/* Cute Nunu Car */}
          <div
            ref={carBobbleRef}
            onClick={handleHorn}
            className="absolute left-12 sm:left-20 bottom-3 z-20 flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            aria-label="Tocar buzina"
          >
            {/* Cute Nunu in Driver Window */}
            <div className="w-10 h-8 -mb-2 flex items-center justify-center text-2xl sm:text-3xl filter drop-shadow-sm pointer-events-none">
              🐰
            </div>

            {/* Car Body */}
            <div className="relative w-24 sm:w-28 h-12 sm:h-14 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl border-3 border-white shadow-lg flex items-center justify-between px-3">
              {/* Headlight */}
              <div className="absolute right-1 top-3.5 w-3 h-3 rounded-full bg-amber-200 border border-white shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
              {/* Door handle */}
              <div className="w-2.5 h-1 bg-white/70 rounded-full mx-auto" />
              {/* Sound horn bubble indicator */}
              <span className="absolute -top-2.5 right-1 text-xs opacity-80">
                🔊
              </span>
            </div>

            {/* Wheels */}
            <div className="w-20 sm:w-24 flex justify-between -mt-2.5 pointer-events-none px-1">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-stone-800 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-spin" />
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-stone-800 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-spin" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Giant Driving Controls (Toddler-friendly thumb zones: Left Thumb = Brake, Right Thumb = Accelerate) */}
        <div className="w-full safe-px px-4 pt-2 flex items-center justify-between pointer-events-auto">
          {/* Left Thumb: Brake (🛑) */}
          <button
            id="car-brake-button"
            onPointerDown={() => {
              isBrakingRef.current = true;
              soundManager.playPop(350);
            }}
            onPointerUp={() => (isBrakingRef.current = false)}
            onPointerCancel={() => (isBrakingRef.current = false)}
            onPointerLeave={() => (isBrakingRef.current = false)}
            aria-label="Frear"
            className="w-20 h-16 sm:w-28 sm:h-18 rounded-3xl bg-gradient-to-tr from-rose-500 to-red-400 hover:from-rose-600 hover:to-red-500 active:scale-95 text-white flex items-center justify-center border-4 border-white shadow-lg cursor-pointer touch-none select-none transition-transform"
          >
            <span className="text-3xl sm:text-4xl">🛑</span>
          </button>

          {/* Center: Horn Prompt Button (Tocar buzina) */}
          <button
            onClick={handleHorn}
            aria-label="Buzina"
            className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center border-2 border-amber-300 shadow-sm active:scale-90 touch-none"
          >
            <span className="text-2xl">📢</span>
          </button>

          {/* Right Thumb: Accelerate (💨 / 🟢) */}
          <button
            id="car-accelerate-button"
            onPointerDown={() => {
              isAcceleratingRef.current = true;
              soundManager.playPop(550);
            }}
            onPointerUp={() => (isAcceleratingRef.current = false)}
            onPointerCancel={() => (isAcceleratingRef.current = false)}
            onPointerLeave={() => (isAcceleratingRef.current = false)}
            aria-label="Acelerar"
            className="w-20 h-16 sm:w-28 sm:h-18 rounded-3xl bg-gradient-to-tr from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 active:scale-95 text-white flex items-center justify-center border-4 border-white shadow-lg cursor-pointer touch-none select-none transition-transform"
          >
            <span className="text-3xl sm:text-4xl">💨</span>
          </button>
        </div>
      </main>

      {/* Success Celebration */}
      <AnimatePresence>
        {isCompleted && (
          <SuccessCelebration onContinue={onBackToHome} starsCount={3} />
        )}
      </AnimatePresence>
    </div>
  );
};
