module.exports = {
    countOvertime : (hour,minutes) => {
        if (hour > 17) {

            return{
            overtimeHours : hour - 17,
            overtimeMinutes : minutes
            }
        }

        return {
            overtimeHours : 0,
            overtimeMinutes : 0
        }
    }
}