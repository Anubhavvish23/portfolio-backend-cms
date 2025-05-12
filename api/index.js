const app = require('./index.ts');

module.exports = (req, res) => {
  return app(req, res);
}; 