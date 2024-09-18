const {Sequelize} = require("sequelize")
const {USUARIO, BANCO, HOST, SENHA, PORT_BD} = process.env

const conn = new Sequelize(`postgresql://${USUARIO}:${SENHA}@${HOST}:${PORT_BD}/${BANCO}`)

conn.authenticate().then(()=>{
    console.log("BANCO CONECTADO");
    
}).catch(erro =>{console.log(erro);
})



module.exports = conn