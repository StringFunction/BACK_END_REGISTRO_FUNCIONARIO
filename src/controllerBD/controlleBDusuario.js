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
    const response = await usuario.create(req.body)
    console.log(req.nivel);
    
    console.log("passei aqui do suario ");
    
    if (response) {
        console.log("entrei dentro no");
        
       return res.status(201).send({mensagem : "usuario criado "})
        
    }else{
        console.log("quia sou mais um dia");
        return res.status(401).send({mensagem : "erro ao tenta cadastra novo usuario "})
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
        return res.status(401).send({mensagem : "erro no servidor "})
    }
})

//ATUALIZA USUARIO DE ACORDO COMM MATRICULA
rota.put("/user/:matricula", async(req,res) => {
    try{
        const user =  await usuario.findOne({where : {
            matricula : req.params.matricula
        }})
        console.log(user);
        
        if (user) {
            const deletaUsuario = await usuario.update(req.body , {where : { matricula : req.params.matricula }})
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