const app = require("../app")
const  Login = require("../controller/ControllerLogin")
const  Login2 = require("../controllerBD/ControllerLoginDB")

app.use("/Login", Login)
app.use('/Loginbd', Login2)