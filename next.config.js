const withPWA = require('next-pwa');
module.exports = withPWA({
  swcMinify: false,
  pwa: {
    dest: 'public',
    swSrc: 'custom-sw.js',
  },
  reactStrictMode: true,
});
