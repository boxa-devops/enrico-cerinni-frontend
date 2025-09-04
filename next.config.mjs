/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',
  
  // Environment variables that should be available at runtime
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  
  // Image optimization settings
  images: {
    unoptimized: true, // Disable image optimization for simpler deployments
  },
  
  // Experimental features
  experimental: {
    // Enable server actions if needed
    serverActions: true,
  },
};

export default nextConfig;
