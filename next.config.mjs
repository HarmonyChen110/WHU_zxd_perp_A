/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Set base path for GitHub Pages deployment
  // Uses NEXT_PUBLIC_BASE_PATH env var if set, defaults to ''
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Ensure trailing slash for proper GitHub Pages routing
  trailingSlash: true,

  // Disable image optimization for static export
  // GitHub Pages doesn't support Next.js image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
