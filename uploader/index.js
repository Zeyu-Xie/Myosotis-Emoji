const _form = document.getElementById("form")
const _files = document.getElementById("files");
const _reset = document.getElementById("reset")
const _date = document.getElementById("date")
const _part_of_log = document.getElementById("part_of_log")
const _full_log = document.getElementById("full_log")

// Clipboard
function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

// Load Log
let log_text = "";
let log_json = "";
fetch("http://118.195.252.2:3000/log").then(res => res.json()).then(res => {
    log_json = res;
    for (let i = res.list.length - 1; i >= 0; i--) {
        item = res.list[i];
        log_text += "**" + item + "**" + "\n\n";
        log_text += res[item];
    }
}).catch(err => {
    console.error(err)
})

// Copy Log
_part_of_log.onclick = () => {
    const date = _date.value;
    if(date) {
        copyToClipboard(log_json[date+".txt"])
    }
    else {
        window.alert("No Date Selected");
    }
}
_full_log.onclick = () => {
    copyToClipboard(log);
}

// Submit Form
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
            } else {
                console.error('Failed');
            }
        }).catch(error => {
            console.error('ERROR: ' + error);
        });
    });
}

// Reset Form
_reset.onclick = () => {
    _files.files = null
}