const express = require("express")
const Router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const caminho = "./src/config/usuario.json"
const caminha_lista_negra = "./src/config/lista_negraToken.json"
const vericarToken = require("../middleware/verificarToken")

//FUNCAO PARA GRAVA TOKEN INVALIDOS
const  grava_token_na_lista_negra = async (infor) =>{
    try{
    let registro = await JSON.parse(fs.readFileSync(caminha_lista_negra, 'utf-8'));
    registro.lista_negra.push(infor)
    fs.writeFileSync(caminha_lista_negra, JSON.stringify(registro, null, 2), 'utf-8');
    return (registro.lista_negra)
  
  } catch (erro) {
    console.log(erro);
    
    return (false)
  }
   
  
  
  }
//AUTENTICACAO 
Router.post("", async (req, res) =>{
    try{
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log("IP DO SOLICITANTE " + ip);
        const response = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
        const result = response.usuarios.find((e) => e.matricula == req.body.matricula &&  req.body.senha == e.senha )
        if (!!result){
        console.log("Usuario autenticado " + result.nome + "\n" + "Matricula " + result.matricula);
        
        const token =  jwt.sign(result,"ClecioBonitao", {expiresIn : "1h"})
        return res.status(200).send({"token" : token})
        } else{
            console.log("Usuario nao encontrado");
            return res.status(404).send({mensagem : "USUARIO OU SENHA INCORRETA"})
        }

    }catch (erro) {
        console.log(erro);
        return res.status(500).send({mensagem : "ERRO NO SERVIDOR DE AUTENTICAO "})
    }

    
})
//DESLOGAR E REGISTRA TOKEN 
Router.post("/logaut", vericarToken, async (req, res) =>{
    const ip = req.ip || req.connection.remoteAddress;
    console.log("IP DO SOLICITANTE " + ip);
    console.log("Solicatacao deslogar");
    const token = req.headers["x-access-token"] 
    const registro = await JSON.parse(fs.readFileSync(caminha_lista_negra, 'utf-8'));
    const index =  registro.lista_negra.findIndex(item => item == token)
    if (index !== -1) return res.status(498).send({mensagem : "token na lista negra"})
    
    const response = await grava_token_na_lista_negra(token)
    if (!!response) return res.status(200).send(response)
    res.status(500).send({mensagem : "ERRO NO SERVIDOR DE LISTA NEGRA TOKEN"})
    

})

module.exports = Router