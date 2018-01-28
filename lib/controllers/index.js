const AuthenticationApi = require('../models/authentication_api')
const Config = require('config')

function index (request, reply) {
    let user

    if (request.auth.isAuthenticated) {
        user = {
            id: request.auth.credentials.userId,
            name: request.auth.credentials.userName
        }
    }

    let loginUri = '/authentication/login'

    if (request.query.referrer) {
        // todo validation in order to prevent XSS attacks
        loginUri += '?referrer=' + encodeURIComponent(request.query.referrer)
    }

    let data = {
        user,
        referrer: request.query.referrer,
        loginUri
    }

    return reply.view('index', data)
}

async function login (request, reply) {
    let username
    let password
    let errorMessage

    if (request.payload) {
        username = request.payload.username
        password = request.payload.password

        let loginResponse

        try {
            loginResponse = await AuthenticationApi.login(username, password)
        } catch (error) {
            errorMessage = error.message
        }

        if (!errorMessage) {
            const token = loginResponse.token
            const cookieKey = Config.get('jwt.cookieKey')

            reply.state(cookieKey, token, {
                path: '/',
                isSecure: Config.get('jwt.cookieSecure')
            })

            if (request.query.referrer) {
                // todo validation in order to prevent XSS attacks
                return reply.redirect(request.query.referrer)
            }

            return reply.redirect('/authentication/')
        }
    }

    let actionUri = '/authentication/login'

    if (request.query.referrer) {
        // todo validation in order to prevent XSS attacks
        actionUri += '?referrer=' + encodeURIComponent(request.query.referrer)
    }

    const data = {
        errorMessage,
        username,
        actionUri
    }

    return reply.view('login', data)
}

function logout (request, reply) {
    const cookieKey = Config.get('jwt.cookieKey')

    reply.unstate(cookieKey, {
        path: '/',
        isSecure: Config.get('jwt.cookieSecure')
    })

    return reply.redirect('/authentication/')
}

module.exports = {
    index,
    login,
    logout
}
