'use client';

import React from 'react';
import { businessConfig } from '@/config/business';
import { ShieldCheck, Clock, Award } from 'lucide-react';

export default function TrustBar() {
  const items = [
    { text: businessConfig.deliveryText, icon: Clock },
    { text: businessConfig.depositText, icon: ShieldCheck },
    { text: businessConfig.guaranteeText, icon: Award },
  ].filter((item) => item.text && item.text.trim() !== '');

  if (items.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#1c1611',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '18px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              <Icon size={18} style={{ color: 'var(--palm-gold)' }} />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
