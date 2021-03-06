const Hapi = require('hapi')
const logger = require('./lib/logger')
const HapiPino = require('hapi-pino')
const Inert = require('inert')
const Handlebars = require('handlebars')
const Vision = require('vision')
const routes = require('./lib/routes')
const Config = require('config')
const HapiAuthJwt2 = require('hapi-auth-jwt2')
const validateToken = require('./lib/models/validate_token')

const server = new Hapi.Server()

function provision () {
    return new Promise((resolve, reject) => {
        server.connection({
            port: 3003
        })

        server.register([
            { register: HapiPino, options: { instance: logger } },
            Inert,
            Vision,
            HapiAuthJwt2
        ], (error) => {
            if (error) {
                return reject(error)
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
                path: 'views',
                layoutPath: 'views/layout',
                layout: 'default'
            })

            server.start((error) => {
                if (error) {
                    return reject(error)
                }

                resolve()
            })
        })
    })
}

provision().then(() => {
    server.logger().info('Ocomis Authentication UI Service started.')
    server.logger().info(`Service running at: ${server.info.uri}`)
}).catch((error) => {
    if (typeof server.logger === 'function') {
        server.logger().error(`Ocomis Authentication UI Service start failed: ${error}`)
    } else {
        console.log(error)
    }

    process.exit(1)
})

module.exports = server // only for testing
