const validator = require("validator")
const mysql = require("mysql")

const jwt = require("jsonwebtoken")

// Connection
const db = require("./../connection/connection")

const movie = (req,res) => {
    db.query(`SELECT m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, ms.status, l.location, st.time FROM movies m JOIN
    schedules s ON s.movie_id = m.id JOIN
    movie_status ms ON m.status = ms.id JOIN
    locations l ON s.location_id = l.id JOIN
    show_times st ON s.time_id = st.id;`, (err,result) => {
        try {
            if(err) throw err

            res.status(200).send({
                error: false,
                message: result
            })
        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            })
        }
    })
}



module.exports = {
    movie: movie
}