
module.exports = {
    payroll : async (req,res) => {
        try {
            const id = req.body.id
            const month = req.body.month
            const year = req.body.year
    
            const data = await newPayrollDb(id,month,year)
            res.send(data)
        } catch (err) {
            console.log(err);
            res.send(err.message)
        }
    
    }
}
