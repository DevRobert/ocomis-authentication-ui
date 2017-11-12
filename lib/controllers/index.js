const AuthenticationApi = require("../models/authentication_api")
const Config = require("config")

function index(request, h) {
    let user

    if(request.auth.isAuthenticated) {
        user = {
            id: request.auth.credentials.user.id,
            name: request.auth.credentials.user.name
        }
    }

    let data = {
        user
    }

    return h.view("index", data)
}

async function login(request, h) {
    let username
    let password
    let errorMessage

    if(request.payload) {
        username = request.payload.username
        password = request.payload.password

        let loginResponse

        try {
            loginResponse = await AuthenticationApi.login(username, password)
        }
        catch(error) {
            errorMessage = error.message
        }

        if(loginResponse) {
            const token = loginResponse.token
            const cookieKey = Config.get("jwt.cookieKey")
    
            const response = h.response()

            response.state(cookieKey, token, {
                path: "/",
                isSecure: Config.get("jwt.cookieSecure")
            })
            
            response.redirect("/authentication/")
            
            return response
        }
    }

    const data = {
        errorMessage,
        username
    }

    return h.view("login", data)
}

function logout(request, h) {
    const cookieKey = Config.get("jwt.cookieKey")

    const response = h.response()

    response.unstate(cookieKey, {
        path: "/",
        isSecure: Config.get("jwt.cookieSecure")
    })
    
    response.redirect("/authentication/")

    return response
}

module.exports = {
    index,
    login,
    logout
}