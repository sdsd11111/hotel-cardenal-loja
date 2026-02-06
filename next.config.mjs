/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/images/**',
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/*',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'tqldpcqcovilgpmzeyre.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'gpixqnfkbqsiysyhjzog.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '216.246.46.43',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
    formats: ['image/webp'],
    qualities: [50, 60, 70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/hospedaje',
        destination: '/servicios',
        permanent: true,
      },
      {
        source: '/restaurante-y-eventos',
        destination: '/restaurante',
        permanent: true,
      },
      {
        source: '/matrimonial',
        destination: '/habitaciones/matrimonial',
        permanent: true,
      },
      {
        source: '/familiar-loft',
        destination: '/habitaciones/familiar-loft',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
