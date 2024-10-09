const PASSAGEM = require("../models/ModelPassagem")
const FUNCIONARIO = require("../models/ModelFuncionario")
const express = require("express")
const rota = express.Router()


rota.get("/", async (req,res) => {
    console.log("Usuario " + req.matricula + "Consultado Passagem" );
    try {
        console.log("CONSULTANDO REGISTRO PASSAGEM " + req.matricula);
        
        const resposta = await PASSAGEM.findAll({ include : {
            model : FUNCIONARIO,
            attributes: ["matricula","nome","setor","cargo","empresa","Optante"]
        }})
        return res.status(200).send(resposta)  
    }catch (erro) {
        res.status(505).send({mensagem : "ERRO NO SERVIDOR"})
    }
    
})

rota.post("/", async (req,res) => {

    try{
        const consultandoFuncionario = await FUNCIONARIO.findOne({where : {matricula : req.body.matricula}})
       console.log(consultandoFuncionario);
       
        

        if (!!consultandoFuncionario) {
            const registrar = await PASSAGEM.create({funcionario_id : req.body.matricula})
            return res.status(200).send({messaagem  : "Usuario registrado "})
            
        } else{
            return res.status(404).send({mensagem : "Funcionario nao encontrado"})
        }

    }catch(erro) {
        if (erro.name === 'SequelizeUniqueConstraintError') {
            console.log('Erro: O funcionário já foi registrado hoje.');
            return res.status(404).send({messaagem  :"O funcionário já foi registrado hoje."})
          } else {
            console.log('Erro ao criar o registro de passagem:', erro);
          }
        
    }

})


module.exports = rota