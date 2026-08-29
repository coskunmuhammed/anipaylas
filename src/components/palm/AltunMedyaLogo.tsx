'use client';

import React from 'react';

interface AltunMedyaLogoProps {
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AltunMedyaLogo({
  color = '#ffffff',
  size = 18,
  className = '',
  style = {},
}: AltunMedyaLogoProps) {
  return (
    <a
      href="https://www.altunmedya.com"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: color,
        textDecoration: 'none',
        transition: 'opacity 0.2s ease',
        ...style,
      }}
      title="Altun Medya — www.altunmedya.com"
    >
      {/* 4-point star icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: color, flexShrink: 0 }}
      >
        <path
          d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
          fill="currentColor"
        />
      </svg>

      {/* Contiguous "altunmedya" text without space */}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: `${size * 0.95}px`, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ fontWeight: 400, color: color }}>altun</span>
        <span style={{ fontWeight: 700, color: color }}>medya</span>
      </span>
    </a>
  );
}
