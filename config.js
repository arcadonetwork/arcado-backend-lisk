require('dotenv').config()

const env = process.env.NODE_ENV || 'development'

module.exports = {
  env: env,
  port: process.env.PORT || '3000',
  genesis_address: '11237980039345381032L',
  genesis: process.env.GENESIS || 'creek own stem final gate scrub live shallow stage host concert they',
  liskAPI: 'http://localhost:4000',
  NETWORK_IDENTIFIER: "11a254dc30db5eb1ce4001acde35fd5a14d62584f886d30df161e4e883220eb7"
}
