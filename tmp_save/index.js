const _files = document.getElementById("files");

_files.onchange = () => {

    // console.log(_files.files.length);

    Array.from(_files.files).forEach(file => {

        let formData = new FormData();

        formData.append('file', file);

        console.log(formData)

        fetch('http://118.195.252.2:3000/upload', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('Successful');
            } else {
                console.error('Failed');
            }
        }).catch(error => {
            console.error('ERROR: ' + error);
        });

    });
}