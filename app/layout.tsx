import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifeGuard KZ — Өмірді сақтандыру тәуекелдерін AI бағалау платформасы',
  description:
    'Қазақстандағы өмірді сақтандыру тәуекелдерін бағалауға арналған зияткерлік платформа. ' +
    'AI негізінде сыйлықақыларды есептеу, тәуекел факторларын талдау және жеке ұсыныстар.',
  keywords: [
    'өмірді сақтандыру',
    'Қазақстан',
    'тәуекелдерді бағалау',
    'сақтандыру калькуляторы',
    'AI',
    'жасанды интеллект',
    'LifeGuard',
  ],
  authors: [{ name: 'LifeGuard KZ' }],
  openGraph: {
    title: 'LifeGuard KZ — Өмірді сақтандыру тәуекелдерін AI бағалау платформасы',
    description:
      'Қазақстандағы өмірді сақтандыру тәуекелдерін бағалауға арналған зияткерлік платформа. ' +
      'AI негізінде сыйлықақыларды есептеу, тәуекел факторларын талдау және жеке ұсыныстар.',
    type: 'website',
    locale: 'kk_KZ',
    siteName: 'LifeGuard KZ',
    url: 'https://lifeguard.kz',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LifeGuard KZ — Өмірді сақтандыру тәуекелдерін AI бағалау платформасы',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LifeGuard KZ — Өмірді сақтандыру тәуекелдерін AI бағалау платформасы',
    description:
      'Қазақстандағы өмірді сақтандыру тәуекелдерін бағалауға арналған зияткерлік платформа.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const NAV_LINKS = [
  { href: '/', label: 'Басты бет' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/dashboard', label: 'Талдау' },
  { href: '/about', label: 'Жоба туралы' },
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body className="min-h-screen bg-[#0F172A] font-sans text-gray-100 flex flex-col">
        {/* ── Navigation ───────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 transition-all group-hover:bg-emerald-500/20">
                <svg
                  className="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">LifeGuard</span>{' '}
                <span className="text-emerald-400">KZ</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300
                               transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile menu button */}
            <button
              className="inline-flex md:hidden items-center justify-center rounded-lg p-2
                         text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              aria-label="Мәзір"
              type="button"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </button>
          </nav>
        </header>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <main className="flex-1 relative z-10">{children}</main>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/5 bg-[#0F172A]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </span>
                  <span className="font-bold text-white">
                    LifeGuard <span className="text-emerald-400">KZ</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Қазақстандағы өмірді сақтандыру тәуекелдерін AI бағалау платформасы.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Бөлімдер</h4>
                <ul className="space-y-2">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Жауапкершіліктен бас тарту</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Есептеу нәтижелері тек ақпараттық сипатта және сақтандыру шартын жасасуға оферта немесе ұсыныс болып табылмайды. Нақты шарттарды алу үшін Қазақстан Республикасының лицензияланған сақтандыру компаниясына хабарласыңыз. Платформа AI модельдерін пайдаланады, олар дәлсіздіктерді қамтуы мүмкін.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <p className="text-xs text-gray-600">
                &copy; {new Date().getFullYear()} LifeGuard KZ. Барлық құқықтар қорғалған.
                Қаржылық кеңес болып табылмайды.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
