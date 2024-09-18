const conn =  require("../config/dabase")
const {DataTypes} = require("sequelize")
const Usuarios = conn.define("Usuarios", {

    matricula : {
        type : DataTypes.INTEGER,
        allowNull : false
        
    },
    nome : {
        type : DataTypes.STRING,
        allowNull : false
    },
    senha : {
        type : DataTypes.STRING,
        allowNull : false
    },
    nivel : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
})

conn.sync().then(() => {
    console.log("tabela usuario sicronizada");
})
module.exports =  Usuarios