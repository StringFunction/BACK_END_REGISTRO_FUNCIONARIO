const express = require("express")
const Router = express.Router()
const fs = require('fs')
const caminho = "./src/config/usuario.json"

//RETORNA FUNCIONARIO COM MATRICULA PASSADA
const  gravar = async (infor) =>{
  try{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  registro.usuarios.push(infor)
  fs.writeFileSync(caminho, JSON.stringify(registro, null, 2), 'utf-8');
  return (registro.usuarios)

} catch (erro) {
  return (false)
}
 


}



//ADD NOVO USUARIO PARA USAR SISTEMA
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

//CONSULTA USUARIO 
Router.get("/user/:matricula", async(req, res) =>{
  if(req.nivel in ["2","3"]) return res.status(401).send({mensagem : "vc n tem permissao"}) 

  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const resultado = registro.usuarios.find((e) => e.matricula == req.params.matricula)
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
  const index = openFuncioario.usuarios.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){
    res.status(200).send(openFuncioario.usuarios[index])
    openFuncioario.usuarios[index] = { ...openFuncioario.usuarios[index], ...req.body };
      
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
//DELETA USUARIO DOS REGISTRO DO BD 
Router.delete("/user", async(req, res) => {
  if(req.nivel in ["2","3"]) return res.status(401).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.usuarios.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){
    res.status(200).send(openFuncioario.usuarios[index])
    openFuncioario.usuarios.splice(index, 1)
      
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

  

module.exports = Router