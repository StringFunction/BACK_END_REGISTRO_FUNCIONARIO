const app = require("../app")
const Frequentdor = require("../controllerBD/ControllerBDfrequentador")



app.use("/v1/frequentador", Frequentdor)