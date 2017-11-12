const Hapi = require("hapi")
const Inert = require("inert")
const Handlebars = require("handlebars")
const Vision = require("vision")
const routes = require("./lib/routes")

const server = new Hapi.Server({
    port: 3000
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