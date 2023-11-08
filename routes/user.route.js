const route = require('express').Router()
const {authMiddleware} = require("../helper/authMiddleware")
const {userRegister,findAll,findUserById,login,changePassword,logout,updateProfile} = require("../controllers/userController.js")
route.post("/register",userRegister)
route.get("/users",findAll)
route.get("/user/:id",findUserById)
route.post("/login",login)
route.post("/password",authMiddleware,changePassword),
route.post("/profile",authMiddleware,updateProfile)
route.get("/logout",logout)
module.exports = route