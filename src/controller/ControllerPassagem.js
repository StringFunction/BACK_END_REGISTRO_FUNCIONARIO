const express = require("express")
const Router = express.Router()
const fs = require("fs")
const caminhoPassagem = "./src/config/passagem_refeitorio.json"





const  gravaPassagem = async (infor) =>{
    
    let registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
    registro.passagens.push(infor)
    fs.writeFileSync(caminhoPassagem, JSON.stringify(registro, null, 2), 'utf-8');
    return (registro.passagens)
}
//REGISRA A PASSAGEM DO FUNCINARIO

Router.post("/Registro", async(req,res) =>{
  try{
    const registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
    const index =registro.passagens.findIndex((e) => e.matricula == req.body.matricula)
    if(index == -1){

        const response = await gravaPassagem(req.body)
         return res.status(201).send({mensagem : "Passagem Registrada"})
    }else return res.status(401).send({mensagem : "Funcionario ja Registrado"})


  }catch(erro){
    return res.status(401).send({mensagem :  "erro ao tenta registraPassagem"})
  }

})


module.exports = Router