const express = require('express')
const dotenv =  require('dotenv')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const { authMiddleware,generateToken } = require('./authMiddleware.js')
const {fetch,fetchByEmail,register,changePassword,attendaceStart} = require('./model/dbService.js')

dotenv.config()
const app = express()
const port = 3001
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static(__dirname + '/views'))
app.use(cookieParser())
app.set("view engine","ejs")
app.engine('html', ejs.renderFile)


app.post('/register', async (req,res) => {
    const salt = bcrypt.genSaltSync(10)

    const email = req.body.email
    const name = req.body.name 
    const phone_number = req.body.number
    const role = req.body.role
    const job_title = req.body.job
    const password = bcrypt.hashSync('123456', salt) // default password


    const data = await register(email,name,phone_number,role,job_title,password)

    res.send(data)
})

app.put('/ChangePassword', async (req,res) => {
    try{
        const email = req.body.email
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword

        const data = await fetch()
        const foundUser =  data.find(user => user.email === email)
        const realPassword = foundUser.password

        const compare = await bcrypt.compare(oldPassword,realPassword)
        if (!compare) throw new Error('wrong password')

        const salt = bcrypt.genSaltSync(10)
        const newPasswordEncrypted = bcrypt.hashSync(newPassword, salt)

        const response = await changePassword(email,newPasswordEncrypted)
        res.send(response)
    } catch (err) {
        res.send(err.message)
    }
    
})

app.get('/login', (req,res) => {
    console.log('login route')
    const urlPath = '../views/login.ejs'
    if (req.cookies['accesToken']) {
        res.redirect('/home')
    } else {
        res.render(urlPath)
    }
    

})

app.post('/login', async (req,res) => {
    const email  = req.body.email
    const password = req.body.password
    console.log('tolol')

    try {
        console.log('dongo')
        const data = await fetchByEmail(email)
        console.log('idiot')
        const foundUser = data[0]
        
        if (!foundUser) throw new Error('user not found')

        const realPassword = foundUser.password
        const compare = await bcrypt.compare(password,realPassword)
        if (!compare) throw new Error('wrong password!')

        const user = {
            userid : foundUser.userid,
            name : foundUser.name,
            email : foundUser.email,
            role : foundUser.role
        } 
        const accesToken = generateToken(user,'acces')
        const refreshToken = generateToken(user,'refresh')

        res.cookie("accesToken",accesToken, {httpOnly : true})
        res.cookie("refreshToken",refreshToken, {httpOnly : true})
        res.redirect('/home')
    }catch (err){ 
        console.log(err.message)
        res.redirect('/login')
    }
})

app.get('/home',authMiddleware,(req,res) => {
    const urlPath = '../views/home.ejs'
    console.log(req.user)
    res.render(urlPath,{user : req.user.name})
})

app.post('/logout', (req,res) => {
    res.clearCookie("accesToken")
    res.clearCookie("refreshToken")
    res.redirect('/login')
}) 

app.post('/attendanceStart', async (req,res) => {
    try {
    const id = req.body.id
    const data = await attendaceStart(id)
    res.send(data)
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log('connected to port',port)
})
