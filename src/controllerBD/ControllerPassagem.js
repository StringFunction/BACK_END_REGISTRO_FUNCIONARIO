const PASSAGEM = require("../models/ModelPassagem")
const FUNCIONARIO = require("../models/ModelFuncionario")
const express = require("express")
const ExcelJS = require('exceljs');
const { continueSession } = require("pg/lib/crypto/sasl")
const rota = express.Router()
const email =  require("nodemailer")

const RESPOSTA = ''
async function consultando() {
    const RESPOSTA = await PASSAGEM.findAll({ include : {
        model : FUNCIONARIO,
        attributes: ["matricula","nome","setor","cargo","empresa","Optante"]
    },
    where : {
        finalizado : null
    }
    })
    return RESPOSTA
}
async function CreatePlanilha(){
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Registro_funcionario")
    const RESPOSTA = await consultando()

    sheet.columns = [
        { header: 'MATRICULA', key: 'matricula', width: 10 },
        { header: 'NOME', key: 'nome', width: 30 },
        { header: 'EMPRESA', key: 'empresa', width: 30 },
        { header: 'Optante', key: 'op', width: 30 },
       
      ];
      RESPOSTA.forEach((e) => {
        sheet.addRow({
            "matricula" : e.Funcionario.matricula,
            "nome" : e.Funcionario.nome,
            "empresa" : e.Funcionario.empresa,
            "op" : e.Funcionario.Optante ? "Sim" : "Nao"
        })
  
      });
      const filePath = 'dados.xlsx';
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer


}
rota.get("/", async (req,res) => {
    console.log("Usuario " + req.matricula + "Consultado Passagem" );
    try {
        console.log("CONSULTANDO REGISTRO PASSAGEM " + req.matricula);
        const RESPOSTA = await consultando()
        
     
 
    return res.status(200).send(RESPOSTA)  
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
rota.post("/finalizar", async(req,res) =>{
    if(![2,3].includes(req.nivel)) return res.status(501).send({mensagem : "Permissao Negada"})
        try{
            const buffer = await CreatePlanilha()
            let transporter = email.createTransport({
                service: 'gmail',
                auth: {
                  user: 'cleciolimalive@gmail.com', // Seu email
                  pass: 'jmqw egwg jafn chbp',           // Sua senha
                },
              });
            
              let mailOptions = {
                from: 'cleciolimalive@gmail.com',
                to: 'franciscoclecioti@gmail.com',
                subject: 'Dados em Planilha',
                text: 'Segue em anexo a planilha com os dados solicitados.',
                attachments: [
                  {
                    filename: 'dados.xlsx',
                    content: buffer, // Enviar o buffer como conteúdo
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  },
                ],
              };
            
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Erro ao enviar e-mail:', error);
                } else {
                  console.log('Email enviado: ' + info.response);
                }
              });
            const atualizar = await PASSAGEM.update({finalizado : "Sim"}, {where : {finalizado : null}})
            return res.status(200).send({messaagem : "Acho que deu bom"})
    
        }catch(erro){
            console.log(erro);
            res.status(500).send({messaagem : "Deu ruim"})

            
        }

    
})


module.exports = rota