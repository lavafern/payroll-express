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
    changePassword : async (req,res,next) => {
        try{
            const id = req.user.userid
            const oldPassword = req.body.oldPassword
            const newPassword = req.body.newPassword
            const newPasswordValidation = req.body.newPasswordValidation
            

            if (newPassword!==newPasswordValidation) throw new Error('password gagal diganti, password baru dan validasi password baru harus sama')
            
            const data = await fetchDb()
            const foundUser =  data.find(user => user.userid === id)
            const realPassword = foundUser.password
            const compare = await bcrypt.compare(oldPassword,realPassword)
            if (!compare) throw new Error('password gagal diganti, password salah')
    
            const salt = bcrypt.genSaltSync(10)
            const newPasswordEncrypted = bcrypt.hashSync(newPassword, salt)
            await changePasswordDb(id,newPasswordEncrypted)
            req.flash('success', 'Password berhasil diganti!')
            res.redirect('/home')

        } catch (err) {
            req.flash('error', err.message)
            res.redirect('/home')
        }
        
    },
    editData : (req,res,next) => {
        try {
            const newEmail = req.body.email
            const newName = req.body.name
            const newPhoneNumber = req.body.number


        } catch (err) {
            
        }
    },
    loginPage : (req,res) => {
        try {
            const urlPath = '../views/login.ejs'
            if (req.cookies['accesToken']) return res.redirect('/home')
            const result = {
                status : 'success',
                message : 'OK',
                data : {
                    flash : req.flash('error')
                }
            }

            return res.render(urlPath,{ result : result})
        } catch (err) {
            console.log(err);
        }
        
        
    
    },
    login : async (req,res) => {
        const email  = req.body.temail
        const password = req.body.tpassword
    
        try {
            const data = await fetchByEmailDb(email)
            const foundUser = data[0]
            
            if (!foundUser) throw new Error('email atau password salah')
    
            const realPassword = foundUser.password
            const compare = await bcrypt.compare(password,realPassword)
            if (!compare) throw new Error('email atau password salah')
    
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
            req.flash('error',err.message)
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
        let attendaceToday = await fetchAttendance(req.user.userid)
        const todayDate =  new Date().getDate()
        attendaceToday = attendaceToday.find(x => x.date ===`${todayDate}`)

        const result = {
            status : 'success',
            message : 'OK',
            data : {
                user : req.user,
                attendaceToday : attendaceToday,
                flash: {
                    success : req.flash("success"),
                    error : req.flash("error")
                }
            }
        }   
        console.log(result.data.flash);
        res
        .status(200)
        .render(urlPath,{result : result})
    }


}