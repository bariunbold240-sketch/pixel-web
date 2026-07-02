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

export const metadata: Metadata = {
  title: 'PIXEL — Танилцуулга',
  description: 'PIXEL Social Media Mongolia — Зөв мессеж · Зөв зах зээл',
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
