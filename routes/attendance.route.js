const route = require('express').Router()
const {attendanceNow} = require("../controllers/attendanceController")

route.post("/attendNow",attendanceNow)

module.exports = route