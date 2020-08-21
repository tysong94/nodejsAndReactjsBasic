const { createProxyMiddleware } = require('http-proxy-middleware');

// target을 5000번으로 맞춰줌.
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};