const express = require("express")
const Router = express.Router()
const fs = require('fs')
const dados = require("../dados.json")
//RETORNA FUNCIONARIO COM MATRICULA PASSADA
Router.get("/user", (req,res) =>{
  const matricula = req.body.matricula
  res.status(200).send(matricula)

})
//RETORNA TODOS OS FUNCIONARIO 
Router.get("/", (req,res) =>{  
  


    res.status(200).send(dados)
  
  })
  

module.exports = Router