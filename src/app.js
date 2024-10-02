const cors = require("cors")
const express = require("express")

const app = express()
app.use(express.json())
app.use(cors({
    origin : "*"
}))
app.options('*', cors()); // Responde às requisições preflight automaticamente


module.exports = app