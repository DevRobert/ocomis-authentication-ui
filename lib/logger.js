const pino = require('pino')

const logger = pino().child({
    service: 'ocomis-authentication-ui'
})

module.exports = logger
