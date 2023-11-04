const route = require('express').Router()
const {userRegister,findAll,findUserById,login} = require("../controllers/userController.js")
route.post("/register",userRegister)
route.get("/users",findAll)
route.get("/user/:id",findUserById)
route.post("/login",login)
module.exports = route