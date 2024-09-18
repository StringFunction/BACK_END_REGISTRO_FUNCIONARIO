const usuario = require("../models/ModelUsuario")
const express = require("express")
const Router =  express.Router()
const jwt = require("jsonwebtoken")





Router.post("/", async(req,res) =>{
    try{
        const resposta = await usuario.findAll()
        console.log(resposta);
        
        const usuarioEncontra =   resposta.find((e) => e.matricula == req.body.matricula && e.senha == req.body.senha)
        console.log("8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888");
        
        console.log(usuarioEncontra);
        

        if(!!usuarioEncontra){
            const pegar = {
                matricula : usuarioEncontra.matricula,
                nome : usuarioEncontra.nome,
                nivel : usuarioEncontra.nivel
            }
            const token = jwt.sign(pegar, "ClecioBonitao", {expiresIn : "1h"})
           return res.status(200).send({"token" : token})
        } else {
           return res.status(404).send({mensagem : "Usuario ou Senha incorreta"})

        }
    } catch(erro) {
        res.status(500).send({mensagem : "ERRO NO LADO DO SERVIDOR"})
    }
})


module.exports = Router