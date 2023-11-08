///absen
const attendanceCheck = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/attendanceToday')
        const f = await fetching.json()
        return f
    } catch (err) {
        
    }
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

const getFlash = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/showFlash')
        const result = await fetching.json()
        console.log('result ====',result);
        return result
    } catch (err) {
        console.log(err);
    }
}

const startAttendance = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/attendNow', {
            method: 'POST'
        })
        const result = await fetching.json()
        console.log('attendnow : ',result);
        AttendanceButtonApperance()
        return result
    } catch (err) {
        console.log(err.message);
    }
}

const endAttendance = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/attendEnd', {
            method: 'POST'
        })
        const result = await fetching.json()
        console.log('attendnow : ',result);
        AttendanceButtonApperance()
        return result
    } catch (err) {
        console.log(err.message);
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
    } catch (err) {
        console.log(err);
    }
})();





(AttendanceButtonApperance = async () => {
    const attendance = await attendanceCheck()

    const button = document.getElementById("absen-div")
    

    if (attendance.data) {
        
        if (attendance.data[0].overtime) return button.innerHTML = `
            <button type="button" class="btn btn-secondary btn-lg" disabled>pulang</button>
            `

        return button.innerHTML = `
               <button type="button" class="btn btn-secondary btn-lg" onclick="endAttendance()">Pulang</button>
         `
    }
    return button.innerHTML = `
    <button type="button" class="btn btn-primary btn-lg"onclick="startAttendance()">Masuk</button>
     `
})();



(showFlashMessage = async () => {
    try {
        const flashMessage = await getFlash()
        const flashElemet = document.getElementById("flashElement")
        console.log('flash : ',flashMessage.data.error);
        if (flashMessage.data.error) {
            flashElemet.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" id="flashElement">
                <strong>${flashMessage.data.error}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
        }
        if (flashMessage.data.success) {
            flashElemet.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert" id="flashElement">
                <strong>${flashMessage.data.success}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
        }
    } catch (err) {
        
    }
})();







