const {generateToken} = require('../helper/authMiddleware.js')
const {userRegisterService,findAllService,findUserByIdService,loginAttemp,changePasswordService,updateProfileService} = require("../services/userService.js")
module.exports = {
    findAll : async (req,res,next) => {
        try {
            const allUser = await findAllService()
            console.log(allUser);

            return res
            .status(200)
            .json({
                status : 200,
                message : "all user fetched!",
                data : allUser
            })

        } catch (err) {
            next(err)
        }
    },

    findUserById : async (req,res,next) => {
        try {
            const {id} = req.params
            const foundUser = await findUserByIdService(id)

            return res
            .status(200)
            .json({
                status : 200,
                message : "user data fetched!",
                data : foundUser
            })

        } catch (err) {
           next(err) 
        }
    },


    userRegister : async (req,res,next) => {
        try {
            const newUser = await userRegisterService(req.body)
            console.log('newuser : ',newUser);
            return res
            .status(201)
            .json({
                status : 201,
                message : "user created!",
                data : newUser
            })
        } catch (err) {
            next(err)
        }
    },


    login : async (req,res,next) => {
        try {
            const {email,password} = req.body
            const foundUser = await loginAttemp(email,password)
            const user = {
                userId : foundUser.userId,
                email : foundUser.email,
            }
            const accesToken = generateToken(user,'acces')
            const refreshToken = generateToken(user,'refresh')

            return res
            .cookie("accesToken",accesToken, {httpOnly : true})
            .cookie("refreshToken",refreshToken, {httpOnly : true})
            .status(200)
            .redirect('/home')
        } catch (err) {
            req.flash('error', err.message)
            next(err)
        }
    },

    changePassword : async (req,res,next) => {

        try {
            const id = (req.user).userId
            const oldPassword = req.body.oldPassword
            const newPassword = req.body.newPassword
            const newPasswordValidation = req.body.newPasswordValidation

            const result = await changePasswordService(id,oldPassword,newPassword,newPasswordValidation)

            req.flash('success', 'password berhasil diganti!')
            return res.redirect('/home')
            
        } catch (err) {
            req.flash('error', err.message)
            return res.redirect('/home')
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
    updateProfile : (req,res) => {
        try {
            const id = (req.user).userId
            const name = req.body.nama
            const phone_number = req.body.notelp

            const result = updateProfileService(id,name,phone_number)

            req.flash('success', 'profil berhasil diganti!')
            return res.redirect('/home')
        } catch (err) {
            req.flash('error', err.message)
            return res.redirect('/home')
        }
    }


}