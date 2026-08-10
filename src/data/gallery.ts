export interface GalleryItem {
  id: string;
  title: string;
  category: 'fotograf' | 'sahil' | 'video' | 'kir' | 'detay' | 'dijital-album';
  categoryLabel: string;
  imageUrl: string;
  subtitle: string;
  isSample: boolean;
}

export const galleryData: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Dış Mekan Düğün Çekimi',
    category: 'fotograf',
    categoryLabel: 'Fotoğraf Çekimi',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Doğal plato ışığı ve zamansız kurgu tonları',
    isSample: true,
  },
  {
    id: 'gal-2',
    title: 'Ege Sahili Gün Batımı',
    category: 'sahil',
    categoryLabel: 'Sahil Çekimi',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Altın saatlerde Didim koylarında büyüleyici kareler',
    isSample: true,
  },
  {
    id: 'gal-3',
    title: 'Sinematik Düğün Hikayesi',
    category: 'video',
    categoryLabel: 'Sinematik Video',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    subtitle: '4K çözünürlüklü kurgulu ve duygusal klip çekimi',
    isSample: true,
  },
  {
    id: 'gal-4',
    title: 'Kır & Ağaçlık Alan Çekimi',
    category: 'kir',
    categoryLabel: 'Kır Çekimi',
    imageUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Doğal ortamlarda bohem ve samimi çift portreleri',
    isSample: true,
  },
  {
    id: 'gal-5',
    title: 'Gelin Hazırlık & Detay Çekimi',
    category: 'detay',
    categoryLabel: 'Detay Çekimleri',
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Aksesuar, gelinlik ve duygu dolu ilk bakış anları',
    isSample: true,
  },
  {
    id: 'gal-6',
    title: 'QR Dijital Anı Albümü Kareleri',
    category: 'dijital-album',
    categoryLabel: 'Dijital Anı Albümü',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Davetlilerin telefonlarıyla çekip anında albüme yüklediği anılar',
    isSample: true,
  },
];
