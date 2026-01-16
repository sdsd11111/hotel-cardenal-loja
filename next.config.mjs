/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
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
