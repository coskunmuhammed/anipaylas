/**
 * Centralized Palm Stüdyo Site Configuration
 * Only public brand metadata should be exposed here.
 */

function normalizeWhatsAppNumber(rawNumber: string): string {
  // Remove all +, spaces, dashes, parentheses, or extra characters
  return rawNumber.replace(/[^\d]/g, '');
}

export const siteConfig = {
  name: 'Palm Stüdyo',
  shortName: 'Palm',
  tagline: 'Premium Etkinlik Tasarımı & Dijital Anı Deneyimi',
  description:
    'Düğün, kına, nişan, söz, doğum günü ve özel organizasyonlarınız için lüks mekan tasarımı, profesyonel etkinlik planlama ve dijital anı albümü hizmetleri.',
  logo: '/brand/palm-studio-logo.svg',
  
  // Public contact information
  instagramUsername: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'palmstudio',
  instagramUrl: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'palmstudio'}`,
  
  rawWhatsAppNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905550000000',
  get whatsappNumber() {
    return normalizeWhatsAppNumber(this.rawWhatsAppNumber);
  },
  
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@palmstudio.com',
  
  // Generate safe normalized WhatsApp link with optional preset message
  getWhatsAppLink(presetMessage: string = 'Merhaba Palm Stüdyo, etkinlik organizasyonu ve dijital anı albümü hakkında detaylı bilgi almak istiyorum.') {
    const cleanNumber = normalizeWhatsAppNumber(this.rawWhatsAppNumber);
    const encodedMsg = encodeURIComponent(presetMessage);
    return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
  },
};
