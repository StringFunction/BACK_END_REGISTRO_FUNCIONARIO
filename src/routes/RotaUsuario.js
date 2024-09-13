const app = require("../app")
const Consulta = require("../controller/ControllerUsuarioSistema")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/lista_negraToken.json"



 async function vericarToken(req, res, next) {
    const token = req.headers["x-access-token"]
    const registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    const index =  registro.lista_negra.findIndex(item => item == token)

    if (index !== -1) return res.status(401).send({mensagem : "token na lista negra"})
    jwt.verify(token, "ClecioBonitao", (erro, decode) =>{
        if (erro) return (res.status(401).send({mensagem : "token invalido"}))
  
            req.matricula = decode.matricula
            req.nivel = decode.nivel
            next()
    })
  
  }


app.use("/v1/usuario", vericarToken, Consulta)