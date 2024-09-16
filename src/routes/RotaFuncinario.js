const app = require("../app")
const Consulta = require("../controller/ControllerFuncianario")
// const Funcionariodb = require("../controllerBD/ControllerBDFuncionario")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/lista_negraToken.json"
const fs = require("fs")
const vericarToken = require("../middleware/verificarToken")





app.use("/v1/funcionario", vericarToken, Consulta)
// app.use("/v2/funcionario", vericarToken, Funcionariodb)