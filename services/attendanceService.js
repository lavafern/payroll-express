const prisma = require("./prisma.service")
const {findUserByIdService} = require("./userService")
const {countOvertime} = require("../helper/attendanceHelper")


module.exports = {

    fetchAttendanceId : async (id) => {
        try {
            await findUserByIdService(id) //check Id
            const attendace = await prisma.attendance.findMany({
                where : {
                    userId : id
                }
            })

            return attendace

        } catch (err) {
            throw err
        }
    },
        
    fetchAttendanceByIdToday : async (id) => {

        try {
            
            let date =  new Date().getDate()
            let month =  new Date().getMonth()+1
            const year =  new Date().getFullYear()


            await findUserByIdService(id) //check Id

            const attendace = await prisma.attendance.findMany({
                where : {
                    AND: [
                        {
                            userId : id
                        },
                        {
                            date
                        },
                        {
                            month
                        },
                        {
                            year
                        }
                    ]
                }
            })
            
            return attendace
        } catch (err) {
            throw err
        }

    },

    attendNow : async (id) => {
        try {
            const end_time = new Date()
            const hour = end_time.getHours()
            const minutes = end_time.getMinutes()
            let date = end_time.getDate()       
            let month = end_time.getMonth()+1
            const year = end_time.getFullYear()

            await findUserByIdService(id) // checkId


            const lateTresholdHour = 8
            const status = hour > lateTresholdHour ? "late" : "present"
            const newAttendance = await prisma.attendance.create({
                data : {
                    date,
                    month,
                    year,
                    start_time : {"hour" : hour,
                                  "minutes" : minutes
                                 },
                    status,
                    userId : id
                }
            })

            return newAttendance
        } catch (err) {
            console.log(err);
            throw err
        }
    },

    attendaceEndService : async (id) => {
        try {
            console.log('in anteeen servoce');
            const end_time = new Date()
            let date = end_time.getDate()       
            let month = end_time.getMonth()+1
            const year = end_time.getFullYear()
            const hour = end_time.getHours()
            const minutes = end_time.getMinutes()

            await findUserByIdService(id) // check id
            const {overtimeHours,overtimeMinutes} = countOvertime(hour,minutes)
            console.log(overtimeHours,overtimeMinutes);
            const endAttendance = await prisma.attendance.updateMany({
                where : {
                    AND: [
                        {
                            userId : id
                        },
                        {
                            date
                        },
                        {
                            month
                        },
                        {
                            year
                        }
                    ]
                },
                data : {
                    end_time : {
                        "hour" : hour,
                        "minutes" : minutes
                    },
                    overtime : {
                        "hour" : overtimeHours,
                        "minutes" : overtimeMinutes
                    },
                }
            })
            console.log('endAttendance = ',endAttendance);
            return endAttendance
        } catch (err) {
            console.log(err);
        }
    }
}