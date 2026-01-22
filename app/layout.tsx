import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import cn from 'clsx'
import './globals.css'
import { SpacingControls } from '@/components/spacing-controls'

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
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
        'text-sm leading-6 sm:text-[15px] sm:leading-7 md:text-base md:leading-7',
        'text-foreground',
        'antialiased'
      )}>
        {children}
        <SpacingControls />
        <Analytics />
      </body>
    </html>
  )
}
