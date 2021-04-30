const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require("mysql")
const validator = require("validator")
require('dotenv').config()

// Import Router
const authenticRouter = require("./routers/AuthenticRouter")
const moviesRouter = require("./routers/MoviesRouter")
const adminRouter = require("./routers/AdminRouter")

// Connection
const db = mysql.createConnection({
    user: "root",
    password: "Bacamanga1",
    database: "backend_2021",
    port: 3306
})

// main app
const app = express()
const PORT = 2000

// apply middleware
app.use(cors())
app.use(bodyparser.json())

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1602</h1>')
app.get('/', response)

app.use('/user', authenticRouter)

app.use('/movies', moviesRouter)







// bind to local machine
// const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ` + PORT)
})
