const {attendNow} = require("../services/attendanceService")

module.exports = {
    attendanceNow : async (req,res,next) => {
        try {
            const {id} = req.body

            const newAttendace = await attendNow(id)

            res
            .status(201)
            .json({
                status : 200,
                message : "succes attending!",
                data : newAttendace
            })
        } catch (err) {
            next(err)
        }
    },
    findAttendanceById : async (req,res,next) => {
        try {
            const {id} = req.body//req.user.userid
            const attendace = await fetchAttendanceByIdToday(id)

            res
            .status(200)
            .json({
                status : 200,
                message : "attendace fetched",
                data : attendace
            })
        } catch (err) {
            next(err)
        }
    },
}