const dotenv = require("dotenv");
dotenv.config("./.env");

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const config = require("./config");

const { port, allowedDomains } = config;

const app = express();

app.use(cors({origin: allowedDomains}));
app.use(helmet());
app.use(compression);

var posts = {
    "Salman": "Hello",
    "Dawood": "Hi",
    "Michael": "John"
}

app.get('/api/posts', (req, res) => {
    console.log(req);
    return res.json(posts);
})

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})