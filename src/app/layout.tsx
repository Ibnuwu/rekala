import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rekala.banten.go.id';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'REKALA — Reka Waktu, Hidupkan Sejarah',
  description: 'REKALA — Reka Waktu, Hidupkan Sejarah. Eksplorasi visual dan kisah sejarah Banten melalui koleksi arsip otentik.',
  openGraph: {
    title: 'REKALA — Reka Waktu, Hidupkan Sejarah',
    description: 'REKALA — Reka Waktu, Hidupkan Sejarah. Eksplorasi visual dan kisah sejarah Banten melalui koleksi arsip otentik.',
    images: [
      {
        url: '/archives/Arsip-01.jpg',
        width: 1200,
        height: 630,
        alt: 'REKALA - Layanan Arsip Digital Banten',
      },
    ],
  },
  icons: {
    icon: '/logo/logo-warna.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/logo-warna.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/logo-warna.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Anti-FOUC theme initialization script - detects device system preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('rekala-theme');
                  var theme = stored;
                  if (!theme || theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-w-0 bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--accent-gold)]/30 selection:text-white antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <a href="#main-content" className="skip-link">
            Langsung ke konten
          </a>
          <Header />
          <main id="main-content" className="pt-16 sm:pt-20 max-w-full overflow-x-clip">
            {children}
          </main>
          <Analytics />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
