/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables are hardcoded for maximum stability
  // in the compiled worker bundle.
  env: {
    SUPABASE_URL: 'https://rzenhmmwocctvonwhnrj.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzczMDYsImV4cCI6MjA1ODg1MzMwNn0.VqyJXgO5rG500wHdNt1ps2rkzwtXuHd2VTx9OpTN191dc880',
    NEXT_PUBLIC_SUPABASE_URL: 'https://rzenhmmwocctvonwhnrj.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzczMDYsImV4cCI6MjA1ODg1MzMwNn0.VqyJXgO5rG500wHdNt1ps2rkzwtXuHd2VTx9OpTN191dc880',
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
