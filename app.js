require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
var session = require('express-session')
var flash = require('connect-flash');
const userRoutes = require("./routes/user.route")
const pageRoutes = require("./routes/page.route")
const attendanceRoutes = require("./routes/attendance.route")
const app = express()
const port = 3001
app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'))
app.use(cookieParser())
app.use(flash());
app.set("view engine","ejs")

app.use(userRoutes)
app.use(pageRoutes)
app.use(attendanceRoutes)

app.use((err, req, res, next) => {
    console.log(err);
    if (err.cause === 400) {
        console.log('in 400');
        return res.status(400).json({
            status: 400,
            message : err.message,
            data : null
        })
    }

    if (err.cause === 401) {
        console.log(req.url);
        return res.redirect(`${req.url}`)
    }

    return res.status(500).json({
        status: 500,
        message : err.message,
        data : null
    })
})
app.use((req,res,next) => {
    return res.status(404).json({
        status: 404,
        message : "404 not found",
        data : null
    })
})

app.listen(port, () => {
    console.log('connected to port',port)
})
