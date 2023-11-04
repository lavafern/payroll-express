///absen
const attendanceCheck = () => {
    result = JSON.parse(result)
    const attendace = result.data.attendaceToday
    return attendace
}


getUserInfo = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/userData')
        const f = await fetching.json()
        return f
    } catch (err) {
        console.log(err);
    }
}

(assignUserInfo = async () => {
    try {
        const {data} = await getUserInfo()
        const emailInfoButton = document.getElementById("emailInfoButton")
        const namaInfoButton = document.getElementById("namaInfoButton")
        const telpInfoButton = document.getElementById("telpInfoButton")
        const jabatanInfoButton = document.getElementById("jabatanInfoButton")

        emailInfoButton.innerText = data.userLogin.email
        namaInfoButton.innerText = data.name
        telpInfoButton.innerText = data.phone_number
        jabatanInfoButton.innerText = data.job_title
    } catch (error) {
        console.log(err);
    }
})();





(AttendanceButtonApperance = () => {
    const attendance= attendanceCheck()
    const button = document.getElementById("absen-btn")
    if (attendance) {
        return button.innerHTML = `<input type="submit" class="btn btn-secondary btn-lg disabled"  value="Sudah absen" id="abs-b">`
    }
    button.innerHTML = ` <input type="submit" class="btn btn-primary btn-lg"  value="Absen" id="abs-b">`
})();











