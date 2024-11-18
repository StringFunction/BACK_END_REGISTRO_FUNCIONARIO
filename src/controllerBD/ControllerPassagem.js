const PASSAGEM = require("../models/ModelPassagem")
const FUNCIONARIO = require("../models/ModelFuncionario")
const { format } = require('date-fns');
const { Op, json, or } = require('sequelize')

const express = require("express")
const ExcelJS = require('exceljs');
const data_atual = new Date();
const dataFormatada = format(data_atual, 'yyyy-MM-dd'); //
const dataFormatada2 = format(data_atual, 'dd-MM-yyyy'); //
const rota = express.Router()
const email =  require("nodemailer")
const {SERVICE_EMAIL, USER,PASS,FROM,TO} = process.env

async function consultando() {
    const RESPOSTA = await PASSAGEM.findAll({ include : {
        model : FUNCIONARIO,
        attributes: ["matricula","nome","setor","cargo","empresa","Optante"]
    },
    where: {
      [Op.and]: [
        {
          finalizado: {
            [Op.or]: ["PRESENTE", "AUSENTE"]
          }
        },
        {
          data_registro: dataFormatada 
        }
      ]
    }
    })
    return RESPOSTA
}
async function addFuncionarioAusente(){
  const func = await FUNCIONARIO.findAll()
  const passagens = await PASSAGEM.findAll()

  func.forEach(async (e) => {
    if (e.Optante){
        const r = passagens.findIndex((f) => f.funcionario_id == e.matricula && f.data_registro == dataFormatada)

        if (r < 0){
          const registrar = await PASSAGEM.create({funcionario_id : e.matricula, finalizado : "AUSENTE"})

        }
      }
  })
}
function status(params) {
  if (params == true) {
    return "Sim"

    
  }else if(params == "frequentado"){
    return "frequentado"
  
} else{
    return "Nao"
}
}
async function CreatePlanilha(){
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Registro_funcionario")
    const j = await addFuncionarioAusente() 

    const atualizar = await PASSAGEM.update({finalizado : "PRESENTE"}, {where : {finalizado : null}})
    const RESPOSTA = await consultando() 
  

    sheet.columns = [
        { header: 'MATRICULA', key: 'matricula', width: 10 },
        { header: 'NOME', key: 'nome', width: 30 },
        { header: 'EMPRESA', key: 'empresa', width: 30 },
        { header: 'OPTANTE', key: 'op', width: 30 },
        { header: 'STATUS', key: 'status', width: 30 },
        { header: 'DATA_ENTRADA', key: 'dt_entrada', width: 30 },
       
      ];
      RESPOSTA.forEach((e) => {
        sheet.addRow({
            "matricula" : e.Funcionario.matricula,
            "nome" : e.Funcionario.nome,
            "empresa" : e.Funcionario.empresa,
            "op" :status(e.Funcionario.Optante),
            "status" : e.finalizado,
            "dt_entrada" : e.data_registro
        })
  
      });

     // Formatar a data
      const filePath = "registro_funcionario" + dataFormatada + ".xlsx";
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer


}
rota.get("/", async (req,res) => {
    console.log("Usuario " + req.matricula + "Consultado Passagem" );
    try {
        console.log("CONSULTANDO REGISTRO PASSAGEM " + req.matricula);
        const RESPOSTA = await PASSAGEM.findAll({where : {
        [Op.and] : [
          {finalizado : null},
       
        ]
        },
         include : {
          model : FUNCIONARIO,
          attributes: ["matricula","nome","setor","cargo","empresa","Optante"]
      },
    }
      
    )
        
     
 
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
            return res.status(200).send(consultandoFuncionario)
            
        } else{
            return res.status(404).send({mensagem : "Funcionario nao encontrado"})
        }

    }catch(erro) {
        if (erro.name === 'SequelizeUniqueConstraintError') {
            console.log('Erro: O funcionário já foi registrado hoje.');
            return res.status(302).send({messaagem  :"O funcionário já foi registrado hoje."})
          } else {
            console.log('Erro ao criar o registro de passagem:', erro);
          }
        
    }

})
rota.post("/finalizar", async(req,res) =>{
    if(![2,3].includes(req.nivel)) return res.status(501).send({mensagem : "Permissao Negada"})
        try{
          const consultar = await PASSAGEM.findAll({where : {
            finalizado : null
          }})
          console.log(consultar);
          
          
          if (consultar.length > 0){
            const buffer = await CreatePlanilha()
           
            let transporter = email.createTransport({
                service: SERVICE_EMAIL,
                auth: {
                  user: USER, // Seu email
                  pass: PASS,           // Sua senha
                },
              });
            
              let mailOptions = {
                from: FROM,
                to: TO,
                subject: 'Dados em Planilha',
                text: 'Segue em anexo a planilha com os dados solicitados.',
                attachments: [
                  {
                    filename: `planilha_registro_funcionario_${dataFormatada2}.xlsx`,
                    content: buffer, // Enviar o buffer como conteúdo
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  },
                ],
              };
            
              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log('Erro ao enviar e-mail:', error);
                } else {
                  console.log('Email enviado: ' + info.response);
                }
              });
            const atualizar = await PASSAGEM.update({finalizado : "PRESENTE"}, {where : {finalizado : null}})
            return res.status(200).send({messaagem : "Acho que deu bom"})
          } else{
            res.status(404).send({mensagem : "SEM REGISTRO PARA SERAM FINALIZADOS"})
          }
    
        }catch(erro){
            console.log(erro);
            res.status(500).send({messaagem : "Deu ruim"})

            
        }

    
})


module.exports = rota