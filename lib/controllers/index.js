const AuthenticationApi = require("../models/authentication_api")

function index(request, reply) {
    let data = {
        session: {
            userId: 9000,
            userName: "robert-todo"
        }
    }

    data.session = null

    return reply.view("index", data)
}

async function login(request, reply) {
    let username
    let password
    let errorMessage
    
    if(request.payload) {
        username = request.payload.username
        password = request.payload.password

        try {
            await AuthenticationApi.login(username, password)
        }
        catch(error) {
            errorMessage = error.message
        }
    }

    const data = {
        errorMessage,
        username
    }

    return reply.view("login", data)
}

function logout(request, reply) {
    const data = {

    }

    return reply.view("logout", data)
}

module.exports = {
    index,
    login,
    logout
}