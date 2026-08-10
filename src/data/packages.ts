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
    badge: 'Fotoğraf Çekim Paketi',
    tagline: 'Küçük ve orta ölçekli davetler için fotoğraf çekim hizmeti',
    description: 'Ev, bahçe veya butik mekanlarda gerçekleşecek söz, nişan ve özel davetler için ideal fotoğraf çekimi.',
    features: [
      'Konsepte uygun fotoğraf çekimi',
      'Detay çekimler',
      'Etkinlik günü fotoğraf çekim süreci Rehberliği',
      'Opsiyonel dijital anı albümü eklentisi',
    ],
    ctaText: 'Teklif Al',
  },
  {
    id: 'palm-dugun-kina',
    name: 'Palm Düğün & Kına',
    badge: 'Fotoğraf & Sabit Video',
    tagline: 'Düğün ve kına gecelerinizde unutulmaz anlarınızı fotoğraflayıp bütün etkinliğinizi video kaydına alıyoruz.',
    description: 'Düğün ve kına geceleri için fotoğraf çekimi ve tam süreli sabit video kayıt çözümü.',
    features: [
      'Konsepte uygun fotoğraf çekimi',
      'Sabit video çekim hizmeti',
      'Detay çekimler',
      'Etkinlik günü fotoğraf çekim süreci Rehberliği',
      'Opsiyonel dış çekim',
      'Palm Studio Dijital Anı Albümü (Sınırsız Misafir Yüklemesi, Şifreli ve Süreli ZIP İndirme Bağlantısı)',
    ],
    ctaText: 'Teklif Al',
  },
  {
    id: 'palm-premium',
    name: 'Palm Premium',
    badge: 'En Çok Tercih Edilen',
    tagline: 'Kapsamlı düğün ve kına geceleri için fotoğraf ve hikaye hizmeti',
    description: 'Düğün ve kına gecelerinizde unutulmaz anlarınızı fotoğraflayıp sinematik hikaye çekimiyle taçlandırıyoruz.',
    isPopular: true,
    features: [
      'Konsepte uygun fotoğraf çekimi',
      'Sinematik tarzda hikaye hizmeti',
      'Opsiyonel dış çekim',
      'Detay çekimler',
      'Etkinlik günü fotoğraf ve hikaye çekim süreci Rehberliği',
      'Palm Studio Dijital Anı Albümü (Sınırsız Misafir Yüklemesi, Şifreli ve Süreli ZIP İndirme Bağlantısı)',
    ],
    ctaText: 'Teklif Al',
  },
  {
    id: 'palm-exclusive',
    name: 'Palm Exclusive',
    badge: 'VIP & Ultra Lüks',
    tagline: 'Kapsamlı düğün ve kına geceleri için fotoğraf, hikaye ve sabit video hizmeti',
    description: 'Sınır tanımayan kişiye özel ultra lüks anı hizmeti',
    features: [
      'Konsepte uygun fotoğraf çekimi',
      'Sinematik tarzda hikaye hizmeti',
      'Sabit video çekim hizmeti',
      'Opsiyonel dış çekim',
      'Detay çekimler',
      'Etkinlik günü çekim süreci Rehberliği',
      'Palm Studio VIP Dijital Anı Albümü & Öncelikli ZIP Hazırlığı',
      'Özel Fotoğraf & Video Çekim Koordinasyonu',
    ],
    ctaText: 'Teklif Al',
  },
];
