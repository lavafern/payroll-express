const route = require('express').Router()
const {authMiddleware} = require("../helper/authMiddleware")
const {homePage,loginPage,showFlash,getUserData} = require("../controllers/pageControllers")
route.get("/",authMiddleware,homePage)
route.get("/home",authMiddleware,homePage)
route.get("/login",loginPage)
route.get("/showFlash",showFlash)
route.get("/userData",authMiddleware,getUserData)


  

module.exports = route