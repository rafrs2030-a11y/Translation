/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Output configuration for Netlify
  output: 'standalone',
  
  // Server Actions are enabled by default in Next.js 14+
  
  // Ensure we only use React/Next.js pages, not HTML files
  async rewrites() {
    return [];
  },
  
  // Prevent serving HTML files from public directory as pages
  async headers() {
    return [
      {
        source: '/:path*.html',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
