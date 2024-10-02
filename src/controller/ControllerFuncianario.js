const express = require("express")
const Router = express.Router()
const fs = require('fs')
// const registro = require("../dados.json")
const modelFunc = require("../models/ModelFuncionario")
const caminho = "./src/config/funcionarios.json"


//FUNCAO PARA ABRIR E GRAVA REGISTRO BASE DA DADOS DO FUNCIONARIO
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

//CONSULTA A MATRICULA DO FUNCIONARIO
Router.get("/:matricula", async(req, res) =>{
  try {
    const matricula = req.params.matricula;
    if (!/^\d+$/.test(matricula)) { // Aqui, estou assumindo que a matrícula deve ser numérica e ter 6 dígitos
        return res.status(400).send({ mensagem: "Matrícula inválida. Verifique o formato." });
    }


    let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    console.log("teste");
    
    const resultado = registro.dados.find((e) => e.matricula == req.params.matricula)
    if (!!resultado) {
      res.status(200).send(resultado)
      
    } else{
      return res.status(404).send("usuario n encontrado")
      
    }
    
  }catch(erro){
    console.log(erro);
    
    return res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTAR LOCALIZAR MATRICULA"})
  }

})
//RETORNA TODOS OS FUNCIONARIOS
Router.get("/", async(req, res) =>{
  try {

    let registro = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    const resultado = registro.dados
    res.status(200).send(resultado)
  }catch(erro){
    console.log(erro);
    return res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTAR CHAMA FUNCIONARIOS"})
  }

})




//ADD UM NOVO FUNCIONARIO AO DADOS
Router.post("/", async (req,res) =>{  
  console.log(req.nivel + "  nivel do usuario");
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));

  const index = openFuncioario.dados.findIndex((e) => e.matricula == req.body.matricula)  
  if(!["2","3"].includes(req.nivel)) return res.status(401).send({mensagem : "voce n tem permissao para cadastra novo funcionario"}) 
    if (index >= 0) return res.status(404).send({mesagem : "MATRICULA JA CADASTRADA "})
    resposta = await gravar(req.body)
    if(!!resposta){
      res.status(200).send(resposta)
    }else{
      res.status(500).send({mensagem : "ERRO NO SERVIDOR AO TENTA CRIAR NOVO FUNCIONARIO"})
    }
  
  })

//ATUALIZA OS DADOS DO FUNCIONARIO
Router.put("/", async(req, res) => {
  if(!["2","3"].includes(req.nivel)) return res.status(401).send({mensagem : "voce n tem permissao para atualiza os dados do funcionario"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.dados.findIndex((e) => e.matricula == req.body.matricula)
 
  
  if(index >= 0){

    openFuncioario.dados[index] = { ...openFuncioario.dados[index], ...req.body };
    
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', (erro) => {
      if(erro) return   res.status(500).send({mesagem : "ERRO AO TENTA ATUALIZAR DADOS DE FUNCIONARIO"})
      return res.status(200).send({mensagem : 'Dados  atualizado com sucesso!'})
    })
  }else {
    return res.status(404).send({mensaga : "usuario n encontrdao"})
  }


}catch (erro){
  console.log(erro);
  
  return res.status(500).send({mesagem : "ERRO AO TENTA ATUALIZAR DADOS DE FUNCIONARIO"})
}
  
})



//DELETA FUNCIONARIO
Router.delete("/", async(req, res) => {
  if(!["2","3"].includes(req.nivel)) return res.status(401).send({mensagem : "vc n tem permissao"}) 
  try{
  const openFuncioario =  await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
  const index = openFuncioario.dados.findIndex((e) => e.matricula == req.body.matricula)
 

  if(index >= 0){
  
    openFuncioario.dados.splice(index, 1)
      
    fs.writeFile(caminho, JSON.stringify(openFuncioario, null, 2), 'utf-8', () => {
      return res.status(200).send({mensagem : "Funcionario deletado"})

    })
    
  }else {
    return res.status(404).send({mensaga : "funcionario n encontrdao"})
  }


}catch (erro){
  console.log(erro);
  
  res.status(500).send({mesagem : "ERRO AO TENTA DELETA DADOS DE FUNCIONARIO"})
}
  
})

  

module.exports = Router