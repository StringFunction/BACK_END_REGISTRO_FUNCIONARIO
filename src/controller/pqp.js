const caminhoPassagem = "./src/config/passagem_refeitorio.json"
const express = require("express")
const Router = express.Router()
const fs = require("fs")

Router.get("", async(req, res) =>{
    try{
      console.log('Consultando funcionario ja registrado');
      const registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
      return res.status(200).send(registro.passagens)
  
  
    }catch(erro){
      console.log(erro);
      return res.status(500).send({mensagem : "ERRO NO SERVIDOR"})
    }
  
  })

  module.exports = Router