'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 border-none rounded-xl cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2 font-semibold',
  }[variant];

  const sizeClass = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-5 py-3',
    lg: 'text-base px-6 py-3.5',
  }[size];

  return (
    <button
      className={cn(baseClass, sizeClass, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
