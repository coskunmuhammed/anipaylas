import React from 'react';
import PalmHeader from '@/components/palm/PalmHeader';
import PalmHero from '@/components/palm/PalmHero';
import TrustBar from '@/components/palm/TrustBar';
import MemoryStatement from '@/components/palm/MemoryStatement';
import ValueComparison from '@/components/palm/ValueComparison';
import ServicesSection from '@/components/palm/ServicesSection';
import DigitalMemoryShowcase from '@/components/palm/DigitalMemoryShowcase';
import ServiceAreaSection from '@/components/palm/ServiceAreaSection';
import SignatureConcepts from '@/components/palm/SignatureConcepts';
import TestimonialsSection from '@/components/palm/TestimonialsSection';
import StoriesSection from '@/components/palm/StoriesSection';
import ReservationCTA from '@/components/palm/ReservationCTA';
import PalmFooter from '@/components/palm/PalmFooter';

export const metadata = {
  title: 'Palm Stüdyo | Didim Düğün Fotoğrafçısı ve Dijital Anı Albümü Stüdyosu',
  description:
    'Palm Stüdyo; Didim’de düğün fotoğrafçılığı, video çekimi, konsept çekim, saç & makyaj, gelinlik, organizasyon ve dijital anı albümü (QR fotoğraf paylaşımı) hizmetleri sunar.',
};

export default function MarketingHomePage() {
  return (
    <div style={{ backgroundColor: 'var(--palm-black)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PalmHeader />
      <main style={{ flex: 1 }}>
        <PalmHero />
        <TrustBar />
        <MemoryStatement />
        <ValueComparison />
        <ServicesSection />
        <DigitalMemoryShowcase />
        <ServiceAreaSection />
        <SignatureConcepts />
        <TestimonialsSection />
        <StoriesSection />
        <ReservationCTA />
      </main>
      <PalmFooter />
    </div>
  );
}
