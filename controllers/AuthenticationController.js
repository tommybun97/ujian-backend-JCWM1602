const validator = require("validator")
const mysql = require("mysql")

const jwt = require("jsonwebtoken")

// Connection
const db = require("./../connection/connection")


const register = (req,res) => {
    try {
        const data = req.body
    
        if(!data.email || !data.password ||!data.username) throw {message: `All Data Must Be Filled`}
    
        if(!(validator.isEmail(data.email))) throw {message: "Email Invalid"}
    
        if(data.password.length < 6) throw {message: "Password must contain at least 6 characters"} //Belum selesai

        let uid = Date.now()
        
        db.query(`SELECT * FROM users WHERE email = ?`, data.email, (err,result) => {
            try {
                if(err) throw err
                if(result.length >= 1){
                    return res.status(200).send({
                        error: false,
                        message: `Register Failed, Email already Exist`
                    })
                }
    
                let dataToInsert = {
                    email: data.email,
                    password: data.password,
                    username: data.username,
                    uid: uid
                    
                   
                }
    
                    db.query(`INSERT INTO users SET ?`, dataToInsert , (err,result)=> {
                        try {
                            if(err) throw err
                            
                            console.log(result)
                            db.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [data.email, data.password], (err,result) => {
                                try {
                                    if(err) throw err

                                    console.log(result)
    
                                    jwt.sign({uid: result[0].uid, role: result[0].role}, "123abc", (err,token) => {
                                        try {
                                            if (err) throw err
                                            console.log(token)
                                            res.status(200).send({
                                                error: false,
                                                message: `Register Success`,
                                                data : {
                                                    id: result[0].id,
                                                    uid: result[0].uid,
                                                    username: result[0].username,
                                                    email: result[0].email,
                                                    token:token
                                                }
                                            })
                                        } catch (error) {
                                            res.status(500).send({
                                                error: true,
                                                message: `token error`
                                            })
                                        }
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
}

const login = (req,res) => { //Belum selesain, belum bisa login menggunakan email ATAU username
    try {
        const data = req.body
        console.log(data)

        // const user = {
        //     email: data.email,
        //     username: data.username
        // }

        if(!data.email || !data.password) throw {message: `All Data Must be Filled`}
        if(!(validator.isEmail(data.email))) throw {message: "Email Invalid"}

        db.query(`SELECT * FROM users WHERE email = ?  AND password = ? AND status_id = "1"`,[data.email, data.password], (err,result) => {
            try {
                if(err) throw err


                if(result.length === 1) {
                    jwt.sign({uid: result[0].uid, role: result[0].role}, "123abc", (err,token) => {
                       data.token = token

                       res.status(200).send({
                           error: false,
                           message: `Login Success`,
                           data: {
                               id: result[0].id,
                               uid: result[0].uid,
                               username: result[0].username,
                               email: result[0].email,
                               status: result[0].status,
                               role:result[0].role,
                               token: token
                           }
                       })
                    })
                }else {
                    res.status(200).send({
                        error: true,
                        message: `Account Not Found or Deactive`
                    })
                }
                
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
}

const deactiveAccount = (req,res) => {
    try {
        const dataToken = req.dataToken

        console.log(dataToken)

        db.query('SELECT * FROM users WHERE uid = ?', dataToken.uid, (err, result) => {
            try {
                if(err) throw err

                console.log(result)
                db.query('UPDATE users SET status_id = "2"  WHERE uid = ?', dataToken.uid, (err, result) => {
                    try {
                        if(err) throw err
                        
                    
                    db.query(`select * from users u JOIN
                    status s ON s.id = u.status_id WHERE uid = ?`, dataToken.uid, (err,result) => {
                        try {
                            
                            res.status(200).send({
                                error: false,
                                message: "Deactive Account Success",
                                data: {
                                    uid: result[0].uid,
                                    status: result[0].status
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
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        res.status(406).send({
            error: true,
            message: 'Error Validation',
            detail: error.message
        })
    }
}

const activeAccount = (req,res) => {
    try {
        const dataToken = req.dataToken

        
        
        db.query('SELECT * FROM users WHERE uid = ? ', dataToken.uid, (err, result) => {
            try {
                if(err) throw err
                
                if(result[0].status_id === 3 ) throw {message: `Account closed Forever`}
                db.query('UPDATE users SET status_id = "1"  WHERE uid = ?', dataToken.uid, (err, result) => {
                    try {
                        if(err) throw err
                        
                        
                    db.query(`select * from users u JOIN
                    status s ON s.id = u.status_id WHERE uid = ?`, dataToken.uid, (err,result) => {
                        try {
                            res.status(200).send({
                                error: false,
                                message: "active Account Success",
                                data: {
                                    uid: result[0].uid,
                                    status: result[0].status
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
            } catch (error) {
                res.status(500).send({
                    error: false,
                    message: `Account closed Forever`
                })
            }
        })
    } catch (error) {
        res.status(406).send({
            error: true,
            message: 'Error Validation',
            detail: error.message
        })
    }
}

const closeAccount = (req,res) => {
    try {
        const dataToken = req.dataToken

        console.log(dataToken)

        db.query('SELECT * FROM users WHERE uid = ?', dataToken.uid, (err, result) => {
            try {
                if(err) throw err

                console.log(result)
                db.query('UPDATE users SET status_id = "3"  WHERE uid = ?', dataToken.uid, (err, result) => {
                    try {
                        if(err) throw err
                        
                    
                    db.query(`select * from users u JOIN
                    status s ON s.id = u.status_id WHERE uid = ?`, dataToken.uid, (err,result) => {
                        try {
                            res.status(200).send({
                                error: false,
                                message: "Close Account Success",
                                data: {
                                    uid: result[0].uid,
                                    status: result[0].status
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
            } catch (error) {
                console.log(error)
            }
        })
    } catch (error) {
        res.status(406).send({
            error: true,
            message: 'Error Validation',
            detail: error.message
        })
    }
}

module.exports = {
    register: register,
    login:login,
    deactiveAccount: deactiveAccount,
    activeAccount: activeAccount,
    closeAccount: closeAccount
}