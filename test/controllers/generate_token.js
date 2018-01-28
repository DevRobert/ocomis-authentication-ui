const JsonWebToken = require('jsonwebtoken')
const Config = require('config')

module.exports = (tokenData, signOptions) => {
    const tokenSecret = Config.get('jwt.secret')
    return JsonWebToken.sign(tokenData, tokenSecret, signOptions)
}
