import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import cn from 'clsx'
import { withBasePath } from '@/lib/base-path'
import './globals.css'
import { ScrollGradientOverlay } from '@/components/scroll-gradient-overlay'

export const dynamic = 'error'

const sans = localFont({
  src: './_fonts/InterVariable.woff2',
  preload: true,
  variable: '--sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s — Vladislav Ivanov',
    default: 'Vladislav Ivanov — Product Designer',
  },
  description: 'Product designer curious about technology and digital products. Prototyping in code and solving complex problems.',
  openGraph: {
    type: 'website',
    title: 'Vladislav Ivanov — Product Designer',
    description: 'Product designer curious about technology and digital products. Prototyping in code and solving complex problems.',
  },
  icons: {
    icon: [
      {
        url: withBasePath('/icon-32x32.png'),
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: withBasePath('/icon-16x16.png'),
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: withBasePath('/icon-light-32x32.png'),
        media: '(prefers-color-scheme: light)',
      },
      {
        url: withBasePath('/icon-dark-32x32.png'),
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: withBasePath('/icon.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: withBasePath('/apple-icon.png'),
        sizes: '144x144',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'only light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(
        sans.variable,
        'w-full px-[var(--space-page-x)] py-[var(--space-page-y)]',
        'text-foreground',
        'antialiased'
      )}>
        <ScrollGradientOverlay />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
