import type { NextConfig } from 'next'

const repo = 'midlneedle_archive'
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? `/${repo}` : ''

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Оптимизация изображений
  images: {
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
}

export default config
