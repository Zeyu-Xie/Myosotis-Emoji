const _files = document.getElementById("files");

_files.onchange = () => {

    // console.log(_files.files.length);

    Array.from(_files.files).forEach(file => {

        let formData = new FormData();

        formData.append('file', file);

        console.log(formData)

        fetch('https://118.195.252.2:3000/upload', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('文件上传成功');
            } else {
                console.error('文件上传失败');
            }
        }).catch(error => {
            console.error('发生错误：', error);
        });

    });
}