const {generateToken} = require('../helper/authMiddleware.js')
const {createUser,findAll,findById,loginAttemp} = require("../services/userService.js")
module.exports = {
    findAll : async (req,res,next) => {
        try {
            const allUser = await findAll()
            console.log(allUser);

            res
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
            const foundUser = await findById(id)

            res
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
            const newUser = await createUser(req.body)
            console.log('newuser : ',newUser);
            res
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

            res
            .cookie("accesToken",accesToken, {httpOnly : true})
            .cookie("refreshToken",refreshToken, {httpOnly : true})
            .status(200)
            .redirect('/home')
        } catch (err) {
            console.log(err);
            next(err)
        }
    }





}