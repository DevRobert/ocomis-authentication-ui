const Hapi = require("hapi")
const Inert = require("inert")
const Handlebars = require("handlebars")
const Vision = require("vision")
const routes = require("./lib/routes")
const Config = require("config")
const HapiAuthJwt2 = require('hapi-auth-jwt2')
const validateToken = require('./lib/models/validate_token')

const server = new Hapi.Server()

server.connection({
    port: 3003
})

server.register([ Inert, Vision, HapiAuthJwt2 ], (error) => {
    if(error) {
        throw error
    }

    server.auth.strategy('jwt', 'jwt', {
        key: Config.get('jwt.secret'),
        validateFunc: validateToken,
        verifyOptions: {
            algorithms: [ 'HS256' ]
        },
        cookieKey: Config.get('jwt.cookieKey')
    })

    server.route(routes)

    server.views({
        engines: {
            html: Handlebars
        },
        path: "views",
        layoutPath: "views/layout",
        layout: "default"
    })

    server.start((error) => {
        if(error) {
            throw error
        }

        console.log("Ocomis authentication ui service started.")
        console.log("Service running at: " + server.info.uri)
    })
})

module.exports = server // only for testing
