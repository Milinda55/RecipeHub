const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({message: 'Hello MERN!'});
})

app.listen(PORT, (err) => {
    console.log(`Server started on port: ${PORT}`);
})