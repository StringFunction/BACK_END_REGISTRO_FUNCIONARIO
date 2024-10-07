const conn =  require("../config/dabase")
const {DataTypes} = require("sequelize")

	

const FUNCIONARIO = conn.define("Funcionarios", {
    matricula : {
        type: DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true
    },
    nome : {
        type : DataTypes.STRING,
        allowNull : false
    },
    empresa  : {
        type : DataTypes.STRING,
        allowNull : false
    },
    setor : {
        type : DataTypes.STRING,
        allowNull : false

    },
    cargo : {
        type : DataTypes.STRING,
        allowNull : false
    },
    Optante : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
}, 
{
    timestamps : false
})
FUNCIONARIO.sync().then(() =>{
    console.log("tabela funcionario sincronizada");
    
}).catch(erro => console.log(erro)
)


module.exports = FUNCIONARIO