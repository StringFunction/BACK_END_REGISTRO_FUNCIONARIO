const express = require("express")
const Router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/usuario.json"
const caminha_lista_negra = "./src/config/lista_negraToken.json"

//FUNCAO PARA GRAVA TOKEN INVALIDOS
const  grava_token_na_lista_negra = async (infor) =>{
    try{
    let registro = await JSON.parse(fs.readFileSync(caminha_lista_negra, 'utf-8'));
    registro.lista_negra.push(infor)
    fs.writeFileSync(caminha_lista_negra, JSON.stringify(registro, null, 2), 'utf-8');
    return (registro.lista_negra)
  
  } catch (erro) {
    return (false)
  }
   
  
  
  }
//AUTENTICACAO 
Router.post("/user", async (req, res) =>{
    try{
        const response = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
        const result = response.usuarios.find((e) => e.matricula == req.body.matricula &&  req.body.senha == e.senha )
        console.log(result);
        

        if (!!result){
        const token =  jwt.sign(result,"ClecioBonitao", {expiresIn : "1h"})
        return res.status(201).json({"token" : token})
        } else{
            return res.status(401).send({mensagem : "usuario nao encontrado"})
        }

    }catch (erro) {
        console.log(erro);
        
        return res.status(401).send("erro interno")
    }

    
})
//DESLOGAR E REGISTRA TOKEN 
Router.post("/logaut",  async (req, res) =>{
    const token = req.headers["x-access-token"]
    const response = await grava_token_na_lista_negra(token)
    if (!!response) return res.status(201).send(response)
    res.status(401).send({mensagem : "erro ao tenta grava token"})
    

})

module.exports = Router