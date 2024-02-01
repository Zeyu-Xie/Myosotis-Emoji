const express = require("express");
const multer = require("multer")
const config = require("./config.json")

// Express Server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./data");
    },
    filename: (req, file, cb) => {
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

app.post("/upload", upload.single("photo"),(req, res) => {

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