const app = require("../app")
const Consulta = require("../controller/ControllerPassagem")
const pqp = require("../controller/pqp")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/lista_negraToken.json"
const fs = require("fs")
const vericarToken = require("../middleware/verificarToken")




app.use("/v1/passagem", vericarToken, Consulta)
app.use("/v1/pqp", vericarToken, pqp)