import React from 'react';
import { motion } from 'motion/react';
import { soundManager } from '../../audio/soundManager';

interface ChildButtonProps {
  id?: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const ChildButton: React.FC<ChildButtonProps> = ({
  id,
  onClick,
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  ariaLabel,
}) => {
  const handleClick = () => {
    if (disabled) return;
    soundManager.playPop(560);
    onClick();
  };

  const variantStyles = {
    primary:
      'bg-amber-400/90 text-stone-900 border border-amber-300/80 hover:bg-amber-400 active:scale-95 shadow-[0_4px_14px_rgba(251,191,36,0.25)]',
    secondary:
      'bg-sky-400/90 text-stone-900 border border-sky-300/80 hover:bg-sky-400 active:scale-95 shadow-[0_4px_14px_rgba(56,189,248,0.25)]',
    accent:
      'bg-pink-400/90 text-stone-900 border border-pink-300/80 hover:bg-pink-400 active:scale-95 shadow-[0_4px_14px_rgba(244,114,182,0.25)]',
    success:
      'bg-emerald-500/90 text-white border border-emerald-400/80 hover:bg-emerald-500 active:scale-95 shadow-[0_4px_14px_rgba(16,185,129,0.25)]',
    danger:
      'bg-rose-400/90 text-white border border-rose-300/80 hover:bg-rose-400 active:scale-95 shadow-[0_4px_14px_rgba(251,113,133,0.25)]',
    ghost:
      'bg-white/80 text-stone-700 border border-stone-200/80 hover:bg-white active:scale-95 shadow-xs',
  };

  const sizeStyles = {
    md: 'px-5 py-2.5 text-base rounded-2xl min-h-[44px] font-medium',
    lg: 'px-6 py-3 text-lg rounded-2xl min-h-[52px] font-semibold',
    xl: 'px-8 py-3.5 text-xl rounded-2xl min-h-[60px] font-semibold',
  };

  return (
    <motion.button
      id={id}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-3 transition-all duration-75 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
