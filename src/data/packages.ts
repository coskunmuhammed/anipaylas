export interface PackageItem {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export const packagesData: PackageItem[] = [
  {
    id: 'palm-baslangic',
    name: 'Palm Başlangıç',
    badge: 'Zarif & Samimi',
    tagline: 'Küçük ve orta ölçekli davetler için temel organizasyon paketi.',
    description: 'Ev, bahçe veya butik mekanlarda gerçekleşecek söz, nişan ve doğum günü davetleri için ideal kapsama sahiptir.',
    features: [
      'Tematik Arka Fon & Çiçek Süslemesi',
      'Konsept Masa ve Sandalye Giydirme',
      'Hoş Geldiniz Karşılama Panosu',
      'Etkinlik Günü Süreç Rehberliği',
      'Opsiyonel Dijital Anı Albümü Eklentisi',
    ],
    ctaText: 'Teklif Al',
  },
  {
    id: 'palm-signature',
    name: 'Palm Signature',
    badge: 'En Çok Tercih Edilen',
    tagline: 'Kapsamlı düğün ve kına geceleri için imza organizasyon konsepti.',
    description: 'Mekan tasarımı, sahne ışıklandırması, canlı çiçek düzenlemeleri ve Palm Stüdyo Dijital Anı Albümü dahil eksiksiz paket.',
    isPopular: true,
    features: [
      'Eksiksiz Mekan & Masa-Sandalye Tasarımı',
      'Gelin Yolu, Nikah Kürsüsü / Kına Tahtı Kurulumu',
      'Canlı Çiçek Aranjmanları & Özel Işıklandırma',
      'Etkinlik Günü Canlı Koordinatörlük Hizmeti',
      'Palm Stüdyo Dijital Anı Albümü (Sınırsız Misafir Yüklemesi)',
      'Şifreli ve Süreli ZIP İndirme Bağlantısı',
    ],
    ctaText: 'Teklif Al',
  },
  {
    id: 'palm-exclusive',
    name: 'Palm Exclusive',
    badge: 'VIP & Lüks',
    tagline: 'Sınır tanımayan kişiye özel ultra lüks organizasyon deneyimi.',
    description: 'Büyük ölçekli düğün ve gala davetleri için 3D mimari görselleştirme, özel tasarım sahne ve VIP koordinasyon ekibi.',
    features: [
      'Kişiye Özel 3D Mimari Konsept Tasarımı',
      'Özel İthal Çiçek ve Mobilya Konsepti',
      'Profesyonel Sahne, Ses, Işık ve Efekt Şovları',
      'Tam Kadro Etkinlik Günü Yönetim Ekibi',
      'Palm Stüdyo VIP Dijital Anı Albümü & Öncelikli ZIP Hazırlığı',
      'Özel Fotoğraf & Video Çekim Koordinasyonu',
    ],
    ctaText: 'Teklif Al',
  },
];
