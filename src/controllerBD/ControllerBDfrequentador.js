const e = require("express");
const FUNCIONARIO =  require("../models/ModelFuncionario")
const express = require("express")
const rota = express.Router()



rota.post("/", async (req,res) => {
    try {

        const pesquisa = await FUNCIONARIO.findOne({where : {matricula : req.body.matricula}})
        if(!!!pesquisa){
            const cadastraFrequentador =  await FUNCIONARIO.create(req.body)
           if (!!cadastraFrequentador) {
                return res.status(200).send({mensagem : "Registrado com sucesso"})
           }
            
        } else {
            return res.status(404).send("Matricula ja Cadastrada")
        }
    
    }catch (erro){
        res.status(500).send({mensagem : "Erro ao tenta registra frequetandor"})
        
    }
    
})


module.exports = rota
