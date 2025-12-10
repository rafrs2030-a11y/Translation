/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // RTL support
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },

  // Environment variables
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },

  // Images configuration
  images: {
    domains: ['*.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Webpack configuration for Supabase
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },

  // Output configuration for Netlify
  output: 'standalone',
  
  // Server Actions are enabled by default in Next.js 14+
  
  // Ensure we only use React/Next.js pages, not HTML files
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

