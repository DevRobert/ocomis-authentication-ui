const Hapi = require("hapi")
const Inert = require("inert")
const Handlebars = require("handlebars")
const Vision = require("vision")
const routes = require("./lib/routes")
const JwtScheme = require("./lib/helpers/jwt_scheme")
const Config = require("config")

const server = new Hapi.Server({
    port: 3003
})

server.auth.scheme('jwt', JwtScheme);

server.auth.strategy("jwt", "jwt", {
    cookieKey: Config.get("jwt.cookieKey"),
    cookieSecure: Config.get("jwt.cookieSecure"),
    secret: Config.get("jwt.secret")
})

const provision = async () => {
    await server.register(Inert)
    await server.register(Vision)

    server.route(routes)

    server.views({
        engines: {
            html: Handlebars
        },
        path: "views",
        layoutPath: "views/layout",
        layout: "default"
    })

    await server.start()
}

provision().then(() => {
    console.log("Ocomis authentication ui service started.")
    console.log("Service running at: " + server.info.uri)
}).catch((error) => {
    throw error
})