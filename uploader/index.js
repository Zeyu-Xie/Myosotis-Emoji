const _form = document.getElementById("form")
const _files = document.getElementById("files");
const _reset = document.getElementById("reset")

_form.onsubmit = () => {

    Array.from(_files.files).forEach(file => {

        let formData = new FormData();

        formData.append('file', file);

        fetch('http://118.195.252.2:3000/upload', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('Successful');
                // window.alert("Successful")
            } else {
                console.error('Failed');
                // window.alert("Failed")
            }
        }).catch(error => {
            console.error('ERROR: ' + error);
            // window.alert("ERROR: "+error)
        });

    });

    // window.alert("Finished")

}

_reset.onclick = () => {
    _files.files = null
}