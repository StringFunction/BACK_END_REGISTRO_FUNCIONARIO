const usuario = require("../models/ModelUsuario")
const Express = require("express")
const rota = Express.Router()
const jwt = require("jsonwebtoken")
const Email = require("nodemailer")
const {SERVICE_EMAIL, USER,PASS,FROM,TO} = process.env
const BodyEmail = require("../Styles/StyleEmail")
const { logger } = require("sequelize/lib/utils/logger")
const Usuarios = require("../models/ModelUsuario")



function ChaveToken(pegar){
       const token = jwt.sign(pegar, "ClecioBonitao", {expiresIn : "5m"})
       return token
}
async function EnviarEmail(params) {
    try {
        const Transporte = Email.createTransport({
            service: process.env.SERVICE_EMAIL, // Certifique-se de definir isso no .env
            auth: {
                user: process.env.USER, 
                pass: process.env.PASS,
            }
        });

        const Corpo = {
            from: process.env.FROM,
            to: params.email,
            subject: "[CONDE DO FORRO] Por favor, redefina sua senha",
            html: BodyEmail(params.token),
        };

        // Transporte.sendMail(Corpo).then((resultado) => {
        //     console.log("Email Enviado com sucesso!! " + resultado);
        //     return "Resutaldo deu certo"
            
        // }).catch((erro) => {
        //     console.log("Erro ao tenta envia email" + erro);
        //     return "Resutaldo deu erro"

            
        // });
        return  Transporte.sendMail(Corpo)
        
       
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw error;
    }
}

rota.post("/", async(req, res) => {
    // CONFIGURA PELOS MENOS DOIS  EMAIL DE MATRICULA  
    try{
        requisao = await usuario.findOne({where : {matricula : req.body.matricula, email : req.body.email}})
    
        
        
        if(!requisao) return res.status(404).send({mensagem : "Usuario nao encontrado"});
        id = requisao.id
        token = ChaveToken({id : id, matricula : req.body.matricula})
    
        console.log("primeiro");
        
        deu = await EnviarEmail({email : req.body.email, token : token})
        console.log(deu);
        console.log("Terceiro");
        
        if (!deu) {
            return res.status(500).send({mensagem : "erro no servidor"})
        }
        update = await usuario.update({token : token}, {
            where : {
                id : requisao.id
            }
        })
        res.status(200).send({mensagem : "Email enviado "})

     
    
        

    }catch (erro) {

        console.log("ERRO AO TENTA BUSCA DADOS", erro);
        return res.status(500).send({mensagem : "ERRO NO LADO DO SERVIDOR"})
    }
    
  

})

rota.post("/resert", async(req, res)=> {
    try {
     
    
        try {
            const consultaToken =  jwt.verify(req.body.token, "ClecioBonitao")
            console.log(consultaToken);
            const id = consultaToken.id
            requisao =  await usuario.findOne({
                where : {
                    id : id,
                    token : req.body.token
                }
            })
        if(!requisao) return res.status(404).send({mensagem : "Usuario ou token invalido"})
        const up = await usuario.update({senha : req.body.senha}, {where : { id : id}})
        return res.status(200).send({mensagem : "Senha atualizada"})

        }catch (erro) {
            console.log(erro);
            
            return res.status(400).send({mensagem : "Token Invalido"})
        }
        

        
    
        
        
    }catch(erro){
        console.log(erro);
        
        return res.status(500).send(erro)
    }
    
})

module.exports = rota