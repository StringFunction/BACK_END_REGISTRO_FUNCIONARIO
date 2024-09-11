const express = require("express")
const Router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const { response } = require("../app")
const { json } = require("sequelize")
const caminho = "./src/config/dados.json"


Router.post("/user", async (req, res) =>{
    try{
        const response = await JSON.parse(fs.readFileSync(caminho, 'utf-8'));
        const result = response.dados.find((e) => e.matricula == req.body.matricula &&  req.body.senha == e.senha )

    if (!!result){
       const token =  jwt.sign(result,"ClecioBonitao", {expiresIn : "1h"})
       return res.status(201).json({"token" : token})
    } else{
        res.statusCode(401)
    }

    }catch (erro) {
        console.log(erro);
        
        return res.status(401).send("erro interno")
    }

    
})


module.exports = Router