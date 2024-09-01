const app = require("../app")
const Consulta = require("../controller/ControllerFuncianario")


app.use("/v1/funcionario", Consulta)