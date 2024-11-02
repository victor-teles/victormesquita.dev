import styles from './layout.module.css'
import '@styles/global.css'
import { GeistMono } from 'geist/font/mono';
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { Viewport } from 'next'

export const dynamic = 'force-static'

const font = Montserrat({
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${font.className} ${GeistMono.variable} dark`}>
      <body>
        <ThemeProvider>
          <div className={styles.wrapper}>
            <main className={styles.main}>{children}</main>
          </div>
          <Analytics />
        </ThemeProvider>
        {/* {process.env.NODE_ENV === 'development' ? <VercelToolbar /> : null} */}
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL('https://victormesquita.dev'),
  title: {
    template: '%s | Victor Mesquita',
    default: 'Victor Mesquita',
  },
  description: 'A website by Victor Mesquita.',
  openGraph: {
    title: 'Victor Mesquita',
    url: 'https://victormesquita.dev',
    siteName: "Victor Mesquita's website",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://victormesquita.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Victor Mesquita's site",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: 'Victor Mesquita',
    card: 'summary_large_image',
    creator: '@XVictorMesquita',
  },
  icons: {
    shortcut: 'https://victormesquita.dev/favicons/favicon.ico',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://victormesquita.dev/feed.xml',
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}
