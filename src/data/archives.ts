import { type CategoryLabel, CATEGORY_LABELS } from './categories';

export type ArchiveCategory = CategoryLabel;

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
];
