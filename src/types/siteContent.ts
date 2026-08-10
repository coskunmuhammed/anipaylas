export interface ServiceCardItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  isHighlight?: boolean;
}

export interface ConceptCardItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

export interface StoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
}

export interface TestimonialCardItem {
  id: string;
  name: string;
  location?: string;
  rating: number;
  text: string;
  date?: string;
}

export interface HomepageContent {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    badgeText: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    backgroundPhotos: string[];
  };
  memoryStatement: {
    photo1: string;
    photo2: string;
    photo3: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: ServiceCardItem[];
  };
  serviceArea: {
    eyebrow: string;
    title: string;
    description: string;
    studioGuaranteeTitle: string;
    studioGuaranteeText: string;
  };
  concepts: {
    eyebrow: string;
    title: string;
    description: string;
    items: ConceptCardItem[];
  };
  stories: {
    eyebrow: string;
    title: string;
    description: string;
    items: StoryCardItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: TestimonialCardItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    phoneText: string;
  };
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    eyebrow: 'DİDİM BÖLGESİNİN LÜKS DÜĞÜN STÜDYO VE DIŞ ÇEKİM HİZMETİ',
    titleLine1: 'PALM STUDIO',
    titleLine2: 'Özel Çekim Konseptleri & Dijital Anı Albümü',
    description: 'Didim, Aydın, İzmir ve Türkiye’nin 81 ilinden gelen çiftlerimiz için düğün fotoğrafçılığı, dış mekan, saç & makyaj ve anında QR kodlu dijital fotoğraf paylaşım deneyimini tek çatı altında sunuyoruz.',
    badgeText: '✨ DİDİM MERKEZLİ & 81 İL ÇEKİM HİZMETİ',
    primaryCtaText: 'Randevu & Fiyat Alın',
    secondaryCtaText: 'Bizi Arayın',
    backgroundPhotos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    ],
  },
  memoryStatement: {
    photo1: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    photo2: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    photo3: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  services: {
    eyebrow: 'HİZMETLERİMİZ',
    title: 'A’dan Z’ye Etkinlik & Çekim Çözümleri',
    description: 'Düğün fotoğrafçılığından dış mekan çekimlerine, saç & makyajdan misafirleriniz için uygulamasız QR anı albümüne kadar tüm süreçleri planlıyoruz.',
    items: [
      {
        id: 'fotograf-cekimi',
        title: 'Fotoğraf Çekimi',
        slug: 'fotograf-cekimi',
        description: 'Doğal plato ışığında, fark yaratan retouch dokunuşuyla en iyi kareler.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'video-cekimi',
        title: 'Video Çekimi',
        slug: 'video-cekimi',
        description: 'Fotoğrafla aynı anda; anlarınız unutulmaz sinematik bir filme dönüşür.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'sac-makyaj',
        title: 'Saç & Makyaj',
        slug: 'sac-makyaj',
        description: 'Platonun kalbinde; makyajınız hiç bozulmadan çekimi kusursuz tamamlayın.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'gelinlik',
        title: 'Gelinlik Kiralama',
        slug: 'gelinlik',
        description: '200+ özel tasarım model; showroom’da konforlu kabinlerde profesyonel hazırlık.',
        image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'album-baski',
        title: 'Albüm Baskı',
        slug: 'album-baski',
        description: 'Kareleriniz yıpranmadan, eskimeden bir ömür boyu sizinle yaşasın.',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'organizasyon',
        title: 'Organizasyon',
        slug: 'organizasyon',
        description: 'Mekân süslemesi, konsept dekorlar ve tüm davet akışının profesyonel planlaması.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'dijital-ani-albumu',
        title: 'Dijital Anı Albümü',
        slug: 'dijital-ani-albumu',
        description: 'Misafirleriniz QR kod ile üye olmadan kendi çektikleri fotoğrafları anında yükler.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        isHighlight: true,
      },
    ],
  },
  serviceArea: {
    eyebrow: 'NEREDEN GELİYORLAR?',
    title: 'Didim’deyiz, hikâyeleriniz Türkiye’nin 81 ilinden geliyor.',
    description: 'Didim merkez stüdyomuzdan Türkiye’nin 81 iline ışınlanan anılar ve yurt dışından gelen çiftlerimiz için çekim, konsept ve organizasyon süreçlerini tek çatı altında planlıyoruz.',
    studioGuaranteeTitle: 'Tüm çekimler ve organizasyon detayları stüdyomuz koordinasyonunda yönetilir.',
    studioGuaranteeText: 'Türkiye’nin 81 ilinden veya yurt dışından gelen tüm çiftlerimiz için Didim merkez stüdyomuzda çekim, gelinlik, saç & makyaj, konaklama ve ulaşım planlamasını tek güne sığdırarak stresi sıfıra indiriyoruz.',
  },
  concepts: {
    eyebrow: 'İMZA KONSEPTLER',
    title: 'Aşkınızı Sanata Dönüştüren Temalar',
    description: 'Aşk Bahçeleri, Antik Kentsel Miras, Ege Gün Batımı ve Minimal Lüks Stüdyo konseptlerimizle hayalinizdeki kareleri ölümsüzleştiriyoruz.',
    items: [
      {
        slug: 'bohem-bahce',
        title: 'Bohem Bahçe',
        category: 'BOHEM',
        description: 'Doğal ahşap ve kurutulmuş pampa dokunuşlarıyla rüya gibi bir kır atmosferi.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      },
      {
        slug: 'zamansiz-beyaz',
        title: 'Zamansız Beyaz',
        category: 'ZAMANSIZ',
        description: 'Sade şıklık, beyaz tüller ve zamansız ışık açılarıyla çekilen romantik kareler.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      },
      {
        slug: 'ege-gun-batimi',
        title: 'Ege Gün Batımı',
        category: 'DOĞAL IŞIK',
        description: 'Altın saatlerde sahil şeridinde sinematik ve büyüleyici çift portreleri.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      },
      {
        slug: 'vintage-romance',
        title: 'Vintage Romance',
        category: 'VINTAGE',
        description: 'Nostaljik renk paleti ve nostalji detaylarıyla film estetiğinde konsept.',
        image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
      },
      {
        slug: 'gece-isiklari',
        title: 'Gece Işıkları',
        category: 'GECE',
        description: 'Perili ışıklar ve mum detaylarıyla romantik akşam çekim seti.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  stories: {
    eyebrow: 'HİKÂYELER',
    title: 'Gerçek Hikâyeler',
    description: 'Çiftlerin highlight videoları; seçtikleri paket ve konseptle birlikte.',
    items: [
      {
        id: '1',
        title: 'Sevginin Sırrı',
        subtitle: 'Çift highlight’ı',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        title: 'Aşka Doyun',
        subtitle: 'Çift highlight’ı',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        title: 'Beraberlik Kalpleri Birleştirir',
        subtitle: 'Çift highlight’ı',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  testimonials: {
    eyebrow: 'MUTLU ÇİFTLERİMİZ',
    title: 'Hikâyelerine Tanık Olduğumuz Çiftler Ne Diyor?',
    description: 'Türkiye’nin dört bir yanından Didim’e gelen çiftlerimizin unutulmaz çekim deneyimleri ve geri bildirimleri.',
    items: [
      {
        id: '1',
        name: 'Elif & Burak K.',
        location: 'İzmir → Didim',
        rating: 5,
        text: 'Didim’deki dış çekimimiz tam hayal ettiğimiz gibi geçti! Saç & makyaj ekibinden fotoğrafçımıza kadar herkes mükemmeldi. Dijital QR anı albümü ile tüm davetlilerimizin çektiği kareleri anında toplayabildik.',
        date: 'Ağustos 2026',
      },
      {
        id: '2',
        name: 'Selin & Mert Y.',
        location: 'İstanbul → Didim',
        rating: 5,
        text: 'İstanbul’dan çekim için geldik, konaklama ve çekim günümüz tek bir günde harika bir organizasyonla tamamlandı. Fotoğraf kalitesi ve retouch dokunuşları gerçekten üst seviye!',
        date: 'Temmuz 2026',
      },
      {
        id: '3',
        name: 'Ayşe & Caner D.',
        location: 'Ankara → Didim',
        rating: 5,
        text: 'Ege Gün Batımı konseptinde çekildiğimiz fotoğraflara bayıldık! Albüm baskıları elimize ulaştığında kalitesine inanamadık. Herkese tavsiye ediyoruz.',
        date: 'Haziran 2026',
      },
    ],
  },
  contact: {
    eyebrow: 'REZERVASYON & İLETİŞİM',
    title: 'Hayalinizdeki Çekimi Birlikte Planlayalım',
    description: 'Etkinlik tarihinizin uygunluğunu sorgulamak, konsept önerisi almak ve özel fiyat teklifimizi öğrenmek için bizimle anında iletişime geçin.',
    phoneText: '+90 (544) 630 84 94',
  },
};
