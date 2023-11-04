
const getFlash = async () => {
    try {
        const fetching = await fetch('http://localhost:3001/showFlash')
        const result = await fetching.json()
        return result
    } catch (err) {
        console.log(err);
    }
}

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
    } catch (err) {
        
    }
})();