import type { NextConfig } from 'next'

const config: NextConfig = {
  // Оптимизация для Vercel - используем все возможности Next.js
  trailingSlash: true,

  // Официальная интеграция React ViewTransition
  experimental: {
    viewTransition: true,
  },
}

export default config
