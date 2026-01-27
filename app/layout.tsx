import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import cn from 'clsx'
import { withBasePath } from '@/lib/base-path'
import './globals.css'
import { SpacingControls } from '@/components/spacing-controls'
import { ScrollGradientOverlay } from '@/components/scroll-gradient-overlay'

export const dynamic = 'error'

const sans = localFont({
  src: './_fonts/InterVariable.woff2',
  preload: true,
  variable: '--sans',
})

const serif = localFont({
  src: './_fonts/LoraItalicVariable.woff2',
  preload: true,
  variable: '--serif',
})

const mono = localFont({
  src: './_fonts/IosevkaFixedCurly-ExtendedMedium.woff2',
  preload: true,
  variable: '--mono',
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
    apple: withBasePath('/apple-icon.png'),
  },
}

export const viewport: Viewport = {
  maximumScale: 1,
  colorScheme: 'only light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden touch-manipulation">
      <body className={cn(
        sans.variable,
        serif.variable,
        mono.variable,
        'w-full px-[var(--space-page-x)] py-[var(--space-page-y)]',
        'text-foreground',
        'antialiased'
      )}>
        <ScrollGradientOverlay />
        {children}
        <SpacingControls />
        <Analytics />
      </body>
    </html>
  )
}
