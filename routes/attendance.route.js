const route = require('express').Router()
const {authMiddleware} = require("../helper/authMiddleware")
const {attendanceNow,findAttendanceByIdToday,findAttendanceById,attendaceEnd} = require("../controllers/attendanceController")

route.post("/attendNow",authMiddleware,attendanceNow)
route.get("/attendanceToday",authMiddleware,findAttendanceByIdToday)
route.post("/attendEnd",authMiddleware,attendaceEnd)
route.get("/attendanceAll",authMiddleware,findAttendanceById)
module.exports = route