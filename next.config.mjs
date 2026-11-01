/** @type {import('next').NextConfig} */
const isExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? { output: 'export', assetPrefix: '.', images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
