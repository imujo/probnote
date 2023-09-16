/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "probnote.6df701e1ee630e37e32b63c2c0c136d0.r2.cloudflarestorage.com",
    ],
  },
};

module.exports = nextConfig;
