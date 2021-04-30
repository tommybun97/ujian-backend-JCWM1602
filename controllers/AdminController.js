const validator = require("validator")
const mysql = require("mysql")

const jwt = require("jsonwebtoken")

// Connection
const db = require("./../connection/connection")


const addFilm = (req,res) => {
try {
    const data = {
        name: req.body.name,
        genre: req.body.genre,
        release_date: req.body.release_date,
        release_month: req.body.release_month,
        release_year: req.body.release_year,
        duration_min: req.body.duration_min,
        description: req.body.description,
    }
    const dataToken = req.dataToken

    console.log(data)
    console.log(dataToken)

    if(!data.name || !data.genre || !data.release_date || !data.release_month || !data.release_year || !data.duration_min || !data.description) throw {message: "All Data must be filled!"}

    db.query('SELECT * FROM users WHERE uid = ?', dataToken.uid, (err, result) => {
        
        if(result[0].role == "admin"){

            try {
                db.query('INSERT INTO movies SET ?', data, (err,result2) => {
                    try {
                        if (err) throw err
                    
                        res.status(200).send({
                            error: false,
                            message: "insert product success"
                        })
                    } catch (error) {
                
                        res.status(500).send({
                            error: true,
                            message: error.message
                        })
                    }
                })
    
            } catch (error) {
                res.status(500).send({
                    error: true,
                    message: error.message
                })
            }
        }else{
            res.status(500).send({
                error: true,
                message: "Access Denied"
            })
        }
    })
} catch (error) {
    res.status(500).send({
        error: true,
        message: error.message
    })
}

}

const editFilm = (req,res) => {
    try {
        const data = {
            status: req.body.status
        }
        const dataToken = req.dataToken
    
        console.log(data)
        console.log(dataToken)
    
        if(!data.status ) throw {message: "All Data must be filled!"}
    
        db.query('SELECT * FROM users WHERE uid = ?', dataToken.uid, (err, result) => {
            console.log(result)
            if(result[0].role === "admin"){
    
                db.query('UPDATE movies SET status = ?', data, (err, result) => {
                    try {
                        if(err) throw err
                        
                    db.query(`select * from movies WHERE uid = ?`, dataToken.uid, (err,result) => {
                        try {
                            console.log(result)
                            res.status(200).send({
                                error: false,
                                message: "Edit Film Success",
                                data: {
                                    id: result[0].uid,
                                    status: `status has been changed`
                                }
                            
                            })
                            
                        } catch (error) {
                            res.status(500).send({
                                error:true,
                                message: error.message
                            })
                        }
                    })
                        
                    } catch (error) {
                        console.log(error)
                    }
                })
            }else{
                res.status(500).send({
                    error: true,
                    message: "Access Denied"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
    
}

const setFilm = () => {
    try {
        const data = {
            location_id: req.body.location_id,
            time_id: req.body.time_id
        }
        const dataToken = req.dataToken
    
        console.log(data)
        console.log(dataToken)
    
        if(!data.status ) throw {message: "All Data must be filled!"}
    
        db.query('SELECT * FROM users WHERE uid = ?', dataToken.uid, (err, result) => {
            console.log(result)
            if(result[0].role === "admin"){
    
                db.query('UPDATE movies SET status = ?', data, (err, result) => {
                    try {
                        if(err) throw err
                        
                    db.query(`select * from movies WHERE uid = ?`, dataToken.uid, (err,result) => {
                        try {
                            console.log(result)
                            res.status(200).send({
                                error: false,
                                message: "set Film Success",
                                data: {
                                    id: result[0].uid,
                                    status: `Scheduled has been added`
                                }
                            
                            })
                            
                        } catch (error) {
                            res.status(500).send({
                                error:true,
                                message: error.message
                            })
                        }
                    })
                        
                    } catch (error) {
                        console.log(error)
                    }
                })
            }else{
                res.status(500).send({
                    error: true,
                    message: "Access Denied"
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message
        })
    }
}

module.exports = { 
    addFilm : addFilm,
    editFilm: editFilm,
    setFilm: setFilm
}