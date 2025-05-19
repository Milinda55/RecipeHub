const express = require('express');
const app = express();
require('dotenv').config();
const connectDb = require('./config/connectionDb');
const cors = require("cors");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDb();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("API is working ✅");
});


// Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start only in local
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;
