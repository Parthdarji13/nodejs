const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Hello from home!");
});

app.get('/about', (req, res) => {
    res.send("Hello from about!");
});


const server = http.createServer(app);

server.listen(8000, () => {
    console.log("Server started on port 8000");
});

