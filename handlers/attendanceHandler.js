const {attendanceEndDb,newPayrollDb, attendanceStartDb} = require('../model/dbService.js')

module.exports = {


    attendanceStart : async (req,res) => {
        try {
            const id = req.user.userid
            const data = await attendanceStartDb(id)
            console.log('atten data:',data);
            res.send(data)
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
    }
}
