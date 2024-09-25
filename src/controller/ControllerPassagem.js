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
    console.log("Registrando passagem");
    
    const registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
    const index = registro.passagens.findIndex((e) => e.matricula == req.body.matricula)
    if(index == -1){

        const response = await gravaPassagem(req.body)
        console.log("Passagem registrada com sucesso");
        
         return res.status(200).send({mensagem : "Passagem Registrada"})

    } else {

    console.log("Funcionario ja comeu");
      return res.status(302).send({mensagem : "Funcionario ja Registrado"})
    }


  }catch(erro){
    console.log(erro);
    
    return res.status(500).send({mensagem :  "erro ao tenta registraPassagem"})
  }

})
Router.get("/", async(req, res) =>{
  try{
    console.log('Consultando funcionario ja registrado');
    
    const registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
    return res.status(200).send(registro.passagens)


  }catch(erro){
    console.log(erro);
    return res.status(500).send({mensagem : "ERRO NO SERVIDOR"})
  }

})
Router.delete("/Registro", async (req,res) =>{
  try{
    const registro = await JSON.parse(fs.readFileSync(caminhoPassagem, 'utf-8'));
    registro.passagens = []
    fs.writeFileSync(caminhoPassagem, JSON.stringify(registro, null, 2), 'utf-8');
    res.status(200).send({mensagem : "FINALIZADO"})

  }catch(erro){
    return res.status(500).send({mensagem : "ERRO NO SERVIDOR"})
  }


})


module.exports = Router