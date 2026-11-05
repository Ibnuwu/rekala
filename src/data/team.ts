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
    role: 'Riset Observasi',
    roleCategory: 'Observasi / Sources',
    photo: {
      src: '/team/iqbal.jpg',
      alt: 'Foto Muhammad Iqbal — Riset Observasi',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'fadilla',
    name: 'Siti Nurfadillah',
    role: 'Riset Observasi',
    roleCategory: 'Observasi / Sources',
    photo: {
      src: '/team/fadilla.jpg',
      alt: 'Foto Siti Nurfadillah — Riset Observasi',
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

export interface Mentor {
  name: string;
  role: string;
  institution: string;
  image: string;
}

export const mentors: Mentor[] = [
  {
    name: 'Sigit Wardoyo, S.Si.',
    role: 'Pendamping OJT',
    institution: 'Perpusda Banten',
    image: '/images/mentors/sigit-wardoyo.jpg', // Placeholder path
  },
  {
    name: 'Asep Nureka, S.KM., M.M.',
    role: 'Pendamping OJT',
    institution: 'DPK Banten',
    image: '/images/mentors/asep-nureka.jpg', // Placeholder path
  },
  {
    name: 'Aziz Fauzi, M.Pd.',
    role: 'Instruktur',
    institution: 'BBPVP Serang',
    image: '/images/mentors/aziz-fauzi.jpg', // Placeholder path
  },
];

// Alias for uppercase convention compatibility
export const MENTORS = mentors;

