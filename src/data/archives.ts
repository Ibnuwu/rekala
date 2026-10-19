import { type CategoryLabel, CATEGORY_LABELS } from './categories';

export type ArchiveCategory =
  | CategoryLabel
  | 'Infrastruktur'
  | 'Pertahanan & Cagar Budaya'
  | 'Seni & Seni Tradisional'
  | 'Bangunan Bersejarah'
  | 'Tradisi & Sosial'
  | 'Sosial & Tokoh'
  | 'Peristiwa Sejarah'
  | 'Tradisi & Adat'
  | 'Cagar Budaya'
  | 'Alam & Pesisir'
  | (string & {});

export type ArchiveSource = {
  title: string;
  url: string;
};

export type Archive = {
  id: string;
  title: string;
  year?: string;
  location?: string;
  category: ArchiveCategory;
  shortDescription: string;
  description: string;
  context?: string;
  sources: ArchiveSource[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  featured?: boolean;
  isPlaceholder?: boolean;
  verified?: boolean;
};

export const CATEGORIES = CATEGORY_LABELS;

export const archives: Archive[] = [
  {
    id: 'Arsip-01',
    title: 'Dokter Misionaris A.A. Pennings (Kanan) Bersama Keluarganya Di Sebuah Taman di Rangkasbitung, Tahun 1898',
    year: '1898',
    location: 'Rangkasbitung, Lebak',
    category: 'Tokoh',
    shortDescription:
      'Dokumentasi sejarah Dokter A.A. Pennings bersama keluarganya di sebuah taman di Rangkasbitung pada Tahun 1898.',
    description:
      'Foto tersebut merupakan dokumentasi sejarah yang memperlihatkan Dokter A.A. Pennings bersama keluarganya di sebuah taman di Rangkasbitung pada Tahun 1898. Foto hitam putih ini menggambarkan kehidupan keluarga pada masa kolonial Belanda di wilayah Banten, khususnya Kabupaten Lebak. A.A. Pennings merupakan seorang misionaris asal Belanda yang bertugas di wilayah Lebak sejak Tahun 1894. Selain menjalankan kegiatan misi keagamaan, ia juga melakukan kegiatan pendidikan dengan mengajarkan baca-tulis serta memberikan pelayanan kesehatan kepada masyarakat. Kehadirannya menjadi bagian dari catatan sejarah perkembangan kegiatan misionaris di wilayah Lebak pada akhir abad ke-19.',
    sources: [
      {
        title: 'Buku Toponimi Nama-nama Kecamatan di Kabupaten Lebak (Hlm. 90)',
        url: 'https://fliphtml5.com/rgums/ymbf/Toponimi_Nama-nama_Kecamatan_di_Kabupaten_Lebak/',
      },
      {
        title: 'Katalog Buku Misionarisme di Banten – Kemendagri',
        url: 'https://perpustakaan.kemendagri.go.id/opac/index.php?id=6192&p=show_detail',
      },
    ],
    image: {
      src: '/archives/Arsip-01.jpg',
      alt: 'Dokter Misionaris A.A. Pennings (Kanan) Bersama Keluarganya Di Sebuah Taman di Rangkasbitung, Tahun 1898',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-02',
    title: 'G.F.J Bley (Kanan) Di Hotel Serang, Tahun 1935',
    year: '1935',
    location: 'Kota Serang',
    category: 'Bangunan',
    shortDescription:
      'Dokumentasi potret G.F.J. Bley di Hotel Serang pada masa pra-kemerdekaan tahun 1935.',
    description:
      'Sebuah foto dari tahun 1935 membawa kita melihat suasana di depan Hotel Serang. Terlihat sebuah mobil klasik terparkir di halaman, sementara tiga orang berdiri di depan bangunan hotel. Menurut keterangan koleksi KITLV, salah satu sosok dalam foto tersebut adalah G.F.J. Bley, fotografer yang mendokumentasikan berbagai sudut kehidupan dan lingkungan di Banten pada masa itu. Foto ini mungkin terlihat sederhana, namun di dalamnya tersimpan informasi penting tentang wajah kota, arsitektur, transportasi, mobilitas masyarakat, serta keberadaan ruang publik di Serang pada masa kolonial. Keberadaan Hotel Serang juga menunjukkan bahwa Serang pada masa itu telah menjadi bagian dari jaringan mobilitas dengan persinggahan orang-orang yang datang dan bepergian melalui wilayah Banten.',
    sources: [
      {
        title: 'Koleksi Digital Universitas Leiden (KITLV 120860)',
        url: 'https://digitalcollections.universiteitleiden.nl/',
      },
      {
        title: 'Wikimedia Commons – Category: History of Serang',
        url: 'https://commons.wikimedia.org/wiki/Category:History_of_Serang',
      },
    ],
    image: {
      src: '/archives/Arsip-02.jpg',
      alt: 'G.F.J Bley (Kanan) Di Hotel Serang, Tahun 1935',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-03',
    title: 'Gedung OSVIA (Sekarang Menjadi Mapolres Serang), Tahun 1925',
    year: '1925',
    location: 'Kota Serang',
    category: 'Bangunan',
    shortDescription:
      'Dokumentasi arsitektur Gedung OSVIA di Serang yang kini beralih fungsi menjadi Mapolres Serang.',
    description:
      'Foto tersebut memperlihatkan kondisi Gedung OSVIA Serang pada Tahun 1925 pada masa pemerintahan Hindia Belanda. Bangunan tampak memiliki arsitektur kolonial dengan halaman yang luas, atap bertingkat, teras dengan tiang-tiang, serta pepohonan di bagian depan. OSVIA merupakan sekolah yang didirikan untuk mendidik calon pegawai pribumi atau Pangreh Praja yang nantinya bekerja dalam birokrasi pemerintahan kolonial. Gedung tersebut kemudian mengalami perubahan fungsi; sumber resmi data cagar budaya mencatat bahwa bangunan yang dahulu digunakan sebagai OSVIA tersebut kini digunakan sebagai Mapolres Serang dan telah ditetapkan sebagai Cagar Budaya Tingkat Nasional melalui SK. PM.55/PW.007/MKP/2010.',
    sources: [
      {
        title: 'Wikimedia Commons – Koleksi Foto OSVIA Serang (KITLV 141835)',
        url: 'https://commons.wikimedia.org/wiki/Category%3AOSVIA_Serang',
      },
      {
        title: 'Data Cagar Budaya Mapolres Serang – Kemendikbudristek',
        url: 'https://budaya.data.kemdikbud.go.id/cagarbudaya/objek/KB000056',
      },
    ],
    image: {
      src: '/archives/Arsip-03.jpg',
      alt: 'Gedung OSVIA (Sekarang Menjadi Mapolres Serang), Tahun 1925',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-04',
    title: 'Salah Satu Sudut Pasar (Lama) di Serang, Tahun 1890',
    year: '1890',
    location: 'Kota Serang',
    category: 'Peristiwa',
    shortDescription:
      'Dokumentasi suasana dan aktivitas perniagaan di salah satu sudut Pasar Lama Serang tahun 1890.',
    description:
      'Foto tersebut memperlihatkan suasana Pasar Lama di Serang, Banten pada tahun 1890 pada masa kolonial. Terlihat aktivitas masyarakat yang sedang berada di kawasan pasar, sejumlah pedagang, bangunan pasar tradisional, pepohonan, serta kendaraan tradisional berupa delman/kereta yang ditarik kuda. Pasar Lama sendiri merupakan salah satu kawasan perdagangan bersejarah di Kota Serang dan berada di dekat kawasan alun-alun.',
    sources: [
      {
        title: 'Jurnal Patanjala: Perkotaan Kolonial di Kota Serang (Lia Nuralia, 2013)',
        url: 'https://garuda.kemdiktisaintek.go.id/documents/detail/737958',
      },
      {
        title: 'Wikimedia Commons – Sejarah Kota Serang',
        url: 'https://commons.wikimedia.org/wiki/Category:History_of_Serang',
      },
    ],
    image: {
      src: '/archives/Arsip-04.jpg',
      alt: 'Salah Satu Sudut Pasar (Lama) di Serang, Tahun 1890',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-05',
    title: 'Benteng Speelwijk (Tampak 2 Buah Meriam), Tahun 1920',
    year: '1920',
    location: 'Banten Lama',
    category: 'Bangunan',
    shortDescription:
      'Dokumentasi reruntuhan Benteng Speelwijk dengan dua buah meriam bersejarah di kawasan Banten Lama.',
    description:
      'Foto tersebut menampilkan kondisi Benteng Speelwijk di kawasan Banten Lama pada Tahun 1920. Terlihat bagian bangunan benteng yang telah berupa reruntuhan dengan dinding pertahanan dan dua buah meriam yang menjadi bagian dari sistem pertahanan benteng. Di belakang bangunan tampak deretan pohon kelapa yang menggambarkan lingkungan sekitar kawasan benteng pada masa tersebut. Benteng Speelwijk merupakan peninggalan masa VOC di Banten yang berada di Kampung Pamarican, Kecamatan Kasemen, Kota Serang. Benteng ini dibangun pada akhir abad ke-17 dan memiliki fungsi sebagai pertahanan sekaligus mendukung pengawasan dan pengendalian aktivitas perdagangan VOC di Banten. Nama Speelwijk berasal dari Cornelis Janszoon Speelman, Gubernur Jenderal VOC pada 1681-1684.',
    sources: [
      {
        title: 'Data Cagar Budaya Benteng Speelwijk – Kemendikbudristek',
        url: 'https://referensi.data.kemendikdasmen.go.id/budayakita/cagarbudaya/objek/KB000240',
      },
      {
        title: 'Buku Citra Serang dalam Arsip – ANRI',
        url: 'https://www.anri.go.id/download/naskah-sumber-arsip-citra-daerah-kota-serang-dalam-arsip-1586333697',
      },
    ],
    image: {
      src: '/archives/Arsip-05.jpg',
      alt: 'Benteng Speelwijk (Tampak 2 Buah Meriam), Tahun 1920',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-06',
    title: 'Kuburan Warga Tionghoa di Tangerang, Tahun 1931',
    year: '1931',
    location: 'Tangerang',
    category: 'Budaya',
    shortDescription:
      'Dokumentasi kompleks pemakaman warga Tionghoa di kawasan Tangerang pada dekade 1930-an.',
    description:
      'Foto tersebut merupakan dokumentasi sejarah yang memperlihatkan Kompleks Pemakaman Warga Tionghoa di Tangerang pada Tahun 1931. Terlihat beberapa makam dengan bentuk gundukan, pagar sederhana, serta pepohonan dan lingkungan terbuka di sekitarnya. Bentuk pemakaman tersebut menunjukkan karakteristik pemakaman masyarakat Tionghoa pada masa kolonial. Foto ini dapat menjadi bukti visual mengenai keberadaan dan kehidupan komunitas Tionghoa di wilayah Tangerang sejak masa sebelum kemerdekaan Indonesia. Tradisi ziarah makam atau Ceng Beng merupakan salah satu bentuk penghormatan kepada leluhur.',
    sources: [
      {
        title: 'Wikimedia Commons – Chinese Graves in Indonesia (Historical Images)',
        url: 'https://commons.wikimedia.org/wiki/Category%3AChinese_graves_in_Indonesia_%28historical_images%29',
      },
    ],
    image: {
      src: '/archives/Arsip-06.jpg',
      alt: 'Kuburan Warga Tionghoa di Tangerang, Tahun 1931',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-07',
    title: 'Elisabeth Pennings, Putri dari A.A. Pennings Seorang Dokter Misionaris di Rangkasbitung, Lebak, Tahun 1898',
    year: '1898',
    location: 'Rangkasbitung, Lebak',
    category: 'Tokoh',
    shortDescription:
      'Potret Elisabeth Pennings, putri dari Dokter Misionaris A.A. Pennings di Rangkasbitung, Lebak.',
    description:
      'Foto hitam putih ini memperlihatkan seorang anak perempuan bernama Elisabeth Pennings yang sedang duduk sambil menggendong seekor anak anjing. Ia mengenakan pakaian anak bergaya Eropa pada akhir abad ke-19. Foto tersebut dibuat di wilayah Rangkasbitung, Lebak, Banten pada Tahun 1898. Elisabeth merupakan putri A.A. Pennings (Antonie Adriaan Pennings), yang tercatat sebagai seorang guru/misionaris (Zendeling) di Lebak Banten/Rangkasbitung pada akhir abad ke-19.',
    sources: [
      {
        title: 'Katalog Buku Misionarisme di Banten – Kemendagri',
        url: 'https://perpustakaan.kemendagri.go.id/opac/index.php?id=6192&p=show_detail',
      },
      {
        title: 'Ons Land – Koleksi Foto Elisabeth Pennings',
        url: 'https://www.onsland.nl/zoeken?tab=http%3A%2F%2Fschema.org%2FPhotograph&term=Elisabeth+Pennings',
      },
    ],
    image: {
      src: '/archives/Arsip-07.jpg',
      alt: 'Elisabeth Pennings, Putri dari A.A. Pennings Seorang Dokter Misionaris di Rangkasbitung, Lebak, Tahun 1898',
      width: 1024,
      height: 768,
    },
    featured: false,
  },
  {
    id: 'Arsip-08',
    title: 'Gerbang Makam di Kenari, Tahun 1930',
    year: '1930',
    location: 'Kota Serang',
    category: 'Bangunan',
    shortDescription:
      'Dokumentasi arsitektur gerbang makam bersejarah di Kenari, Kasemen, Kota Serang pada tahun 1930.',
    description:
      'Dokumentasi foto sejarah yang memperlihatkan pintu masuk menuju Kompleks Makam Kenari di kawasan Banten pada tahun 1930. Pada foto tampak gerbang kuno yang tersusun dari bata, dengan bentuk arsitektur tradisional yang memiliki susunan bertingkat pada bagian atasnya. Lingkungan di sekitar gerbang masih berupa area yang dipenuhi pepohonan dan tanah, sehingga menggambarkan kondisi kawasan makam pada masa lampau. Kompleks Makam Kenari berada di Kampung Kenari, Kasunyatan, Kecamatan Kasemen, Kota Serang, Banten. Kompleks ini berkaitan dengan Sultan Abdul Mufakhir Mahmud Abdul Kadir (1596-1651) atau Sultan Kenari, serta putranya, Sultan Abdul Ma\'ali Ahmad. Di sekitarnya juga terdapat makam kerabat dan relasi keluarga Kesultanan Banten.',
    sources: [
      {
        title: 'Buku Ragam Pusaka Banten (Direktorat Perlindungan Kebudayaan)',
        url: 'https://repositori.kemendikdasmen.go.id/25723/2/Buku%20Ragam%20Pusaka%20Banten.pdf',
      },
      {
        title: 'Potensi Cagar Budaya Aliran Sungai Cibanten – BPCB Banten',
        url: 'https://kebudayaan.kemdikbud.go.id/bpcbbanten/potensi-cagar-budaya-di-aliran-sungai-cibantenhasil-ekspedisi-aliran-sungai-cibanten/',
      },
    ],
    image: {
      src: '/archives/Arsip-08.jpg',
      alt: 'Gerbang Makam di Kenari, Tahun 1930',
      width: 1024,
      height: 768,
    },
    featured: false,
  },
  {
    id: 'Arsip-09',
    title: 'Pengrajin Topi Pandan di Tangerang, Tahun 1925',
    year: '1925',
    location: 'Tangerang',
    category: 'Budaya',
    shortDescription:
      'Dokumentasi pengrajin anyaman topi pandan tradisional yang menjadi kerajinan khas masyarakat Tangerang.',
    description:
      'Foto memperlihatkan proses pembuatan topi secara tradisional menggunakan bahan pandan yang menjadi salah satu kerajinan khas dan sumber mata pencaharian masyarakat Tangerang pada masa tersebut. Pada masa itu, daun pandan merupakan salah satu bahan yang mudah ditemukan dan dapat dimanfaatkan untuk berbagai kerajinan. Daun tersebut diolah dan dianyam secara manual dengan ketelitian dan keterampilan tangan. Proses pembuatan topi membutuhkan kesabaran karena setiap helai pandan harus disusun dan dianyam dengan rapi agar menghasilkan bentuk topi yang kuat dan nyaman digunakan.',
    sources: [
      {
        title: 'Daftar Arsip Foto KIT Batavia (1930) – ANRI',
        url: 'https://anri.go.id/download/daftar-arsip-foto-koninklijke-instituut-voor-troepen-kitbatavia-1930-1586221636',
      },
      {
        title: 'Topi Bambu Kerajinan Unggulan – Pemerintah Kabupaten Tangerang',
        url: 'https://tangerangkab.go.id/detail-berita/topi-bambu-kerajinan-unggulan-di-kabupaten-tangerang',
      },
    ],
    image: {
      src: '/archives/Arsip-09.jpg',
      alt: 'Pengrajin Topi Pandan di Tangerang, Tahun 1925',
      width: 1024,
      height: 768,
    },
    featured: true,
  },
  {
    id: 'Arsip-10',
    title: 'Jembatan Kereta Api di Rangkasbitung, Tahun 1920',
    year: '1920',
    location: 'Rangkasbitung, Lebak',
    category: 'Infrastruktur',
    shortDescription:
      'Dokumentasi konstruksi jembatan rangka besi kereta api di Rangkasbitung pada era Hindia Belanda tahun 1920.',
    description:
      'Foto tersebut memperlihatkan jembatan kereta api di Rangkasbitung pada tahun 1920. Jembatan ini memiliki konstruksi rangka besi yang memanjang mengikuti jalur rel kereta api. Pada bagian tengah terlihat struktur rangka jembatan yang membentang lurus, sedangkan di sisi kiri dan kanan terdapat lingkungan sekitar yang masih didominasi pepohonan. Jembatan tersebut merupakan bagian dari perkembangan sarana transportasi kereta api di wilayah Rangkasbitung pada masa Hindia Belanda. Keberadaan jalur kereta api berperan penting dalam mendukung mobilitas masyarakat serta pengangkutan barang dari dan menuju wilayah Lebak.',
    context:
      'Keberadaan jalur kereta api berperan penting dalam mendukung mobilitas masyarakat serta pengangkutan komoditas dari dan menuju wilayah Lebak.',
    sources: [
      {
        title: 'Daftar Arsip Foto KIT Jawa Barat 1930 – ANRI',
        url: 'https://www.anri.go.id/download/daftar-arsip-foto-kit-jawa-barat-1930-1633327812',
      },
      {
        title: 'Sejarah Stasiun Rangkasbitung – Ensiklopedia Stasiun',
        url: 'https://p2k.stekom.ac.id/ensiklopedia/Stasiun_Rangkasbitung',
      },
    ],
    image: {
      src: '/archives/a.jpeg',
      alt: 'Jembatan Kereta Api di Rangkasbitung, Tahun 1920',
      width: 878,
      height: 1235,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-11',
    title: 'Meriam Ki Amuk di Karangantu Serang, Tahun 1935',
    year: '1935',
    location: 'Karangantu, Kota Serang',
    category: 'Pertahanan & Cagar Budaya',
    shortDescription:
      'Dokumentasi peninggalan meriam legendaris Ki Amuk di kawasan pelabuhan Karangantu, Serang tahun 1935.',
    description:
      'Gambar tersebut memperlihatkan Meriam Ki Amuk yang berada di kawasan Karangantu, Serang, pada tahun 1935. Meriam ini merupakan salah satu peninggalan bersejarah dari masa Kesultanan Banten yang dahulu berfungsi sebagai bagian dari sistem pertahanan maritim untuk melindungi kawasan pelabuhan dari ancaman musuh. Meriam Ki Amuk awalnya ditempatkan di sekitar Pelabuhan Karangantu, menghadap ke arah laut. Seiring waktu, meriam tersebut dipindahkan dan kini menjadi koleksi Museum Situs Kepurbakalaan Banten Lama.',
    context:
      'Meriam Ki Amuk merupakan salah satu peninggalan bersejarah dari masa Kesultanan Banten yang dahulu berfungsi sebagai pertahanan maritim utama.',
    sources: [
      {
        title: 'Meriam Ki Amuk – Balai Pelestarian Cagar Budaya Banten',
        url: 'https://kebudayaan.kemdikbud.go.id/bpcbbanten/meriam-ki-amuk/',
      },
      {
        title: 'Meriam Ki Amuk – Budaya Indonesia',
        url: 'https://budaya-indonesia.org/Meriam-Ki-Amuk-1',
      },
      {
        title: 'Buku Ragam Pusaka Banten – Repositori Kemendikdasmen',
        url: 'https://repositori.kemendikdasmen.go.id/25723/2/Buku%20Ragam%20Pusaka%20Banten.pdf',
      },
    ],
    image: {
      src: '/archives/b.jpeg',
      alt: 'Meriam Ki Amuk di Karangantu Serang, Tahun 1935',
      width: 1280,
      height: 839,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-12',
    title: 'Pemain Kecapi dari Baduy di Serang, Tahun 1910',
    year: '1910',
    location: 'Serang / Lebak',
    category: 'Seni & Seni Tradisional',
    shortDescription:
      'Dokumentasi pemain musik kecapi tradisional masyarakat Baduy di wilayah Serang pada tahun 1910.',
    description:
      'Foto tersebut memperlihatkan seorang pemain kecapi dari masyarakat Baduy yang berada di wilayah Serang pada tahun 1910. Dalam foto hitam putih tersebut, terlihat seorang pria duduk di atas alas sambil memainkan alat musik kecapi, dengan pepohonan dan lingkungan alam di sekitarnya. Kacapi merupakan alat musik petik tradisional masyarakat Sunda, termasuk masyarakat adat Kanekes atau Baduy di Banten.',
    context:
      'Kacapi buhun merupakan sarana musikal dan ekspresi tradisi luhur yang dijaga turun-temurun oleh masyarakat adat Kanekes.',
    sources: [
      {
        title: 'Kacapi Buhun – Museum Multatuli',
        url: 'https://museummultatuli.id/koleksi/mm-etn-2024-217/',
      },
      {
        title: 'Buku Kecapi Sunda – Repositori Kemendikdasmen',
        url: 'https://repositori.kemendikdasmen.go.id/14725/',
      },
    ],
    image: {
      src: '/archives/c.jpeg',
      alt: 'Pemain Kecapi dari Baduy di Serang, Tahun 1910',
      width: 1280,
      height: 951,
    },
    featured: false,
    verified: true,
  },
  {
    id: 'Arsip-13',
    title: 'Masjid Agung Serang (Masjid As Tsauroh), Tahun 1924',
    year: '1924',
    location: 'Kota Serang',
    category: 'Bangunan Bersejarah',
    shortDescription:
      'Dokumentasi lanskap dan arsitektur bersejarah Masjid Agung Ats-Tsauroh Serang pada tahun 1924.',
    description:
      'Foto tersebut memperlihatkan suasana Masjid Agung Serang pada tahun 1924. Terlihat bangunan masjid dengan halaman yang luas, dihiasi gerbang atau gapura berhias ornamen, serta sekelompok masyarakat yang berkumpul di sekitar area masjid. Masjid Agung Serang, yang dahulu dikenal sebagai Masjid Pegantungan, merupakan salah satu masjid bersejarah di Kota Serang, Banten, yang diperkirakan mulai dibangun pada akhir abad ke-19.',
    context:
      'Masjid Agung Serang yang bermakna perjuangan merupakan salah satu pilar peradaban dan syiar Islam di pusat Kota Serang.',
    sources: [
      {
        title: 'Masjid Agung Ats-Tsauroh – Jakarta Islamic Centre',
        url: 'https://dm.islamic-center.or.id/787/masjid-agung-ats-tsauroh/',
      },
      {
        title: 'Mengenal Asal Usul Masjid Agung Ats-Tsauroh – Kabar Banten',
        url: 'https://kabarbanten.pikiran-rakyat.com/seputar-banten/pr-591811983/mengenal-asal-usul-masjid-agung-ats-tsauroh-dibangun-sebelum-masa-kemerdekaan-memiliki-arti-perjuangan',
      },
      {
        title: 'Profil Masjid Agung As-Tsaurah – Kementerian Agama',
        url: 'https://kemenagcilegon.org/file/file/Penamas/poqw1327031713.pdf',
      },
    ],
    image: {
      src: '/archives/d.jpeg',
      alt: 'Masjid Agung Serang (Masjid As Tsauroh), Tahun 1924',
      width: 1280,
      height: 817,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-14',
    title: 'Suasana Acara Maulid Nabi Muhammad SAW di Kediaman Asisten Residen Serang, Tahun 1920',
    year: '1920',
    location: 'Kota Serang',
    category: 'Tradisi & Sosial',
    shortDescription:
      'Dokumentasi perayaan Maulid Nabi Muhammad SAW di kediaman Asisten Residen Serang pada tahun 1920.',
    description:
      'Foto hitam putih tersebut memperlihatkan suasana peringatan Maulid Nabi Muhammad SAW yang diselenggarakan di kediaman Asisten Residen Serang (Pendopo Bupati Serang) pada tahun 1920. Tampak sejumlah orang berkumpul di dalam ruangan yang dihiasi ornamen dan dekorasi. Para peserta terlihat duduk bersama mengikuti rangkaian acara keagamaan yang menjadi bagian dari tradisi Islam di Banten.',
    context:
      'Tradisi peringatan Maulid Nabi mencerminkan perpaduan nilai spiritual keagamaan dan kebersamaan masyarakat Banten lintas generasi.',
    sources: [
      {
        title: 'Koleksi Foto Sejarah Serang – KITLV / Wikimedia Commons',
        url: 'https://commons.wikimedia.org/wiki/Category%3AHistory_of_Serang',
      },
      {
        title: 'Makna Simbol Tradisi Maulid Nabi pada Masyarakat Banten',
        url: 'https://id.scribd.com/document/432303596/4234-makna-Simbol-Tradisi-Maulid-Nabi-PadaMasyarakat-Banten',
      },
    ],
    image: {
      src: '/archives/e.jpeg',
      alt: 'Suasana Acara Maulid Nabi Muhammad SAW di Kediaman Asisten Residen Serang, Tahun 1920',
      width: 1280,
      height: 920,
    },
    featured: false,
    verified: true,
  },
  {
    id: 'Arsip-15',
    title: 'Anak-Anak Bupati Serang, Hilman dan Rifki Djajadiningrat Manakala Pesta Sunatan, Tahun 1900',
    year: '1900',
    location: 'Kota Serang',
    category: 'Sosial & Tokoh',
    shortDescription:
      'Potret busana adat pewayangan putra Bupati Serang, Hilman dan Rifki Djajadiningrat saat khitanan tahun 1900.',
    description:
      'Foto hitam putih ini memperlihatkan Hilman (Imang) dan Rifki (Kikok), Putra Bupati Serang, dalam acara khitanan sekitar tahun 1900. Keduanya merupakan bagian dari keluarga bangsawan Djajadiningrat yang memiliki peranan penting dalam sejarah Banten. Dalam foto tersebut anak-anak mengenakan pakaian tradisional yang menyerupai busana tokoh pewayangan.',
    context:
      'Keluarga bangsawan Djajadiningrat memegang peranan terkemuka dalam sejarah politik, kebudayaan, dan pendidikan modern di Banten.',
    sources: [
      {
        title: 'Acara Khitanan Dua Anak Bupati Serang – Indonesia Zaman Doeloe',
        url: 'https://indonesia-zaman-doeloe.blogspot.com/2017/',
      },
      {
        title: 'Hoesein Djajadiningrat dan Pusat Penelitian Banten',
        url: 'https://ibnuadamaviciena.wordpress.com/2007/06/28/hoesein-djajadiningrat-dan-pusat-penelitian-banten/',
      },
    ],
    image: {
      src: '/archives/f.jpeg',
      alt: 'Anak-Anak Bupati Serang, Hilman dan Rifki Djajadiningrat Manakala Pesta Sunatan, Tahun 1900',
      width: 878,
      height: 1172,
    },
    featured: false,
    verified: true,
  },
  {
    id: 'Arsip-16',
    title: 'Kediaman Patih di Rangkasbitung (Pendopo Kabupaten Lebak), Tahun 1900',
    year: '1900',
    location: 'Rangkasbitung, Lebak',
    category: 'Bangunan Bersejarah',
    shortDescription:
      'Dokumentasi arsitektur tradisional Kediaman Patih di Rangkasbitung (Pendopo Kabupaten Lebak) sekitar tahun 1900.',
    description:
      'Foto hitam putih ini memperlihatkan Kediaman Patih di Rangkasbitung, yang dikenal sebagai pendopo Kabupaten Lebak, sekitar Tahun 1900. Bangunan tersebut memiliki bentuk arsitektur tradisional dengan atap bertingkat dan tiang-tiang penyangga. Area di sekelilingnya tampak ditumbuhi pepohonan, sedangkan bagian depan bangunan berupa halaman terbuka.',
    context:
      'Pendopo Lebak menjadi saksi pusat tata kelola pemerintahan pribumi dan dinamika sosial masyarakat Lebak sejak awal abad ke-20.',
    sources: [
      {
        title: 'Sejarah Rangkasbitung dan Perkembangan Kabupaten Lebak',
        url: 'https://blog.stkippgribl.ac.id/Katapedia/wiki/Rangkasbitung%2C_Lebak',
      },
      {
        title: 'Laporan Pembangunan Pusat Pemerintahan Kabupaten Lebak',
        url: 'https://repo.jayabaya.ac.id/4889/1/Laporan%20PKM%209.pdf',
      },
      {
        title: 'Koleksi Dokumentasi Sejarah Indonesia – KITLV Leiden',
        url: 'https://digitalcollections.universiteitleiden.nl/',
      },
    ],
    image: {
      src: '/archives/g.jpeg',
      alt: 'Kediaman Patih di Rangkasbitung (Pendopo Kabupaten Lebak), Tahun 1900',
      width: 1280,
      height: 855,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-17',
    title: 'Sisa-sisa Rumah Hancur Akibat Peristiwa Geger Cilegon, Tahun 1888',
    year: '1888',
    location: 'Cilegon',
    category: 'Peristiwa Sejarah',
    shortDescription:
      'Dokumentasi sisa-sisa bangunan pasca peristiwa perlawanan rakyat Geger Cilegon tahun 1888.',
    description:
      'Foto hitam putih ini memperlihatkan sisa-sisa rumah yang hancur akibat Peristiwa Geger Cilegon pada tahun 1888. Dalam foto tampak sejumlah orang berada di sekitar bangunan yang mengalami kerusakan. Peristiwa Geger Cilegon terjadi pada 9 Juli 1888, ketika rakyat Banten melakukan perlawanan terhadap pemerintahan kolonial Hindia Belanda yang dipimpin oleh Ki Wasyid.',
    context:
      'Peristiwa Geger Cilegon 1888 dipimpin oleh Ki Wasyid sebagai perlawanan heroik rakyat dan ulama Banten menentang penindasan kolonial.',
    sources: [
      {
        title: 'Setelah Geger Cilegon – Indonesia Zaman Doeloe',
        url: 'https://indonesia-zaman-doeloe.blogspot.com/2018/10/setelah-geger-cilegon-atau.html',
      },
      {
        title: 'Jalannya Pemberontakan Petani Banten 1888 – Historia.id',
        url: 'https://www.historia.id/article/jalannya-pemberontakan-petani-banten-1888-PKNwE',
      },
    ],
    image: {
      src: '/archives/h.jpeg',
      alt: 'Sisa-sisa Rumah Hancur Akibat Peristiwa Geger Cilegon, Tahun 1888',
      width: 1280,
      height: 1027,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-18',
    title: 'Suasana Seba Masyarakat Kanekes (Baduy) Dihadapan Bupati Ahmad Jayadiningrat, Tahun 1900',
    year: '1900',
    location: 'Lebak / Serang',
    category: 'Tradisi & Adat',
    shortDescription:
      'Dokumentasi ritual adat sakral Seba masyarakat Kanekes (Baduy) di hadapan Bupati Ahmad Djajadiningrat tahun 1900.',
    description:
      'Foto hitam putih ini memperlihatkan suasana kehidupan dan ritual Seba masyarakat Kanekes (Baduy) di hadapan Bupati Ahmad Djajadiningrat pada tahun 1900. Foto ini mendokumentasikan pertemuan masyarakat Baduy dengan pejabat pemerintahan pada masa kolonial Belanda.',
    context:
      'Upacara Seba merupakan tradisi tahunan sakral penyerahan hasil bumi dan ungkapan rasa syukur masyarakat Baduy kepada pemerintah.',
    sources: [
      {
        title: 'Dokumentasi Adat Masyarakat Baduy – Repositori Kemendikbud',
        url: 'https://repositori.kemendikdasmen.go.id/28178/',
      },
      {
        title: 'Keluarga Djajadiningrat dan Leluhurnya – Tirto.id',
        url: 'https://tirto.id/keluarga-djajadiningrat-dan-leluhurnya-yang-berasal-dari-baduy-hfYZ',
      },
    ],
    image: {
      src: '/archives/i.jpeg',
      alt: 'Suasana Seba Masyarakat Kanekes (Baduy) Dihadapan Bupati Ahmad Jayadiningrat, Tahun 1900',
      width: 878,
      height: 1149,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-19',
    title: 'Makam Maulana Yusuf di Komplek Kota Inten Banten, Tahun 1915',
    year: '1915',
    location: 'Banten Lama, Serang',
    category: 'Cagar Budaya',
    shortDescription:
      'Dokumentasi gapura dan kompleks makam bersejarah Maulana Yusuf (Sultan Banten II) di Kota Inten tahun 1915.',
    description:
      'Foto hitam putih ini memperlihatkan Makam Maulana Yusuf di Kompleks Kota Inten, Banten, pada tahun 1915. Foto tersebut menampilkan pintu masuk makam yang berbentuk gapura, dinding pembatas, serta beberapa anak tangga menuju area makam. Maulana Yusuf merupakan sultan kedua Kesultanan Banten yang memerintah setelah ayahnya, Maulana Hasanuddin.',
    context:
      'Maulana Yusuf adalah peletak dasar sistem tata kota dan pertanian terpadu serta pengembang kebudayaan Islam di Kesultanan Banten.',
    sources: [
      {
        title: 'Cagar Budaya Makam Maulana Yusuf – Kemendikbud',
        url: 'https://budaya.data.kemdikbud.go.id/cagarbudaya/objek/KB005174',
      },
      {
        title: 'Jurnal Lektur Keagamaan – Kemenag RI',
        url: 'https://jlka.kemenag.go.id/lektur/article/view/486',
      },
    ],
    image: {
      src: '/archives/j.jpeg',
      alt: 'Makam Maulana Yusuf di Komplek Kota Inten Banten, Tahun 1915',
      width: 1280,
      height: 928,
    },
    featured: false,
    verified: true,
  },
  {
    id: 'Arsip-20',
    title: 'Tanjung Layar, Sawarna, Lebak Tahun 1926',
    year: '1926',
    location: 'Sawarna, Lebak',
    category: 'Alam & Pesisir',
    shortDescription:
      'Dokumentasi bentang pesisir dua karang raksasa Tanjung Layar di Sawarna, Lebak pada tahun 1926.',
    description:
      'Foto hitam putih ini memperlihatkan Tanjung Layar di Sawarna, Kabupaten Lebak, Banten, pada tahun 1926. Foto tersebut menampilkan dua formasi batu karang besar yang menjulang di tengah laut, dikelilingi hamparan batu karang dan pantai. Dua batu karang besar yang menjadi ciri khasnya berdiri berdekatan dan membentuk pemandangan yang unik.',
    context:
      'Dua karang layar yang berdiri kokoh di pantai Sawarna menyimpan keindahan geologis alami sekaligus legenda pesisir selatan Banten.',
    sources: [
      {
        title: 'Daftar Arsip Foto KIT Jawa Barat – ANRI',
        url: 'https://www.anri.go.id/download/daftar-arsip-foto-kit-jawa-barat-1930-1633327812',
      },
      {
        title: 'Collectie Tropenmuseum – Sawarna 1929',
        url: 'https://commons.wikimedia.org/wiki/File%3ACOLLECTIE_TROPENMUSEUM_Portret_van_een_Europeaan_met_een_ontkiemde_kokosnoot_op_plantage_Sawarna_TMnr_10027494.jpg',
      },
      {
        title: 'Sejarah Pantai Sawarna – Pantaipedia',
        url: 'https://www.pantaipedia.com/pantai-sawarna/',
      },
    ],
    image: {
      src: '/archives/k.jpeg',
      alt: 'Tanjung Layar, Sawarna, Lebak Tahun 1926',
      width: 1280,
      height: 1000,
    },
    featured: true,
    verified: true,
  },
  {
    id: 'Arsip-21',
    title: 'Suasana di Masjid Ketika Kunjungan Bung Karno Ke Lebak, Desember 1945',
    year: '1945',
    location: 'Lebak',
    category: 'Peristiwa Sejarah',
    shortDescription:
      'Dokumentasi kerumunan masyarakat menyambut kunjungan Presiden Soekarno di halaman Masjid Lebak pada Desember 1945.',
    description:
      'Foto hitam putih ini memperlihatkan suasana ramai di Masjid Lebak ketika Presiden Soekarno berkunjung ke wilayah Lebak, Banten, pada Desember 1945. Terlihat banyak masyarakat berkumpul di sekitar masjid untuk menyambut kedatangan Bung Karno. Sebuah mobil tampak berada di tengah kerumunan, sementara bangunan masjid memiliki hiasan kaligrafi Arab pada bagian atasnya.',
    context:
      'Kunjungan Bung Karno ke Lebak pada akhir 1945 menjadi momentum bersejarah dalam mengobarkan semangat perjuangan mempertahankan kemerdekaan RI.',
    sources: [
      {
        title: 'Situs Resmi Arsip Nasional Republik Indonesia (ANRI)',
        url: 'https://www.anri.go.id/',
      },
      {
        title: 'Perjalanan Presiden Sukarno ke Banten – Museum Multatuli',
        url: 'https://museummultatuli.id/koleksi/mm-fto-2023-139/',
      },
    ],
    image: {
      src: '/archives/l.jpeg',
      alt: 'Suasana di Masjid Ketika Kunjungan Bung Karno Ke Lebak, Desember 1945',
      width: 1280,
      height: 1083,
    },
    featured: true,
    verified: true,
  },
];
