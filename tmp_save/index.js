const _files = document.getElementById("files");

_files.onchange = () => {

    Array.from(_files.files).forEach(file => {

        let formData = new FormData();

        formData.append('file', file);

        fetch('http://118.195.252.2:3000/upload', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('Successful');
                window.alert("Successful")
            } else {
                console.error('Failed');
                window.alert("Failed")
            }
        }).catch(error => {
            console.error('ERROR: ' + error);
            window.alert("ERROR: "+error)
        });

    });
}