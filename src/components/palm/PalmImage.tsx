'use client';

import React, { useState, useEffect } from 'react';
import { getMediaUrl } from '@/lib/mediaUrl';
import { Camera } from 'lucide-react';

interface PalmImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export default function PalmImage({
  src,
  alt,
  className,
  style,
  fill,
  width,
  height,
  loading = 'lazy',
}: PalmImageProps) {
  const [hasError, setHasError] = useState(false);
  const mediaUrl = getMediaUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!mediaUrl || hasError) {
    return (
      <div
        className={className}
        style={{
          width: fill ? '100%' : width || '100%',
          height: fill ? '100%' : height || '100%',
          position: fill ? 'absolute' : 'relative',
          inset: fill ? 0 : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a140f 0%, #0d0b09 100%)',
          border: '1px solid rgba(201, 170, 103, 0.2)',
          padding: '16px',
          textAlign: 'center',
          color: '#c9aa67',
          boxSizing: 'border-box',
          overflow: 'hidden',
          userSelect: 'none',
          ...style,
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(201, 170, 103, 0.1)',
            border: '1px solid rgba(201, 170, 103, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
          }}
        >
          <Camera size={20} style={{ color: '#c9aa67' }} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: '0.88rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#e5c985',
            marginBottom: '4px',
          }}
        >
          PALM STÜDYO
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.05em',
          }}
        >
          {alt || 'Görsel Hazırlanıyor'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={() => setHasError(true)}
      className={className}
      style={{
        width: fill ? '100%' : width ? `${width}px` : '100%',
        height: fill ? '100%' : height ? `${height}px` : '100%',
        position: fill ? 'absolute' : undefined,
        inset: fill ? 0 : undefined,
        objectFit: 'cover',
        ...style,
      }}
    />
  );
}
