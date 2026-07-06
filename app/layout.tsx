import type { Metadata, Viewport } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import Providers from './components/Providers'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

const SITE_NAME = 'PIXEL Social Media Mongolia'
const SITE_URL = 'https://pixelmedia.mn'
const SITE_TITLE = 'PIXEL — Дижитал маркетинг & сошиал медиа агентлаг | Улаанбаатар'
const SITE_DESCRIPTION =
  'PIXEL Social Media Mongolia — Улаанбаатарт байрлах дижитал маркетинг, сошиал медиа хөтлөлт болон контент маркетингийн агентлаг. Зөв мессеж · Зөв зах зээл: брэндийн үнэ цэнийг бүтээж, дижитал орчинд бодит үр дүн гаргана.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Home page uses `default`; every other route shows "<page> | PIXEL" via `template`.
    default: SITE_TITLE,
    template: '%s | PIXEL',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'дижитал маркетинг',
    'дижитал маркетинг Улаанбаатар',
    'сошиал медиа агентлаг',
    'сошиал медиа маркетинг',
    'контент маркетинг Монгол',
    'SMM Монгол',
    'фэйсбүүк маркетинг',
    'инстаграм маркетинг',
    'брэндинг Улаанбаатар',
    'маркетингийн агентлаг Монгол',
    'PIXEL',
    'PIXEL Social Media Mongolia',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'mn_MN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // TODO: swap for a dedicated 1200×630 social share image at public/og-image.jpg.
    // Falls back to the logo for now so link previews aren't blank.
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

// viewport-fit=cover lets the fixed bottom nav extend under the iPhone home
// indicator; env(safe-area-inset-bottom) paddings keep its content clear of it.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="bg-void text-pxwhite"><Providers>{children}</Providers></body>
    </html>
  )
}
