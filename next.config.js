/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/DriveMetrics',  // Add base path for GitHub Pages
  images: {
    unoptimized: true,  // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig