'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-300 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`input-field ${icon ? 'pl-11' : ''} ${
            error ? 'border-red-500/50 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-400 ml-1 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
