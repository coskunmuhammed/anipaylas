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
    id: 'fotograf-cekimi',
    slug: 'fotograf-cekimi',
    title: 'Fotoğraf Çekimi',
    shortDesc: 'Doğal plato ışığında, Didim koylarında ve açık hava setlerimizde fark yaratan retouch dokunuşuyla en iyi kareler.',
    fullDesc: 'Didim merkez stüdyomuz ve Ege sahil şeridinde uzman ekibimizle çiftlerimize unutulmaz kareler sunuyoruz. Düğün günü hikaye çekiminden dış mekan albüm çekimlerine kadar tüm detayları yüksek çözünürlüklü ekipmanlarla ölümsüzleştiriyoruz.',
    iconName: 'Camera',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Didim & Ege Sahil Şeridi Dış Mekan Çekimi',
      'Doğal Işık & Plato Set Çalışması',
      'Profesyonel Retouch ve Renk Düzenleme',
      'Yüksek Çözünürlüklü Dijital Kare Teslimatı',
      'Özel Konsept Çekim Planlaması',
    ],
    processSteps: [
      'Ön Görüşme & Konsept Seçimi',
      'Çekim Günü Koordinasyon & Çekim',
      'Seçilen Karelerin Retouch İşlemi',
      'Dijital ve Albüm Teslimatı',
    ],
    faqs: [
      {
        question: 'Çekimler ne kadar sürüyor?',
        answer: 'Paket içeriğine bağlı olarak dış mekan ve plato çekimlerimiz ortalama 3 ila 6 saat sürmektedir.',
      },
      {
        question: 'Şehir dışından gelen çiftler için çekim nasıl planlanıyor?',
        answer: 'Didim merkez stüdyomuzda saç, makyaj, gelinlik hazırlığı ve dış mekan çekimini tek güne sığdırarak planlıyoruz.',
      },
    ],
  },
  {
    id: 'video-cekimi',
    slug: 'video-cekimi',
    title: 'Sinematik Video Çekimi',
    shortDesc: 'Fotoğrafla aynı anda; anlarınız unutulmaz sinematik bir filme ve 4K drone kliplerine dönüşür.',
    fullDesc: 'Düğün hikayeniz sinema kalitesinde klip ve belgesel tadında film olarak kurgulanıyor. Havadan 4K drone çekimleri, hikaye diyalogları ve müzik eşliğinde ömür boyu izleyeceğiniz yapımlar sunuyoruz.',
    iconName: 'Film',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    features: [
      '4K Sinematik Düğün Klibi & Reel Çekimi',
      'Professional 4K Drone Çekimleri',
      'Düğün Belgeseli & Gün Boyu Hikaye Çekimi',
      'Özel Ses ve Müzik Kurgusu',
      'Sosyal Medya Formatında Teaser Klipler',
    ],
    processSteps: [
      'Senaryo & Müzik Seçimi',
      'Çekim Günü Çift Kurgusu & Drone Çekimi',
      'Kurgu & Montaj Aşaması',
      'Online & USB Film Teslimatı',
    ],
    faqs: [
      {
        question: 'Drone çekimi hava şartlarına bağlı mıdır?',
        answer: 'Evet, rüzgar ve hava durumuna göre emniyetli uçuş şartları gözetilerek drone çekimleri gerçekleştirilir.',
      },
    ],
  },
  {
    id: 'sac-makyaj',
    slug: 'sac-makyaj',
    title: 'Profesyonel Saç & Makyaj',
    shortDesc: 'Platonun kalbinde; makyajınız hiç bozulmadan çekimi kusursuz tamamlayın.',
    fullDesc: 'Didim merkez stüdyomuz bünyesindeki kuaför ve makyaj artistlerimizle, gelinlerimize dış mekan şartlarına ve nem oranına dayanıklı profesyonel hazırlık sunuyoruz.',
    iconName: 'Sparkles',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Suya & Neme Dayanıklı Porselen Makyaj',
      'Dış Mekan & Rüzgara Dayanıklı Saç Tasarımı',
      'Stüdyo İçi Konforlu Gelin Hazırlık Kabinleri',
      'Çekim Esnasında Rötuş & Dokunuş Desteği',
    ],
    processSteps: [
      'Gelinlik & Konsept Uyumlu Saç/Makyaj Provası',
      'Çekim Günü Stüdyoda Hazırlık',
      'Son Dokunuşlar & Çekime Geçiş',
    ],
    faqs: [
      {
        question: 'Makyaj gün boyu kalıcı mıdır?',
        answer: 'Kullandığımız sabitleyici ve profesyonel porselen ürünler sayesinde neme ve sıcağa karşı yüksek kalıcılık sağlanır.',
      },
    ],
  },
  {
    id: 'gelinlik',
    slug: 'gelinlik',
    title: 'Gelinlik Kiralama & Showroom',
    shortDesc: '200+ özel tasarım model; showroom’da konforlu kabinlerde profesyonel hazırlık.',
    fullDesc: 'Stüdyomuz bünyesindeki 200’den fazla Helen, Bohem ve Prenses model gelinlik koleksiyonumuz arasından çekiminize en uygun modeli deneyip kiralayabilirsiniz.',
    iconName: 'Heart',
    coverImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80',
    features: [
      '200+ Özel Tasarım Bohem & Klasik Gelinlik',
      'Kuru Temizleme ve Beden Tadilat Hizmeti',
      'Duvak, Taç ve Aksesuar Seçenekleri',
      'Çekim Günü Stüdyoda Giyinme Konforu',
    ],
    processSteps: [
      'Showroom Randevusu & Model Denemeleri',
      'Beden ve Boy Tadilatı',
      'Çekim Günü Teslimat ve Kullanım',
    ],
    faqs: [
      {
        question: 'Gelinlik kiralama çekim paketine dahil edilebilir mi?',
        answer: 'Evet, VIP paketlerimizde gelinlik kiralama ve aksesuar kullanımı dahildir.',
      },
    ],
  },
  {
    id: 'album-baski',
    slug: 'album-baski',
    title: 'Panoramik Albüm Baskı',
    shortDesc: 'Kareleriniz yıpranmadan, eskimeden bir ömür boyu sizinle yaşasın.',
    fullDesc: 'Birinci sınıf kadife, deri ve ahşap kapaklı panoramik albüm baskılarıyla anılarınızı fiziksel olarak nesiller boyu saklamanızı sağlıyoruz.',
    iconName: 'BookOpen',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Panoramik İpek Kağıt Baskı Teknolojisi',
      'Deri, Ahşap ve Kadife Kapak Seçenekleri',
      'Aile Albümleri & A3 Kristal Panolar',
      'Özel Koruma Kutusu ve Kadife Kılıf',
    ],
    processSteps: [
      'Fotoğraf Seçimi (İnternet Üzerinden Seçim)',
      'Albüm Sayfa Tasarımı ve Onay',
      'Baskı ve Ciltleme',
      'Adrese Güvenli Kargo Teslimatı',
    ],
    faqs: [
      {
        question: 'Albüm tasarımı onayımıza sunuluyor mu?',
        answer: 'Evet, dijital tasarım hazırlanıp onayınız alındıktan sonra baskıya gönderilmektedir.',
      },
    ],
  },
  {
    id: 'organizasyon',
    slug: 'organizasyon',
    title: 'Düğün & Etkinlik Organizasyonu',
    shortDesc: 'Mekân süslemesi, konsept dekorlar ve tüm davet akışının profesyonel planlaması.',
    fullDesc: 'Masa süslemelerinden sahne ışıklandırmasına, gelin yolundan canlı çiçek dekorlarına kadar tüm organizasyonu kusursuz yönetiyoruz.',
    iconName: 'Layers',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    features: [
      'Özel Konsept & Masa Dekorasyonları',
      'Gelin Yolu ve Nikah Kürsüsü Kurulumu',
      'Ses, Işık ve Canlı Müzik Ekipmanları',
      'Etkinlik Günü Canlı Koordinasyon',
    ],
    processSteps: [
      'Mekan Keşfi & Bütçe Planlama',
      'Dekor ve Çiçek Seçimi',
      'Etkinlik Günü Kurulum',
    ],
    faqs: [
      {
        question: 'Didim dışındaki şehirlerde organizasyon yapıyor musunuz?',
        answer: 'Evet, başta Ege ve Marmara bölgeleri olmak üzere tüm Türkiye’de organizasyon kurulumları yapmaktayız.',
      },
    ],
  },
  {
    id: 'dijital-ani-albumu',
    slug: 'dijital-ani-albumu',
    title: 'Dijital Anı Albümü (Palm Anılar)',
    shortDesc: 'Misafirlerinizin çektikleri tüm fotoğraflar uygulama indirmeden tek bir güvenli QR albümde toplansın.',
    fullDesc: 'Etkinliğinize özel üretilen şık QR kodları masalara yerleştiriyoruz. Misafirleriniz telefon kameralarıyla QR kodu okutarak Palm Stüdyo markalı etkinlik sayfanıza ulaşır ve çektikleri fotoğrafları anında paylaşır.',
    iconName: 'QrCode',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
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
