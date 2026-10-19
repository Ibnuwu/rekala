export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleCategory: 'Ketua' | 'Developer' | 'Penulis Script' | 'Observasi / Sources' | 'Dokumentasi' | 'Pembimbing';
  url?: string;
  badge?: string;
  photo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'aliudin',
    name: 'Aliudin',
    role: 'Ketua',
    roleCategory: 'Ketua',
    photo: {
      src: '/team/aliudin.jpg',
      alt: 'Foto Aliudin — Ketua',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'ibnu',
    name: 'Ibnu Hamdun',
    role: 'Developer',
    roleCategory: 'Developer',
    url: 'https://airsenuwu.is-a.dev/',
    photo: {
      src: '/team/ibnu.jpg',
      alt: 'Foto Ibnu Hamdun — Developer',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'gina',
    name: 'Gina Siti Nurillah',
    role: 'Penulis Script',
    roleCategory: 'Penulis Script',
    photo: {
      src: '/team/gina.jpg',
      alt: 'Foto Gina Siti Nurillah — Penulis Script',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'iqbal',
    name: 'Muhammad Iqbal',
    role: 'Observasi / Pencari Sumber',
    roleCategory: 'Observasi / Sources',
    photo: {
      src: '/team/iqbal.jpg',
      alt: 'Foto Muhammad Iqbal — Observasi / Pencari Sumber',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'fadilla',
    name: 'Siti Nurfadillah',
    role: 'Observasi / Pencari Sumber',
    roleCategory: 'Observasi / Sources',
    photo: {
      src: '/team/fadilla.jpg',
      alt: 'Foto Siti Nurfadillah — Observasi / Pencari Sumber',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'roby',
    name: 'Roby Zidny Ilman',
    role: 'Dokumentasi',
    roleCategory: 'Dokumentasi',
    photo: {
      src: '/team/roby.jpg',
      alt: 'Foto Roby Zidny Ilman — Dokumentasi',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'rafi',
    name: 'Muhammad Rafi Effendi',
    role: 'Dokumentasi',
    roleCategory: 'Dokumentasi',
    photo: {
      src: '/team/rafi.jpg',
      alt: 'Foto Muhammad Rafi Effendi — Dokumentasi',
      width: 800,
      height: 1000,
    },
  },
];

export const MENTORS: TeamMember[] = [
  {
    id: 'asep',
    name: 'Asep, S.SUI.',
    role: 'Pendamping OJT — DPK Banten',
    roleCategory: 'Pembimbing',
    badge: 'Pembimbing Instansi',
    photo: {
      src: '/team/placeholder-mentor.jpg',
      alt: 'Foto Asep, S.STP. — Pendamping OJT',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'sigit',
    name: 'Sigit, S.Sos.',

    role: 'Pendamping OJT — Perpusda Banten',
    roleCategory: 'Pembimbing',
    badge: 'Pembimbing Instansi',
    photo: {
      src: '/team/placeholder-mentor.jpg',
      alt: 'Foto Sigit, S.Sos. — Pendamping OJT',
      width: 800,
      height: 1000,
    },
  },
];

