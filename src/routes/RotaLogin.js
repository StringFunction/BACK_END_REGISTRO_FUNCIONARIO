const app = require("../app")
const  Login = require("../controller/ControllerLogin")
const  Login2 = require("../controllerBD/ControllerLoginDB")

app.use("/v1/Login", Login)
app.use('/v2/Login', Login2)