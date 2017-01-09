require('buba/register')

const northbrook = require('northbrook/plugins').plugin
const buba = require('./src').plugin

module.exports = {
  plugins: [
    northbrook,
    buba
  ]
}
