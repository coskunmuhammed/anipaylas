import React from 'react';
import PalmHeader from '@/components/palm/PalmHeader';
import PalmFooter from '@/components/palm/PalmFooter';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8F6F1' }}>
      <PalmHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <PalmFooter />
    </div>
  );
}
