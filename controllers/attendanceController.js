const {attendNow,fetchAttendanceByIdToday,attendaceEndService} = require("../services/attendanceService")

module.exports = {
    attendanceNow : async (req,res,next) => {
        try {
            const id = req.user.userId
            const checkAttendace = await fetchAttendanceByIdToday(id)
            if (checkAttendace.length > 0) throw new Error("anda sudah absen")
            const newAttendace = await attendNow(id)

            return res
            .status(201)
            .json({
                status : 201,
                message : "absen masuk berhasil!",
                data : newAttendace
            })
        } catch (err) {
            next(err)
        }
    },
    findAttendanceById : async (req,res,next) => {
        try {
            const id = req.user.userId
            const attendace = await fetchAttendanceByIdToday(id)

            return res
            .status(200)
            .json({
                status : 200,
                message : "attendace fetched",
                data : attendace.length > 0 ? attendace : null
            })
        } catch (err) {
            next(err)
        }
    },
    findAttendanceByIdToday : async (req,res,next) => {
        try {
            const id = req.user.userId
            const attendace = await fetchAttendanceByIdToday(id)

            return res
            .status(200)
            .json({
                status : 200,
                message : "attendace fetched",
                data : attendace.length > 0 ? attendace : null
            })
        } catch (err) {
            next(err)
        }
    },

    attendaceEnd : async (req,res,next) => {
        try {
            const id = req.user.userId
            const checkAttendace = await fetchAttendanceByIdToday(id)
            if (checkAttendace.length < 1) throw new Error("anda belum absen")
            const result = await attendaceEndService(id)
            return res
            .status(201)
            .json({
                status : 201,
                message : "absen pulang berhasil!",
                data : result
            })
        } catch (err) {
            next(err)
        }
    }
}