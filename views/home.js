///absen
const attendanceCheck = () => {
    result = JSON.parse(result)
    const attendace = result.data.attendaceToday
    return attendace
}



(AttendanceButtonApperance = () => {
    const attendance= attendanceCheck()
    const button = document.getElementById("absen-btn")
    if (attendance) {
        return button.innerHTML = `<input type="submit" class="btn btn-secondary btn-lg disabled"  value="Sudah absen" id="abs-b">`
    }
    button.innerHTML = ` <input type="submit" class="btn btn-primary btn-lg"  value="Absen" id="abs-b">`
})();








