/** @type {import('next').NextConfig} */
// PAGES_BASE_PATH is set only for the GitHub Pages preview (served from
// /SOS24/). A normal build, and the production domain, use the root.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
