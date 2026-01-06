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
      // WWW to non-WWW redirect for SEO - more specific to avoid loops
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.landingbits.net',
          },
        ],
        destination: 'https://landingbits.net/',
        permanent: true,
      },
      {
        source: '/:path+', // Only for paths with content, not root
        has: [
          {
            type: 'host', 
            value: 'www.landingbits.net',
          },
        ],
        destination: 'https://landingbits.net/:path+',
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
