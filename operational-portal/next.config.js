/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
    relay: {
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false
    }
  }
};

module.exports = nextConfig;
