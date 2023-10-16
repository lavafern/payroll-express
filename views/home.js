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






/// change pass
const savePass = async (oldPassword,newPassword,newPasswordValidation) => {
    const res = await fetch('http://localhost:3001/ChangePassword', {
        method : "PUT",
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            oldPassword : oldPassword,
            newPassword : newPassword,
            newPasswordValidation : newPasswordValidation
        })
    })
    console.log('change pass data bef: ' ,res);
    const json = await res.json()
    console.log('change pass data : ',json)
}

/// click fuction of save password
(() => {
    const button = document.getElementById("save-password")
     
    button.addEventListener('click',  () => {
        const oldPasswordinput = document.getElementById("oldPasswordinput").value 
        const newPasswordinput = document.getElementById("newPasswordinput").value 
        const newPasswordinputVal = document.getElementById("newPasswordinputVal").value

        savePass(oldPasswordinput,newPasswordinput,newPasswordinputVal)

        console.log('save passs status : ',savePass);
    })

})()



