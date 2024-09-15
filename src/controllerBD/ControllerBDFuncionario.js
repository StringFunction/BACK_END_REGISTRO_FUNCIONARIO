const express = require("express");
const Router = express.Router();
const modelFunc = require("../models/ModelFuncionario"); // Importa o modelo do funcionário
const { where } = require("sequelize");

// Função para gravar um novo funcionário no banco de dados
const gravar = async (infor) => {
  try {
    const novoFuncionario = await modelFunc.create(infor); // Insere novo registro
    return novoFuncionario;
  } catch (erro) {
    return false;
  }
};

// ADD UM NOVO FUNCIONÁRIO AO BANCO DE DADOS
Router.post("/user", async (req, res) => {
  console.log(req.nivel + "  nivel do usuario db");
  if (["2", "3"].includes(req.nivel)) {

  
  const resposta = await gravar(req.body);
  if (!!resposta) {
    res.status(200).send(resposta);
  } else {
    res.status(401).send("Erro ao gravar funcionário");
  }
}else {
  return res.status(401).send({ mensagem: "Você não tem permissão" });
}
});

// CONSULTA A MATRICULA DO FUNCIONÁRIO
Router.get("/user/:matricula", async (req, res) => {
  try {
    const resultado = await modelFunc.findOne({
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

// ATUALIZA OS DADOS DO FUNCIONÁRIO
Router.put("/user", async (req, res) => {
  if (["2", "3"].includes(req.nivel)) {
    try {
      const funcionario = await modelFunc.findOne({
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
Router.delete("/user", async (req, res) => {

  
  if (!["2", "3"].includes(req.nivel)) {
    return res.status(401).send({ "mensagem": "Você não tem permissão" });
  }

  try {
    const funcionario = await modelFunc.findOne({
      where: { matricula: req.body.matricula },
    });

    if (!!funcionario) {
      await funcionario.destroy(); // Remove o registro do banco
      res.status(200).send({ mensagem: "Usuário deletado com sucesso" });
    } else {
      res.status(404).send({ mensagem: "Usuário não encontrado" });
    }
  } catch (erro) {
    res.status(500).send({mensagem : "erro aqui "});
  }
});

module.exports = Router;
