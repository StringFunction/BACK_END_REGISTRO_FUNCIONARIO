require("dotenv").config()
require("./src/routes/RotaFuncinario")
require("./src/routes/RotaLogin")
require("./src/routes/RotaUsuario")
// require("./src/config/dabase")
const app = require("./src/app")
const http = require("http")
const port = process.env.PORT || 3000




const server = http.createServer(app)

server.listen(port, ()=>{
    console.log("servidor rodando : http://localhost:3000");
    
})