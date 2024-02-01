const express = require("express");
const multer = require("multer")
const config = require("./config.json")
const path = require("path")

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
        console.log(file.originalname+" "+date)
        cb(null, `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}-${date.getMilliseconds().toString().padStart(3, '0')}${ext}`);
    }
});
const upload = multer({ storage: storage });

// app.get("/test", (req, res) => {

//     console.log("Test Successful");

//     res.send("Test Successful");
// })

app.post("/upload", upload.single("file"),(req, res) => {

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