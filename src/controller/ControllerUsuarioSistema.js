const express = require("express")
const Router = express.Router()
const fs = require('fs')
const caminho = "./src/config/usuario.json"

//RETORNA FUNCIONARIO COM MATRICULA PASSADA
const  gravar = async (infor) =>{
  try{
  let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  registro.usuarios.push(infor)
  fs.writeFileSync(caminho, JSON.stringify(registro, null, 2), 'utf-8', () =>{
    return res.status(200).send({mensagem : "USUARIO DELETADO"})
  });
  return (registro.usuarios)

} catch (erro) {
  return (false)
}
 


}



//ADD NOVO USUARIO PARA USAR SISTEMA
Router.post("", async (req,res) =>{  
  console.log(req.nivel + "  nivel do usuario");
  if(!["3"].includes(req.nivel)) return res.status(423).send({mensagem : "vc n tem permissao"}) 
    let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    const resultado = registro.usuarios.find((e) => e.matricula == req.body.matricula)

    if(!!resultado) return res.status(302).send({mensagem : "Usuario ja Cadastrado "})

    resposta = await gravar(req.body)

    if(!!resposta){
      res.status(200).send(resposta)
    }else{
      res.status(500).send({mensagem : "ERRO NO SERVIDOR DE CRIA NOVO USUARIO"})
    }
  
  })

//CONSULTA USUARIO 
Router.get("/:matricula", async(req, res) =>{
  if(!["3"].includes(req.nivel)) return res.status(423).send({mensagem : "vc n tem permissao"}) 
  try{

      let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
      const resultado = registro.usuarios.find((e) => e.matricula == req.params.matricula)
      if (!!resultado) {
        res.status(200).send(resultado)
        
      } else{
        return res.status(404).send("usuario n encontrado")
        
      }
}catch(erro){
  return res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTA LOCALIZAR USUARIO "})
}


})
//ATUALIZAR USUARIO
Router.put("/", async(req, res) => {
  if(!["3"].includes(req.nivel)) return res.status(423).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.usuarios.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){

    openFuncioario.usuarios[index] = { ...openFuncioario.usuarios[index], ...req.body };
      
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', () =>{
        return res.status(200).send({mensagem : "DADOS USUARIO ATUALIZADO"})
     
    }) 
    
  }else {
    return res.status(404).send({mensaga : "usuario n encontrdao"})
  }


}catch (erro){
  return res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTA ATUALIZA USUARIO "})
}
  
})

//DELETA USUARIO DOS REGISTRO DO BD 
Router.delete("/:matricula", async(req, res) => {
  if(!["3"].includes(req.nivel)) return res.status(423).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.usuarios.findIndex((e) => e.matricula == req.params.matricula)
 

  if(index >= 0){
    openFuncioario.usuarios.splice(index, 1)
      
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', () =>{
      return res.status(200).send({mensagem : "USUARIO DELETADO"})
    }) 
    
    

  }else {
    return res.status(404).send({mensaga : "usuario n encontrdao"})
  }


}catch (erro){
  return res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTA DELETADO USUARIO "})

}
  
})

  

module.exports = Router