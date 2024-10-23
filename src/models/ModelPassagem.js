const conn =  require("../config/dabase")
const {DataTypes} = require("sequelize")
const {format} = require("date-fns")
const data_atual = new Date();
const dataFormatada = format(data_atual, 'yyyy-MM-dd'); 
const FUNCIONARIO = require("./ModelFuncionario")



const PASSAGEM = conn.define("Passagens" , {
    funcionario_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : FUNCIONARIO,
            key : "matricula"
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'  

    },
    data_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: dataFormatada 
    },
    finalizado : {
        type: DataTypes.STRING,
        allowNull: true
    },

}, 

    {
        indexes: [
          {
            unique: true,
            fields: ['funcionario_id', 'data_registro'] // Restringe para um registro único por funcionário por dia
          }
        ]
})
// Definindo o relacionamento (uma passagem pertence a um funcionário)
PASSAGEM.belongsTo(FUNCIONARIO, { foreignKey: 'funcionario_id', onDelete: 'CASCADE', });
// Um funcionário pode ter várias PASSAGEM
FUNCIONARIO.hasMany(PASSAGEM, { foreignKey: 'funcionario_id', onDelete : "CASCADE", onUpdate : "CASCADE"});


PASSAGEM.sync().then(() => console.log("TABELA PASSAGEM SINCRONIZADA")).catch((erro) => console.log(erro)
)

module.exports = PASSAGEM