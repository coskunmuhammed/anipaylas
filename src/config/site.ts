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
  tagline: 'Didim Düğün Fotoğrafçısı & Premium Etkinlik Stüdyosu',
  description:
    'Didim merkezli düğün fotoğrafçılığı, sinematik video çekimi, konsept çekim, saç & makyaj, gelinlik, albüm baskı ve dijital anı albümü hizmetleri.',
  logo: '/brand/palm-studio-logo.svg',
  
  // Public contact information
  phone: process.env.NEXT_PUBLIC_PHONE || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  instagramUsername: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'palmstudio',
  instagramUrl: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'palmstudio'}`,
  
  rawWhatsAppNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905550000000',
  get whatsappNumber() {
    return normalizeWhatsAppNumber(this.rawWhatsAppNumber);
  },
  
  // Testimonials control toggle - hides unverified review sections if false
  testimonialsEnabled: process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED === 'true',
  
  // Generate safe normalized WhatsApp link with optional preset message
  getWhatsAppLink(presetMessage: string = 'Merhaba Palm Stüdyo, Didim düğün & etkinlik çekim paketleriniz ve dijital anı albümü hakkında detaylı bilgi ve teklif almak istiyorum.') {
    const cleanNumber = normalizeWhatsAppNumber(this.rawWhatsAppNumber);
    const encodedMsg = encodeURIComponent(presetMessage);
    return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
  },
};
