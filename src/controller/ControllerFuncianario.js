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



//ADD NOVO FUNCIONARIO
Router.post("/user", async (req,res) =>{  
  console.log(req.nivel + "  nivel do usuario");
  if(req.nivel in ["2","3"]) return res.status(401).send({mensagem : "vc n tem permissao"}) 

    resposta = await gravar(req.body)

    if(!!resposta){
      res.status(200).send(resposta)
    }else{
      res.status(401).send("erro")
    }
  
  })

  
Router.get("/user/:matricula", async(req, res) =>{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const resultado = registro.dados.find((e) => e.matricula == req)
  if (!!resultado) {
    res.status(200).send(resultado)
    
  } else{
    res.status(401).send("usuario n encontrado")

  }


})
//ATUALIZAR USUARIO
Router.put("/user", async(req, res) => {
  if(req.nivel in ["2","3"]) return res.status(401).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.dados.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){
    res.status(200).send(openFuncioario.dados[index])
    openFuncioario.dados[index] = { ...openFuncioario.dados[index], ...req.body };
      
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', (erro) => {
      if (erro) throw erro;
      console.log('Arquivo atualizado com sucesso!');
    });
  }else {
    res.status(400).send({mensaga : "usuario n encontrdao"})
  }


}catch (erro){
  res.send({erro})
}
  
})
Router.delete("/user", async(req, res) => {
  if(req.nivel in ["2","3"]) return res.status(401).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.dados.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){
    res.status(200).send(openFuncioario.dados[index])
    openFuncioario.dados.splice(index, 1)
      
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', (erro) => {
      if (erro) throw erro;
      console.log('Arquivo atualizado com sucesso!');
    });
  }else {
    res.status(400).send({mensaga : "usuario n encontrdao"})
  }


}catch (erro){
  res.send({erro})
}
  
})
Router.delete("user")
  

module.exports = Router