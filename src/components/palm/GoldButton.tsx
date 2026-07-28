'use client';

import React from 'react';
import Link from 'next/link';

interface GoldButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'gold' | 'secondary';
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function GoldButton({
  children,
  href,
  onClick,
  variant = 'gold',
  fullWidth = false,
  className = '',
  style = {},
  type = 'button',
  disabled = false,
}: GoldButtonProps) {
  const baseClass = variant === 'gold' ? 'palm-btn-gold' : 'palm-btn-secondary';
  const widthStyle: React.CSSProperties = fullWidth ? { width: '100%' } : {};
  const combinedStyle = { ...widthStyle, ...style };

  if (href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`} style={combinedStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
      style={combinedStyle}
    >
      {children}
    </button>
  );
}
