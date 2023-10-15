require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const {register,changePassword,loginPage,login,logout,home} = require('./handlers/accountHandlers')
const {attendanceStart,attendanceEnd} = require('./handlers/attendanceHandler')
const {payroll} = require('./handlers/payrollHandler')
const { authMiddleware } = require('./helper/authMiddleware.js')

const app = express()
const port = 3001
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'))
app.use(cookieParser())
app.set("view engine","ejs")


app.post('/register', register)
app.put('/ChangePassword',authMiddleware, changePassword)
app.get('/login', loginPage)
app.post('/login', login)
app.get('/home',authMiddleware,home)
app.post('/logout', logout)


app.post('/attendanceStart',authMiddleware, attendanceStart)
app.put('/attendanceEnd', attendanceEnd)


app.post('/GeneratePayroll', payroll)

app.listen(port, () => {
    console.log('connected to port',port)
})
