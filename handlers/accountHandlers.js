const bcrypt = require('bcrypt')
const {fetchDb,fetchAttendance,fetchByEmailDb,registerDb,changePasswordDb} = require('../model/dbService.js')
const {generateToken} = require('../helper/authMiddleware.js')

module.exports = {

    register : async (req,res) => {
        try {
            const salt = bcrypt.genSaltSync(10)
    
            const email = req.body.email
            const name = req.body.name 
            const phone_number = req.body.number
            const role = req.body.role
            const job_title = req.body.job
            const salary = req.body.salary
            const password = bcrypt.hashSync('123456', salt) // default password
            
            
            const data = await registerDb(email,name,phone_number,role,job_title,salary,password)
            
            res.send(data)
        } catch (err) {
            next(err)
        }
        
     } ,
    changePassword : async (req,res) => {
        try{
            const email = req.body.email
            const oldPassword = req.body.oldPassword
            const newPassword = req.body.newPassword
    
            const data = await fetchDb()
            const foundUser =  data.find(user => user.email === email)
            const realPassword = foundUser.password
    
            const compare = await bcrypt.compare(oldPassword,realPassword)
            if (!compare) throw new Error('wrong password')
    
            const salt = bcrypt.genSaltSync(10)
            const newPasswordEncrypted = bcrypt.hashSync(newPassword, salt)
    
            const response = await changePasswordDb(email,newPasswordEncrypted)
            res.send(response)
        } catch (err) {
            next(err)
        }
        
    },
    loginPage : (req,res) => {
        try {
            console.log('login route')
            const urlPath = '../views/login.ejs'
            if (req.cookies['accesToken']) {
                res.redirect('/home')
            } else {
                res.render(urlPath)
            }
            
        } catch (err) {
            next(err)
        }
        
        
    
    },
    login : async (req,res) => {
        const email  = req.body.temail
        const password = req.body.tpassword
    
        try {
            const data = await fetchByEmailDb(email)
            const foundUser = data[0]
            
            if (!foundUser) throw new Error('user not found')
    
            const realPassword = foundUser.password
            const compare = await bcrypt.compare(password,realPassword)
            if (!compare) throw new Error('wrong password!')
    
            const user = {
                userid : foundUser.userid,
                name : foundUser.name,
                phone_number : foundUser.phone_number,
                email : foundUser.email,
                role : foundUser.role,
                job_title : foundUser.job_title,
                salary : foundUser.salary
            } 
            const accesToken = generateToken(user,'acces')
            const refreshToken = generateToken(user,'refresh')
    
            res.cookie("accesToken",accesToken, {httpOnly : true})
            res.cookie("refreshToken",refreshToken, {httpOnly : true})
            res.redirect('/home')
        }catch (err){ 
            console.log(err.message)
            res.redirect('/login')
        }
    },
    logout : (req,res) => {
        try {
            res.clearCookie("accesToken")
            res.clearCookie("refreshToken")
            res.redirect('/login')
        } catch (err) {
            next(err)
        }
        
    },

    home : async (req,res) => {
        const urlPath = '../views/home.ejs'
        console.log(req.user)
        let attendaceToday = await fetchAttendance(req.user.userid)
        attendaceToday = attendaceToday.find(x => x.date ===`27`)
        console.log(attendaceToday);
        const result = {
            status : 'success',
            message : 'fetch data succes',
            data : {
                user : req.user,
                attendaceToday : attendaceToday
            }
        }
        console.log(result);
        res
        .status(200)
        .render(urlPath,result)
    }


}