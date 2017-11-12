const controller = require("../controllers/")

const Routes = [
    {
        method: "GET",
        path: "/authentication/",
        handler: controller.index
    },
    {
        method: ["GET", "POST"],
        path: "/authentication/login",
        handler: controller.login
    },
    {
        method: "GET",
        path: "/authentication/logout",
        handler: controller.logout
    },
    {
        method: "GET",
        path: "/authentication/bootstrap.css",
        handler: (request, reply) => {
            return reply.file("./node_modules/bootstrap/dist/css/bootstrap.min.css")
        }
    }    
]

module.exports = Routes