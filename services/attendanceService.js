const prisma = require("./prisma.service")


module.exports = {
        
    fetchAttendanceByIdToday : async (id) => {

        try {
            
            let date =  new Date().getDate()
            date = date < 10 ? Number(`0${date}`) : date
            let month =  new Date().getMonth()+1
            month = month < 10 ? Number(`0${month}`) : month
            const year =  new Date().getFullYear()

            const checkId = await prisma.user.findUnique({
                where : {
                    id
                }
            })

            if (!checkId) throw new Error("no user")

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
            const start_time = new Date()
            let date = start_time.getDate()             
            let month = start_time.getMonth()+1
            const year = start_time.getFullYear()
            date = date < 10 ? Number(`0${date}`) : date
            month = month < 10 ? Number(`0${month}`) : month


            const checkId = await prisma.user.findUnique({
                where : {
                    id
                }
            })

            if (!checkId) throw new Error("no user")

            const lateTreshold = new Date(`${year}-${month}-${date}T08:00:00`)
            const status = start_time > lateTreshold ? "late" : "present"
            const newAttendance = await prisma.attendance.create({
                data : {
                    date,
                    month,
                    year,
                    start_time,
                    status,
                    userId : id
                }
            })

            return newAttendance
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}