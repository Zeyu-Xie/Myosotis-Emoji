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
        console.log(file)
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
});
const upload = multer({ storage: storage });

console.log("Tmp Saver Start");
console.log("Port: "+config.port);

app.get("/test", (req, res) => {

    console.log("Test Successful");

    res.send("Test Successful");
})

app.post("/upload", upload.single("file"),(req, res) => {

    console.log("Received")

    console.log(res.body)

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