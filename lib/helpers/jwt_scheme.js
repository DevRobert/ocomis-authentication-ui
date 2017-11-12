const Boom = require("boom")
const assert = require("assert")
const JWT = require("jsonwebtoken")

const scheme = function (server, options) {
    assert(options.cookieKey, "The 'cookieKey' option has not been specified.")
    assert(options.secret, "The 'secret' option has not been specified.")

    return {
        authenticate: (request, h) => {
            const tokenString = request.state[options.cookieKey]

            if(!tokenString) {
                throw Boom.unauthorized(null, "jwt")
            }

            let decodedToken

            try {
                decodedToken = JWT.verify(tokenString, options.secret, {
                    algorithms: "HS256"
                })
            }
            catch(error) {
                console.log(error)
                return Boom.unauthorized(null, "jwt")
            }

            return h.authenticated({
                credentials: {
                    user: {
                        id: decodedToken.userId,
                        name: decodedToken.userName
                    }
                }
            })
        }
    }
};

module.exports = scheme