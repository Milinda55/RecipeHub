const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require('./config/connectionDb');
const cors = require("cors")
const path = require("path")

const PORT = process.env.PORT || 3000;
connectDb();
app.use(express.json());
app.use(cors());
app.use(express.static("public"))

app.use("/", require("./routes/user"))
app.use("/recipe", require('./routes/recipe'));

app.listen(PORT, (err) => {
    console.log(`Server started on port: ${PORT}`);
})

// deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "../frontend/food-blog-app/dist")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "food-blog-app", "dist", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is runningggggg..");
    });
}