const conn =  require("../config/dabase")
const {DataTypes} = require("sequelize")
const FUNCIONARIO = require("./ModelFuncionario")

const PASSAGEM = conn.define("Passagens" , {
    funcionario_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : FUNCIONARIO,
            key : "matricula"
        },

    },
    data_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: () => new Date().toISOString().split('T')[0] // Define apenas a data (YYYY-MM-DD)
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
PASSAGEM.belongsTo(FUNCIONARIO, { foreignKey: 'funcionario_id' });
// Um funcionário pode ter várias PASSAGEM
FUNCIONARIO.hasMany(PASSAGEM, { foreignKey: 'funcionario_id' });


PASSAGEM.sync().then(() => console.log("TABELA PASSAGEM SINCRONIZADA")).catch((erro) => console.log(erro)
)

module.exports = PASSAGEM