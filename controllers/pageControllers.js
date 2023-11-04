const {fetchAttendanceByIdToday } = require("../services/attendanceService")
const {findById} = require("../services/userService")
const path = require("path")

module.exports = {
    
    homePage : (req, res,next) => {
        try {
            res.sendFile(path.join(__dirname, '../views', 'home.html'));
        } catch (err) {
            next(err)
        }
      },

    loginPage : (req, res,next) => {
        try {
            if (req.cookies['accesToken']) return res.redirect('/home')

            res.sendFile(path.join(__dirname, '../views', 'login.html'));
        } catch (err) {
            next(err)
        }
      },

    showFlash : (req, res,next) => {
        try {
            const flash = req.flash()
            res.json({
                status : 200,
                message : "flash message",
                data : flash
            })
        } catch (err) {
            next(err)
        }
      },

    getUserData : async (req, res,next) => {
        try {
            const userId = (req.user).userId
            const userData = await  findById(userId)
            res.json({
                status : 200,
                message : "succesfully fetch user data!",
                data : userData
            })
        } catch (err) {
            next(err)
        }
      }

    
}