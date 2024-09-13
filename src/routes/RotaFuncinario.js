const app = require("../app")
const Consulta = require("../controller/ControllerFuncianario")
const jwt = require("jsonwebtoken")


function vericarToken(req, res, next) {
    const token = req.headers["x-access-token"]
    jwt.verify(token, "ClecioBonitao", (erro, decode) =>{
        if (erro) return (res.status(401).send("erroo "))
  
            req.matricula = decode.matricula
            req.nivel = decode.nivel
            next()
    })
  
  }


app.use("/v1/funcionario", vericarToken, Consulta)