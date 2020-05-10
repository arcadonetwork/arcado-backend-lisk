require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

module.exports = {
  env: env,
  port: process.env.PORT || '3000',
  genesis: process.env.GENESIS || 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  liskAPI: 'http://localhost:4000'
}