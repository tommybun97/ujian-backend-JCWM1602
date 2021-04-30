const express = require("express")
const Router = express.Router()

// Import Controller
const moviesController = require("./../controllers/MoviesController")
const adminController = require("./../controllers/AdminController")

// Import JWT
const jwt = require("./../middleware/jwt")

Router.get("/all", moviesController.movie )

// Admin

Router.post("/add", jwt, adminController.addFilm)
Router.patch("/edit", jwt, adminController.editFilm)

module.exports = Router