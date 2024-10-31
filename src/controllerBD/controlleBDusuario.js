const usuario = require("../models/ModelUsuario")
const express = require("express")
const rota = express.Router()

//CONSULTA USUARIO COM BASE NA MATRICULA
rota.get("/:matricula", async(req, res) => {
    if(["3"].includes(req.nivel)){
        usuario.findOne({where : {matricula : req.params.matricula}}).then((e) =>{
            console.log("enterei aqui memso ");
            console.log(e); 
            if (e) {
                return res.status(201).send(e)
            }else{
                return res.status(401).send({mensagem : "usuario n encontrado"})
            }
            
        }
        ).catch((erro) =>{
            console.log(erro);
            res.status(401).send({mensagem : "deu bom n viu "})
            
        })
    }else {
        return res.status(401).send({mensagem : "usuario sem permisao "})
    }

})


//RETORNA TODOS OS USUARIO DO BANCO 
rota.get("/", async(req, res) => {
    if([3].includes(req.nivel)){
        usuario.findAll().then((e) =>{
            console.log("enterei aqui memso ");
            res.status(201).send(e)
        }
        ).catch((erro) =>{
            console.log(erro);
            res.status(401).send({mensagem : "deu bom n viu "})
            
        })
    }else {
        return res.status(401).send({mensagem : "usuario sem permisao "})
    }

})

//CRIA UM NOVO USUARIO
rota.post("/", async (req, res) =>{
    try {

        const consultandoUsuario = await usuario.findOne({where : {matricula : req.body.matricula}})
        if (!!consultandoUsuario) return res.status(404).send({mensagem : "Matricula de usuario ja cadastrada!"})
        const CriarUsuario = await usuario.create(req.body)
        if (!!CriarUsuario) {
            return res.status(200).send({mensagem : "usuario criado com sucesso!!"})
        }

    } catch(erro) {
        console.log(erro);

        return res.status(500).send({mensagem : "ERRO DO LADO DE SERVIDOR"})

    }

   
})

//DELATA USUARIO DE ACORDO COM MATRICULA
rota.delete("/:matricula", async(req,res) => {
    try{
        const user =  await usuario.findOne({where : {
            matricula : req.params.matricula
        }})
        console.log(user);
        
        if (user) {
            const deletaUsuario = await usuario.destroy({where : { matricula : req.params.matricula }})
            if(deletaUsuario){
                return res.status(201).send({mensagem : "usuario deletado"})
            }else{
                return res.status(401).send({mensagem : "erro ao tentar deletar usuario"})
            }
            
            
        }else{
            return res.status(401).send({mensagem : "usuario n encontrado "})
        }
    }catch(erro){
        console.log(erro);
        return res.status(401).send({mensagem : "erro no servidor "})
        
    }
})

//ATUALIZA USUARIO DE ACORDO COMM MATRICULA
rota.put("/", async(req,res) => {
    try{
        const user =  await usuario.findOne({where : {
            matricula : req.body.matricula
        }})
        console.log(user);
        
        if (user) {
            const deletaUsuario = await usuario.update(req.body , {where : { matricula : req.body.matricula }})
            if(deletaUsuario){
                return res.status(201).send({mensagem : "usuario atualizado"})
            }else{
                return res.status(401).send({mensagem : "erro ao tentar deletar usuario"})
            }
            
            
        }else{
            return res.status(401).send({mensagem : "usuario n encontrado "})
        }
    }catch(erro){
        return res.status(401).send({mensagem : "erro no servidor "})
    }
})

module.exports = rota  