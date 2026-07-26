export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  coverImage: string;
  features: string[];
  processSteps: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'dugun',
    slug: 'dugun',
    title: 'Düğün Organizasyonu',
    shortDesc: 'Hayalinizdeki lüks düğün konseptini tasarım, süsleme ve kusursuz canlı koordinasyon ile hayata geçiriyoruz.',
    fullDesc: 'Palm Stüdyo olarak düğün gününüzün her anını büyüleyici bir masala dönüştürüyoruz. Konsept tasarımdan masa düzenine, sahne ışıklandırmasından dijital anı albümüne kadar tüm detayları eksiksiz planlıyoruz.',
    iconName: 'Heart',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Özel Konsept & Konsept Panosu Tasarımı',
      'Masa, Sandalye ve Canlı Çiçek Dekorasyonu',
      'Gelin Yolu ve Nikah Kürsüsü Tasarımı',
      'Profesyonel Ses, Işık ve Sahne Kurulumu',
      'Etkinlik Günü Koordinatörlüğü',
      'Palm Stüdyo Dijital Anı Albümü Entegrasyonu',
    ],
    processSteps: [
      'Konsept Görüşmesi & Hayallerin Dinlenmesi',
      'Mekân Keşfi & 3D Yerleşim Planlaması',
      'Tasarım ve Dekor Seçimleri',
      'Etkinlik Günü Kurulum & Yönetim',
    ],
    faqs: [
      {
        question: 'Düğün organizasyonuna ne kadar süre önce başlanmalı?',
        answer: 'Kusursuz bir planlama için ideal süre etkinlik tarihinden 3 ila 6 ay öncesidir.',
      },
      {
        question: 'Dijital Anı Albümü pakete dahil midir?',
        answer: 'Evet, Palm Signature ve Palm Exclusive paketlerimizde Dijital Anı Albümü standart olarak sunulmaktadır.',
      },
    ],
  },
  {
    id: 'kina',
    slug: 'kina',
    title: 'Kına Gecesi Organizasyonu',
    shortDesc: 'Geleneksel motifleri modern ve zarif dokunuşlarla harmanlayan unutulmaz kına organizasyonları.',
    fullDesc: 'Kına gecenizin coşkusunu ve zarafetini özel konsept tahtlar, şık dekorlar ve eksiksiz ritüel planlaması ile taçlandırıyoruz.',
    iconName: 'Sparkles',
    coverImage: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Görkemli Kına Tahtı ve Şark Köşesi Konsepti',
      'Nedime Kıyafetleri ve Aksesuar Setleri',
      'Kına Çıkışı ve Dans Koreografisi Destekleri',
      'Kişiye Özel İkram ve Hediyelik Tasarımları',
      'Dijital QR Fotoğraf Albümü',
    ],
    processSteps: [
      'Tema & Taht Seçimi',
      'Aksesuar ve Müzik Listesi Koordinasyonu',
      'Gecenin Akış Planlaması ve Prova',
    ],
    faqs: [
      {
        question: 'Kına tahtı seçenekleri nelerdir?',
        answer: 'Klasik kırmızı-altın detaylı tahtların yanı sıra modern bohem ve avangart kına tahtı seçeneklerimiz mevcuttur.',
      },
    ],
  },
  {
    id: 'nisan',
    slug: 'nisan',
    title: 'Nişan & Söz Organizasyonu',
    shortDesc: 'Evliliğe atılan ilk adımda romantik, şık ve samimi konsept alanlar tasarlıyoruz.',
    fullDesc: 'Söz ve nişan merasimleriniz için ev veya mekan ortamına uygun özel fonlar, nişan masaları ve şık ikram alanları oluşturuyoruz.',
    iconName: 'Gem',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Özel Pleksi, Ahşap veya Çiçek Fon Tasarımları',
      'Nişan Masası, Tepsi ve Makas Setleri',
      'Kişiye Özel İsimlik ve Hoş Geldiniz Panoları',
      'Dijital Anı Paylaşım Platformu',
    ],
    processSteps: ['Mekan Boyutuna Göre Tasarım Seçimi', 'Çiçek ve Renk Paleti Belirleme', 'Kurulum ve Teslimat'],
    faqs: [
      {
        question: 'Evde nişan organizasyonu yapıyor musunuz?',
        answer: 'Evet, ev veya bahçe ortamlarına özel kompakt ve son derece şık nişan köşeleri hazırlamaktayız.',
      },
    ],
  },
  {
    id: 'dogum-gunu',
    slug: 'dogum-gunu',
    title: 'Doğum Günü & Baby Shower',
    shortDesc: 'Yeni yaş ve bebek kutlamalarında renkli, neşeli ve tematik alan tasarımları.',
    fullDesc: 'Yetişkin doğum günleri, 1 yaş kutlamaları ve baby shower partilerinde kişiye özel konseptlerle unutulmaz anlar yaratıyoruz.',
    iconName: 'PartyPopper',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Balon Zinciri ve Tematik Arka Fonlar',
      'Candy Bar ve İkram Masası Süslemeleri',
      'Fotoğraf Çekim Alanları',
      'QR Fotoğraf Albümü Hizmeti',
    ],
    processSteps: ['Tema Belirleme', 'Balon ve Obje Tasarımları', 'Parti Günü Kurulum'],
    faqs: [
      {
        question: 'Açık havada doğum günü konsepti hazırlanabilir mi?',
        answer: 'Evet, bahçe ve piknik alanları için piknik masalı ve zemin minderli bohem konseptler hazırlamaktayız.',
      },
    ],
  },
  {
    id: 'kurumsal',
    slug: 'kurumsal',
    title: 'Kurumsal Etkinlikler',
    shortDesc: 'Şirket lansmanları, gala geceleri ve ödül törenleri için kurumsal kimliğinize uygun organizasyonlar.',
    fullDesc: 'Kurumsal markanızın zarafetini ve prestijini yansıtan sahne tasarımları, karşılama alanları ve etkinlik yönetimi sunuyoruz.',
    iconName: 'Building2',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Kurumsal Logo & Branding Uyumlu Tasarımlar',
      'Podyum, Sahne ve LED Ekran Sistemleri',
      'Protokol ve İkram Düzeni',
      'Kurumsal Dijital Etkinlik Albümü',
    ],
    processSteps: ['Kurumsal İhtiyaç Analizi', 'Branding & Tasarım Onayı', 'Profesyonel Etkinlik Yönetimi'],
    faqs: [
      {
        question: 'Fatura ve kurumsal ödeme şartları nasıl işler?',
        answer: 'Tüm organizasyonlarımız kurumsal faturalı ve sözleşmeli olarak yürütülmektedir.',
      },
    ],
  },
  {
    id: 'dijital-ani-albumu',
    slug: 'dijital-ani-albumu',
    title: 'Dijital Anı Albümü (Palm Anılar)',
    shortDesc: 'Misafirlerinizin çektiği tüm fotoğraflar uygulama indirmeden tek bir güvenli QR albümde toplansın.',
    fullDesc: 'Etkinliğinize özel üretilen şık QR kodları masalara yerleştiriyoruz. Misafirleriniz telefon kameralarıyla QR kodu okutarak Palm Stüdyo markalı etkinlik sayfanıza ulaşır ve çektikleri fotoğrafları anında paylaşır.',
    iconName: 'QrCode',
    coverImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Uygulama İndirmeden Anında Kullanım',
      'Etkinliğe Özel Tasarlanmış Karşılama Sayfası',
      'Kamera Roll ve Canlı Çekim Desteği',
      'Yönetici Onaylı Moderasyon Paneli',
      'Toplu Yüksek Çözünürlüklü ZIP İndirme',
      'Şifreli ve Süreli İndirme Bağlantısı',
    ],
    processSteps: [
      'Etkinlik Oluşturulması & QR Kod Basımı',
      'Masalara ve Girişe QR Kodların Yerleştirilmesi',
      'Misafirlerin Fotoğraf Paylaşımı',
      'Fotoğrafların Onaylanması ve ZIP Olarak Teslim Edilmesi',
    ],
    faqs: [
      {
        question: 'Misafirlerin uygulama indirmesi gerekiyor mu?',
        answer: 'Hayır! Sadece telefon kamerası ile QR kodu okutmaları yeterlidir.',
      },
      {
        question: 'Fotoğrafları kimler görebilir ve indirebilir?',
        answer: 'Fotoğraflar yalnızca etkinlik yöneticisi onayından geçer ve sadece size verilen şifreli teslimat bağlantısıyla topluca indirilebilir.',
      },
    ],
  },
];
