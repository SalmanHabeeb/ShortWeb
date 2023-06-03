const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const utils = require("./utils");

const config = require("./config");
const { port, allowedDomains } = config;
const urlDatabase = require("./models/short_urls");

mongoose.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () =>  {console.log("Connection successful");}
).catch((error) => {console.error(error)});

const app = express();

app.use(cors({credentials: true, origin: allowedDomains}));
app.use(helmet());
app.use(compression());

app.get('/api/getShortenedURL', async (req, res) => {
    console.log(req['query']['url']);
    let randomString = utils.generateRandomString();
    let contains = await urlDatabase.findOne({ short: randomString });
    while(contains) {
        randomString = utils.generateRandomString();
        contains = await urlDatabase.findOne({ short: randomString });
    }
    await urlDatabase.create({ full: req.query.url, short: randomString});
    res.send({shortUrl: allowedDomains[0]+"/"+randomString});
})

app.get('/api/getMappedURL', async (req, res) => {
    console.log(req.query.key);
    const shortUrl = await urlDatabase.findOne({ short: req.query.key });
    console.log(shortUrl);
    if (shortUrl == null) return res.send({url: "", clicks: 0,});
  
    shortUrl.clicks++;
    shortUrl.save();
  
    res.send({url: shortUrl.full, clicks: shortUrl.clicks})
})

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})