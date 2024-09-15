const app = require("../app")
const Consulta = require("../controller/ControllerUsuarioSistema")
const usuario = require("../controllerBD/controlleBDusuario")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/lista_negraToken.json"
const vericarToken = require("../middleware/verificarToken")
function nivelAcesso(req, res,next){
  if(req.nivel == "3")  return next()
  return res.status(401).send({mensagem : "vc nao  permissao para acessa essa rota"})
}

app.use("/v1/usuario", vericarToken, Consulta)
app.use("/v1/usuariodb", vericarToken, nivelAcesso, usuario)