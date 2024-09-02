const express = require("express")
const Router = express.Router()





Router.get("/user", (req,res) =>{
    res.status(200).send("ola mundo")

})


module.exports = Router