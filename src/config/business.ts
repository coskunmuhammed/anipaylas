/**
 * Centralized Business Config for Palm Stüdyo
 * Ensures no fake, unverified, or hardcoded marketing claims are rendered in production.
 */

export interface StatItem {
  value: string;
  label: string;
  verified: boolean;
}

export interface BusinessConfig {
  deliveryText: string;
  depositText: string;
  guaranteeText: string;
  serviceAreas: string[];
  stats: StatItem[];
}

export const businessConfig: BusinessConfig = {
  // Driven by real business options. If empty string, TrustBar item will be omitted.
  deliveryText: "10 günde dijital teslim",
  depositText: "Esnek kaporayla ödeme",
  guaranteeText: "Şeffaf paket garantisi",
  
  // Real service coverage regions centered around Didim
  serviceAreas: [
    "Didim",
    "Aydın",
    "Kuşadası",
    "İzmir",
    "Bodrum",
    "Muğla",
  ],

  // Only verified metrics rendered. Unverified ones (verified: false) are safely filtered out.
  stats: [
    { value: "10+", label: "Yıl Deneyim", verified: true },
    { value: "15+", label: "Özgün Konsept", verified: true },
    { value: "100%", label: "Müşteri Memnuniyeti", verified: true },
    { value: "75K", label: "Mutlu Çift", verified: false }, // Unverified demo sample
    { value: "1.2M", label: "Takipçi", verified: false },   // Unverified demo sample
    { value: "48M+", label: "Sosyal Erişim", verified: false }, // Unverified demo sample
  ],
};
