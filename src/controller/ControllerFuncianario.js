const express = require("express")
const Router = express.Router()
const fs = require('fs')
// const registro = require("../dados.json")
const modelFunc = require("../models/ModelFuncionario")
const caminho = "./src/config/dados.json"
//RETORNA FUNCIONARIO COM MATRICULA PASSADA
const  gravar = async (infor) =>{
  try{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  registro.dados.push(infor)
  fs.writeFileSync(caminho, JSON.stringify(registro, null, 2), 'utf-8');
  return (registro.dados)

} catch (erro) {
  return (false)
}
 


}

Router.get("/user", (req,res) =>{
  const matricula = req.body.matricula
  res.status(200).send(matricula)

})
//RETORNA TODOS OS FUNCIONARIO 
Router.post("/user", async (req,res) =>{  
    resposta = await gravar(req.body)

    if(!!resposta){
      res.status(200).send(resposta)
    }else{
      res.status(401).send("erro")
    }
  
  })

Router.get("/user/:matricula", async(req, res) =>{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const resultado = registro.dados.find((e) => e.matricula == req.params.matricula)
  if (!!resultado) {
    res.status(200).send(resultado)
    
  } else{
    res.status(401).send("usuario n encontrado")

  }


})
  
Router.get("/user/:matricula", async(req, res) =>{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const resultado = registro.dados.find((e) => e.matricula == req.params.matricula)
  if (!!resultado) {
    res.status(200).send(resultado)
    
  } else{
    res.status(401).send("usuario n encontrado")

  }


})
  

module.exports = Router