const {Client} = require('pg')

const client = new Client(
    {
        host : 'localhost',
        user : 'postgres',
        password : 'postgres123',
        port : 5432,
        database : 'payroll'
    }
)

client.connect()

const fetch = () => {
    return new Promise((resolve, reject) => {
        client.query(`select * from users inner join users_login on users.userid = users_login.userid`, (err,res) => {
            if (err) {
                reject(new Error(' fetch failed'))
            } else {
                resolve(res.rows)
            }
        })
    })
}

const fetchByEmail= (email) => {
    return new Promise((resolve, reject) => {
        client.query(`select * from users inner join users_login on users.userid = users_login.userid where users_login.email = $1`,[email], (err,res) => {
            if (err) {
                reject(new Error(' fetch failed'))
            } else {
                resolve(res.rows)
            }
        })
    })
}

const register = (email,name,phone_number,role,job_title,password) => {

    values = [email,name,phone_number,role,job_title,password]
    const sqlQuery = `
    with 
    s1 as(
        insert into users_login(email,password)
        values($1,$6)
        
        returning userid
    )
    
    insert into users(userid,name,phone_number,role,job_title)
    select userid,$2,$3,$4,$5 from s1
    returning *`


    return new Promise((resolve, reject) => {
        client.query(sqlQuery,values,(err,res) => {
            if (err) {
                reject(err)
            } else{
                resolve(res.rows)
            }
        })
    })
}

const changePassword = (email,newPassowrd) => {
    const sqlQuery = `
        UPDATE users_login
        SET password = $1
        WHERE email = $2;
    `
    const values = [newPassowrd,email]
    return new Promise((resolve, reject) => {
        client.query(sqlQuery,values, (err,res) => {
            if (err) {
                reject(err)
            } else {
                resolve('password change succesful!')
            }
        })
    })
}


module.exports = {fetch,fetchByEmail,register,changePassword}

