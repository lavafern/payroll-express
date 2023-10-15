const {Client} = require('pg')

const client = new Client(
    {
        host : process.env.DBHOST,
        user : process.env.DBUSER,
        password : process.env.DBPASSWORD,
        port : process.env.DBPORT,
        database : process.env.DBDATABASE
    }
)
client.connect()



module.exports = {
    fetchDb : () => {
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from users 
            inner join users_login on users.userid = users_login.userid`
            client.query(sqlQuery, (err,res) => {
                if (err) {
                    reject(new Error(' fetch failed'))
                } else {
                    resolve(res.rows)
                }
            })
        })},

    fetchByEmailDb : (email) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from users inner join users_login on users.userid = users_login.userid where users_login.email = $1`
            client.query(sqlQuery,[email], (err,res) => {
                if (err) {
                    reject(new Error(' fetch failed'))
                } else {
                    resolve(res.rows)
                }
            })
        })
    },

    fetchAttendance : (id) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from attendance 
                             where employee_id = $1`
            client.query(sqlQuery,[id], (err,res) => {
                if (err) {
                    reject(new Error("error while querying"))
                } else {
                    resolve(res.rows)
                }
            })
        })

    },


    registerDb : (email,name,phone_number,role,job_title,salary,password) => {

        values = [email,name,phone_number,role,job_title,salary,password]
        const sqlQuery = `
        with 
        s1 as(
            insert into users_login(email,password)
            values($1,$7)
            
            returning userid
        )
        
        insert into users(userid,name,phone_number,role,job_title,salary)
        select userid,$2,$3,$4,$5,$6 from s1
        returning *`
    
    
        return new Promise((resolve, reject) => {
            client.query(sqlQuery,values,(err,res) => {
                if (err) {
                    reject(err)
                } else{
                    resolve(res.rows)
                }
            })
        })
    },

    changePasswordDb : (email,newPassowrd) => {
        const sqlQuery = `
            UPDATE users_login
            SET password = $1
            WHERE email = $2;
        `
        const values = [newPassowrd,email]
        return new Promise((resolve, reject) => {
            client.query(sqlQuery,values, (err,res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('password change succesful!')
                }
            })
        })
    },

    attendanceStartDb : (id) => {
        const sqlQuery = `
        INSERT INTO attendance(
            employee_id,
            start_time,
            status,
            date,
            month,
            year,
            attendace_id
        ) values (
            $1,
            now() :: timestamp without time zone,
            case when now() ::time > '08:00:00' ::time then 'late'
            else 'present' end,
            extract( day from now()),
            extract( month from now()),
            extract( year from now()),
            concat($2 :: numeric,extract( day from now()),extract( month from now()), extract( year from now()))
        ) returning *
    
        `
        const values = [id,id]
    
        return new Promise((resolve, reject) => {
            client.query(sqlQuery,values,(err,res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.rows)
                }
            })
        })
    },

    attendanceEndDb : (id) => {
        const sqlQuery = `
        UPDATE attendance 
        SET end_time =   now() ::timestamp without time zone ,
            total_hours_worked = age(now()  ::timestamp without time zone,start_time),
            overtime = case when now() ::time <= '17:00:00' ::time then '00:00:00' ::interval 
                        else (now() ::time - '17:00:00'::time)::interval end
        WHERE employee_id = $1
            AND date   = extract( day from now())
            AND  month =  extract( month from now())
            AND year =  extract( year from now())
    
    
        returning *
        `
        const values = [id]
    
        return new Promise((resolve, reject) => {
            client.query(sqlQuery,values,(err,res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.rows)
                }
            })
        })
    },

    newPayrollDb :(id,month,year) => {
        const sqlQuery = `
        WITH 
        present_t AS ( SELECT COUNT(*) AS present FROM attendance WHERE status = 'present' AND month=$5 AND year =$6 AND employee_id =$14),
        late_t AS ( SELECT COUNT(*) AS late FROM attendance WHERE status = 'late' AND month=$7 AND year =$8 AND employee_id =$15),
        permit_t AS ( SELECT COUNT(*) AS permit FROM attendance WHERE status = 'permit' AND month=$9 AND year =$10 AND employee_id =$16),
        alpha_t AS ( SELECT COUNT(*) AS alpha FROM attendance WHERE status = 'apha' AND month=$11 AND year =$12 AND employee_id =$17 )
    
        INSERT INTO payroll(
            employee_id,
            bonus,
            net_pay,
            printed_date,
            month,
            year,
            payroll_id,
            present,
            late,
            permit,
            alpha,
            salary_cuts
        )
        SELECT
            $1,
            EXTRACT(hour FROM SUM(attendance.overtime))*(users.salary/26/8),
            users.salary+EXTRACT(hour FROM SUM(attendance.overtime))*(users.salary/26/8)-(30000*(SELECT late FROM late_t))-(100000*(SELECT alpha FROM alpha_t)),
            now(),
            EXTRACT(month FROM now()),
            EXTRACT(year FROM now()),
            CONCAT('pr',$2 ::varchar,$3::varchar, $4::varchar),
            (SELECT present FROM present_t),
            (SELECT late FROM late_t),
            (SELECT permit FROM permit_t),
            (SELECT alpha FROM alpha_t),
            30000*(SELECT late FROM late_t)+200000*(SELECT alpha FROM alpha_t)
    
            
    
        FROM attendance
        INNER JOIN users 
        ON attendance.employee_id = users.userid 
        WHERE attendance.employee_id = $13 
        GROUP BY users.userid 
        
        RETURNING *
        `
    
        const values = [id,id,month,year,
                         month,year,
                         month,year,
                         month,year,
                         month,year,
                        id,id,id,id,id]
    
        return new Promise((resolve, reject) => {
            client.query(sqlQuery,values,(err,res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.rows)
                }
            })
        })
    
        
    }
    
}

