const app = require("../app")
const Consulta = require("../controller/ControllerFuncianario")
const Funcionariodb = require("../controllerBD/ControllerBDFuncionario")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/lista_negraToken.json"
const fs = require("fs")
const vericarToken = require("../middleware/verificarToken")

function nivelAcesso(req, res,next){
    if([2,3].includes(req.nivel))  return next()
    console.log("Usuario sem permissão");
    console.log("Nivel de Usuario  " + req.nivel);
    
    return res.status(401).send({mensagem : "vc nao  permissao para acessa essa rota"})
  }



app.use("/v1/funcionario", vericarToken, Consulta)
app.use("/v2/funcionario", vericarToken, nivelAcesso, Funcionariodb)