/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables are managed via Cloudflare Dashboard
  // during runtime (worker bindings).


  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Output configuration for Cloudflare Workers (with OpenNext adapter)
  // Must be 'standalone' for OpenNext to work
  output: 'standalone',
  
  // Server Actions are enabled by default in Next.js 16+
  
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
