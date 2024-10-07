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
    empresa : {
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
    senha : {
        type : DataTypes.STRING,
        allowNull : false
    },

    nivel : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
}, {
    timestamps : false
})

conn.sync().then(() => {
    console.log("tabela usuario sicronizada");
})
module.exports =  Usuarios