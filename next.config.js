const withPWA = require('next-pwa');
module.exports = withPWA({
  pwa: {
    dest: 'public',
    swSrc: 'custom-sw.js',
  },
  reactStrictMode: true,
});
