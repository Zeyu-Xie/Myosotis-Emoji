const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require("path");
const config = require("./config.json");

// Express Server
const app = express();

// Middleware

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./data");
    },
    filename: (req, file, cb) => {

        const date = new Date();
        const ext = path.extname(file.originalname);

        let log = `${date}\n`;
        log += file.originalname + "\n"
        log += req.ip + "\n";
        log += "\n";

        const filePath = `./log/${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.txt`;

        fs.appendFile(filePath, log, err => {
            if (err) {
                console.error("ERROR: " + err);
            } else {
                console.log("Log Added Successful");
            }
        });

        cb(null, `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}-${date.getMilliseconds().toString().padStart(3, '0')}${ext}`);
    }
});
const upload = multer({ storage: storage });

app.get("/log", (req, res) => {

    const folderPath = path.join(__dirname, "log");

    let res_ = {};

    fs.promises.readdir(folderPath).then(async (files) => {
        res_ = { "list": files };
        for (const log of files) {
            try {
                const data = await fs.promises.readFile(path.join(__dirname, "log", log), 'utf-8');
                res_[log] = data;
            } catch (err) {
                console.error("ERROR: ", err);
            }
        }
    }).then(() => {
        res.json(res_)
    }).catch((err) => {
        res.status(500).send('Error reading folder');
    });
});

app.post("/upload", upload.single("file"), (req, res) => {

    const photo = req.file;

    if (!photo) {
        return res.status(400).send("File Not Received");
    }

    res.send("Success");
})

// Listen
app.listen(config.port, () => {
    console.log("Server Created")
})