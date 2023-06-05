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
const { port, allowedDomains, mongoURL} = config;
const urlDatabase = require("./models/short_urls");

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () =>  {console.log("Database connected successfully");}
).catch(
    (error) => {console.error(error)}
);

const app = express();

app.use(cors({credentials: true, origin: allowedDomains}));
app.use(helmet());
app.use(compression());

app.get('/api/getShortenedURL', async (req, res) => {
    let url2Short = utils.requests.getURL2Short(req);
    if(utils.validateUrls.isValidURL(url2Short) ===  false) {
        return res.send(utils.response.getShortenedURLData("", false));
    }
    let shortUrl = await utils.shortUrls.getShortURL(url2Short, allowedDomains[0], urlDatabase);
    res.send(utils.response.getShortenedURLData(shortUrl));
})

app.get('/api/getMappedURL', async (req, res) => {
    console.log(req.query.key);
    const shortUrl = await urlDatabase.findOne({ short: req.query.key });
    if (shortUrl == null) return res.send({url: "", clicks: 0,});
    shortUrl.clicks++;
    shortUrl.save();
    let url = utils.validateUrls.ensureHTTPHeader(shortUrl.full);
    res.send(utils.response.getMappedURLData(url, shortUrl.clicks, shortUrl.isSafe));
})

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})