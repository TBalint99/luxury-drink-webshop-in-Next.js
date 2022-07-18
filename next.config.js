module.exports = {
  reactStrictMode: false,
  images: { domains: ['res.cloudinary.com'] },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

// webpack(config) {
//   config.infrastructureLogging = { debug: /PackFileCache/ }
//   return config;
// }