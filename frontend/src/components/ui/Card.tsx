'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
}: CardProps) {
  return (
    <div
      className={`glass-card p-6 ${
        hover ? '' : 'hover:border-[var(--card-border)] hover:shadow-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}
