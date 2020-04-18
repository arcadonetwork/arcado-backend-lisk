require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

module.exports = {
  env: env,
  port: process.env.PORT || '4000'
}