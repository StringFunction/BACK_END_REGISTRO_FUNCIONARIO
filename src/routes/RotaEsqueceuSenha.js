 const app = require("../app")
 const Esqueceu =  require("../controllerBD/ControllerEsqueceuSenha")


 app.use('/EsqueceuSenha', Esqueceu)