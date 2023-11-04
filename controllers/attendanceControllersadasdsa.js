
module.exports = {


    attendanceStart : async (req,res) => {
        console.log('in attendacestart');
        try {
            const id = req.user.userid
            const data = await attendanceStartDb(id)
            console.log('atten data:',data);
            res.redirect('/home')
        } catch (err) {
            res.send(err.message)
        }
    },

    attendanceEnd :  async (req,res) => {
        try {
            const id = req.body.id
            const data = await attendanceEndDb(id)
            console.log(data);
            res.send(data)
        } catch (err) {
            console.log(err);
        }
    }, 

    viewAttendanceById : async (req,res,next) => {
        try {
            const id = req.params.id
            const attendaceData = await fetchAttendance(id)

            res.status(200).json({
                status : "OK",
                message : "attendace is succesfully fetched",
                data : attendaceData
            })
        } catch (err) {
            console.log(err);
            // next(err)
        }
    }
}
