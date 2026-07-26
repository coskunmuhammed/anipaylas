export interface GalleryItem {
  id: string;
  title: string;
  category: 'dugun' | 'kina' | 'nisan' | 'dogum-gunu' | 'kurumsal';
  categoryLabel: string;
  imageUrl: string;
  subtitle: string;
  isSample: boolean;
}

export const galleryData: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Kır Düğünü Konsepti',
    category: 'dugun',
    categoryLabel: 'Düğün',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Doğal yeşillikler ve altın detaylı masa düzeni',
    isSample: true,
  },
  {
    id: 'gal-2',
    title: 'Zarif Kına Tahtı',
    category: 'kina',
    categoryLabel: 'Kına',
    imageUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Geleneksel motifler ve kadife detaylar',
    isSample: true,
  },
  {
    id: 'gal-3',
    title: 'Bohem Nişan Masası',
    category: 'nisan',
    categoryLabel: 'Nişan & Söz',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Kurutulmuş çiçekler ve şeffaf pleksi detaylar',
    isSample: true,
  },
  {
    id: 'gal-4',
    title: 'Şık Salon Düğünü',
    category: 'dugun',
    categoryLabel: 'Düğün',
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Kristal avizeler ve canlı beyaz gül konsepti',
    isSample: true,
  },
  {
    id: 'gal-5',
    title: 'Tematik Doğum Günü',
    category: 'dogum-gunu',
    categoryLabel: 'Doğum Günü',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Pastel balon zinciri ve kişiye özel ikram masası',
    isSample: true,
  },
  {
    id: 'gal-6',
    title: 'Kurumsal Gala Yemeği',
    category: 'kurumsal',
    categoryLabel: 'Kurumsal',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Sahne ışıklandırması ve protokol masa düzeni',
    isSample: true,
  },
];
