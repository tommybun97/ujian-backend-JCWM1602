const express = require("express")
const Router = express.Router()

// Import Controller
const authenticController = require("../controllers/AuthenticationController")

// Import JWT
const jwt = require("./../middleware/jwt")

Router.post("/register", authenticController.register)
Router.post("/login", authenticController.login)

Router.patch("/deactive",jwt, authenticController.deactiveAccount)
Router.patch("/active",jwt, authenticController.activeAccount)

Router.patch("/close", jwt, authenticController.closeAccount)

module.exports = Router