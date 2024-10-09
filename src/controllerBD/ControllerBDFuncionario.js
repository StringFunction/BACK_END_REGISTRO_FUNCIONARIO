const express = require("express");
const Router = express.Router();

const { where } = require("sequelize");
const FUNCIONARIO = require("../models/ModelFuncionario");

// Função para gravar um novo funcionário no banco de dados
const gravar = async (infor) => {
  try {
    const novoFuncionario = await modelFunc.create(infor); // Insere novo registro
    return novoFuncionario;
  } catch (erro) {
    console.log(erro);
    
    return false;
  }
};

// ADD UM NOVO FUNCIONÁRIO AO BANCO DE DADOS
Router.post("/", async (req, res) => {
  try{
    const consultaMatricula =  await FUNCIONARIO.findOne({where : { matricula : req.body.matricula}})
    if(!consultaMatricula) {
      const cadastrar = await FUNCIONARIO.create(req.body)
      return res.status(200).send({mensagem  : "Funcionario Cadastrado!!!!!!"})
    }else {
      res.status(404).send({mensagem : "Funcionario ja Cadastrado!!!!!"})
    }
  }catch(erro){
    return res.status(501).send({mensagem : "Erro no servidor"})

  }
});

// CONSULTA A MATRICULA DO FUNCIONÁRIO

Router.get("/:matricula", async (req, res) => {
  try {
    const resultado = await FUNCIONARIO.findOne({
      where: { matricula: req.params.matricula },
    });

    if (!!resultado) {
      res.status(200).send(resultado);
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (erro) {
    res.status(500).send({ erro });
  }
});
Router.get("/", async (req, res) => {
  try {
    const resultado = await FUNCIONARIO.findAll()

    if (!!resultado) {
      console.log(resultado);
      
      res.status(200).send(resultado);
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (erro) {
    res.status(500).send({ erro });
  }
});
// ATUALIZA OS DADOS DO FUNCIONÁRIO
Router.put("/", async (req, res) => {
  if ([2, 3].includes(req.nivel)) {
    try {
      const funcionario = await FUNCIONARIO.findOne({
        where: { matricula: req.body.matricula },
      });
      
      if (!!funcionario) {
        await funcionario.update(req.body, {where : { matricula : req.body.matricula}}); // Atualiza os dados no banco
        res.status(200).send(funcionario);
      } else {
        res.status(404).send({ mensagem: "Usuário não encontrado" });
      }
    } catch (erro) {
      res.status(500).send({ erro });
    }
  }else {
    return res.status(401).send({ mensagem: "Você não tem permissão" });
  }
  });

// DELETA FUNCIONÁRIO
Router.delete("/", async (req, res) => {

  
  if (![2, 3].includes(req.nivel)) {
    return res.status(401).send({ "mensagem": "Você não tem permissão" });
  }
  try {
    const funcionario = await FUNCIONARIO.findOne({
      where: { matricula: req.body.matricula },
    });

    if (!!funcionario) {
      await funcionario.destroy({where : { matricula : req.body.matricula}}); // Remove o registro do banco
      res.status(200).send({ mensagem: "Usuário deletado com sucesso" });
    } else {
      res.status(404).send({ mensagem: "Usuário não encontrado" });
    }
  } catch (erro) {
    console.log(erro);
    
    res.status(500).send({mensagem : "erro aqui "});
  }
});

module.exports = Router;
