/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      // WWW to non-WWW redirect for SEO
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.landingbits.net',
          },
        ],
        destination: 'https://landingbits.net/:path*',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

module.exports = nextConfig;
