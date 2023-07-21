const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const utils = require("./utils");
const argon2 = require("argon2");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const redis = require("redis");
const urlparser = require("url-parse");
const requestIp = require("request-ip");

const config = require("./config");
const { port, allowedDomains, mongoURL } = config;

const { Server } = require("socket.io");

const urlDatabase = require("./models/short_urls");
const User = require("./models/user");

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error(error);
  });

const app = express();

app.use(cors({ credentials: true, origin: allowedDomains.client }));
console.debug(allowedDomains.client);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(requestIp.mw());

function deleteExpiredTokens() {
  const currentDate = new Date();
  User.find({}, (err, users) => {
    if (err) {
      console.error(err);
    } else {
      users.forEach((user) => {
        user.tokens.forEach((token) => {
          if (currentDate - token.createdAt > 30 * 24 * 60 * 60 * 1000) {
            user.tokens.pull(token);
          }
        });
        user.save();
      });
    }
  });
}

cron.schedule("0 0 * * *", deleteExpiredTokens);

function getTokenFromRequest(req) {
  return req.headers.authorization
    ? req.headers.authorization.slice(7).length > 10
      ? req.headers.authorization.slice(7)
      : null
    : null;
}

app.get("/api", async (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/api/short/create", async (req, res) => {
  let user = null;
  let token = getTokenFromRequest(req);
  if (token) {
    user = await User.findByToken(token);
  }
  if (user === null) {
    user = "Anonymous";
  } else {
    user = user.email;
  }
  let url2Short = utils.requests.getURL2Short(req);
  if (utils.validateUrls.isValidURL(url2Short) === false) {
    return res.send(utils.response.getShortenedURLData("", false));
  }
  let shortUrlPath = await utils.shortUrls.getUniqueShortPath(urlDatabase);
  await urlDatabase.create({
    full: url2Short,
    short: shortUrlPath,
    user: user,
  });
  let shortUrl = utils.shortUrls.createURL(allowedDomains.client, shortUrlPath);
  res.send(utils.response.getShortenedURLData(shortUrl));
});

app.get("/api/short", async (req, res) => {
  // res.cookie("testCookie", "I am here", {
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   domain: ".onrender.com",
  // });
  try {
    console.log(req);
    // console.log(req.query.address);
    let address = req.clientIp;
    const shortUrl = await urlDatabase.findOne({ short: req.query.key });
    if (shortUrl == null) return res.send({ urlNotExists: true });

    let url = utils.validateUrls.ensureHTTPHeader(shortUrl.full);
    console.log(shortUrl.isSafe);
    res.send(utils.response.getMappedURLData(url, shortUrl.isSafe));

    try {
      let location = await utils.location.getLocation(address);
      if (!location.error) {
        let index = shortUrl.clicks.locations.findIndex(
          (regionData) =>
            regionData.countryCode === location.countryCode &&
            regionData.regionCode === location.regionCode
        );
        if (index !== -1) {
          shortUrl.clicks.locations[index].count++;
        } else if (location.countryCode != "") {
          shortUrl.clicks.locations.push({
            countryCode: location.countryCode,
            regionCode: location.regionCode,
            count: 1,
          });
        }
      }

      shortUrl.clicks.count++;
      shortUrl.save();
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    return res.json({ url: null, serverError: true });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ userData: null, notLoggedIn: true });
    }
    let user = await User.findByToken(token);
    if (user === null) {
      return res.json({ userData: null, invalidUser: true });
    }
    return res.json({ userData: { email: user.email } });
  } catch (error) {
    console.error(error);
    return res.send({ userData: null, serverError: true });
  }
});

app.post("/api/user/delete", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ success: false, notLoggedIn: true });
    }
    let user = await User.findByToken(token);
    if (user === null) {
      return res.json({ success: false, invalidUser: true });
    }

    const { password } = req.body.params;
    let matchPassword = await argon2.verify(user.password, password);
    if (!matchPassword) {
      return res.json({ success: false, passwordNotMatch: true });
    }

    let email = user.email;
    let deletedUser = await User.deleteOne({ email: email });
    if (deletedUser.deletedCount > 0) {
      res.clearCookie("token");
      res.clearCookie("isLoggedIn");
      res.json({ success: true });
      try {
        let deletedUserUrls = await urlDatabase.deleteMany({ user: email });
        console.info(deletedUserUrls.deletedCount);
        return;
      } catch (error) {
        console.error(error);
      }
    } else {
      return res.json({ success: false, serverError: true });
    }
  } catch (error) {
    console.error(error);
    return res.send({ success: false, serverError: true });
  }
});

app.post("/api/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body.params;
    const token = getTokenFromRequest(req);
    if (!token) {
      console.log("159");
      return res.json({ success: false, notLoggedIn: true });
    }
    let user = await User.findByToken(token);
    if (user === null) {
      console.log("164");
      return res.json({ success: false, invalidUser: true });
    }
    let matchPassword = await argon2.verify(user.password, oldPassword);

    if (matchPassword) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (passwordPattern.test(newPassword)) {
        console.log("175");
        user.password = newPassword;
        await user.save();
        return res.json({ success: true });
      } else {
        console.log("181");
        return res.json({ success: false, invalidNewPassword: true });
      }
    }
    console.log("185");
    return res.json({ success: false, passwordNotMatch: true });
  } catch (error) {
    console.log("188");
    console.error(req.body);
    return res.json({ success: false, serverError: true });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body.params;
    const token = getTokenFromRequest(req);
    console.log(email, password);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const validEmail = emailPattern.test(email);
    const validPassword = passwordPattern.test(password);
    if (!validEmail || !validPassword) {
      return res.json({
        isLoggedIn: null,
        invalidEmail: !validEmail,
        invalidPassword: !validPassword,
      });
    }
    let findOne = await User.findOne({ email: email });
    if (findOne !== null) {
      return res.json({ isLoggedIn: null, userExists: true });
    }
    const user = new User({ email: email, password: password });
    await user.save();
    const tokenData = await user.generateAuthToken();
    await user.save();
    if (!tokenData.error) {
      // res.cookie("token", tokenData.token, {
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      //   domain: urlparser(allowedDomains.client).hostname.toString(),
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "strict",
      // });

      return res.send({ isLoggedIn: "true", token: tokenData.token });
    } else {
      return res.json({ isLoggedIn: null, serverError: true });
    }
  } catch (error) {
    console.log(error);
    return res.json({ isLoggedIn: null });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body.params;
    const token = getTokenFromRequest(req);

    let user = await User.findOne({ email: email });
    if (user === null) {
      return res.json({ isLoggedIn: null, userNotExists: true });
    }

    let matchPassword = await argon2.verify(user.password, password);
    if (matchPassword) {
      const tokenData = await user.generateAuthToken();
      await user.save();
      if (!tokenData.error) {
        // res.cookie("token", tokenData.token, {
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        //   domain: urlparser(allowedDomains.client).hostname.toString(),
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "strict",
        // });

        return res.send({ isLoggedIn: "true", token: tokenData.token });
      } else {
        return res.json({ isLoggedIn: null, serverError: true });
      }
    } else {
      return res.json({ isLoggedIn: null, invalidPassword: true });
    }
  } catch (error) {
    console.log(error);
    return res.json({ token: null, serverError: true });
  }
});

app.get("/api/login/verify", async (req, res) => {
  let token = getTokenFromRequest(req);
  if (!token) {
    return res.json({ loggedIn: false });
  }
  let user = await User.findByToken(token);
  if (user === null) {
    res.clearCookie("token");
    res.clearCookie("isLoggedIn");
    return res.json({ loggedIn: false });
  } else {
    return res.json({ loggedIn: true });
  }
});

app.get("/api/logout", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    const user = await User.findOneAndUpdate(
      { "tokens.token": token },
      { $pull: { tokens: { token } } },
      { new: true }
    );
    if (!user) return res.json({ success: true });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, serverError: true });
  }
});

app.get("/api/notes/edit", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ success: false, notAuthorized: true });
    }
    console.debug(req.query);
    let { shortUrl, notes } = req.query;
    shortUrl = shortUrl.split("/").pop();
    let user = await User.findByToken(token);
    if (user === null) {
      return res.json({ success: false, notAuthorized: true });
    }
    console.log(user.email, shortUrl);
    let url = await urlDatabase.findOne({
      short: shortUrl,
      user: user.email,
    });
    console.log(url);
    if (url === null) {
      return res.json({ success: false, urlNotExists: true });
    }
    url.notes = notes;
    await url.save();
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, serverError: true });
  }
});

app.get("/api/search/results", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ userNotExists: true });
    }
    const user = await User.findByToken(token);
    if (user === null) {
      return res.json({ notAuthorized: true });
    }
    let { query, field } = req.query;
    console.log(query);
    console.log(user, user.email);
    let suggestionData;
    try {
      suggestionData = await urlDatabase.aggregate([
        {
          $search: {
            autocomplete: {
              query: query,
              path: field,
            },
          },
        },
        {
          $match: {
            user: user.email,
          },
        },
        {
          $project: {
            short: 1,
            full: 1,
            notes: 1,
            createdAt: 1,
            score: { $meta: "searchScore" },
          },
        },
        {
          $sort: {
            score: -1,
            createdAt: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);
    } catch (error) {
      console.error(error);
      suggestionData = await urlDatabase.aggregate([
        {
          $match: {
            user: user.email,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: {
            field: query,
          },
        },
      ]);
    }

    console.debug(query, suggestionData);
    return res.json({
      suggestions: utils.response.formatSuggestionData(suggestionData),
    });
  } catch (error) {
    console.error(error);
    return res.json({ serverError: true });
  }
});

app.get("/api/search/suggestions", async (req, res) => {
  try {
    let token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ notAuthorized: true });
    }
    const user = await User.findByToken(token);
    if (user === null) {
      return res.json({ notAuthorized: true });
    }
    let { query, field } = req.query;
    console.log(query);
    console.log(user, user.email);
    let suggestionData;
    try {
      suggestionData = await urlDatabase.aggregate([
        {
          $search: {
            autocomplete: {
              query: query,
              path: field,
            },
          },
        },
        {
          $match: {
            user: user.email,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 3,
        },
      ]);
    } catch (error) {
      console.error(error);
      suggestionData = await urlDatabase.aggregate([
        {
          $match: {
            user: user.email,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: {
            field: query,
          },
        },
        {
          $limit: 3,
        },
      ]);
    }

    console.debug(query, suggestionData);
    const list = suggestionData.map((item) => {
      return item[field];
    });
    const uniqueList = [...new Set(list)];
    return res.json({
      suggestions: uniqueList,
    });
  } catch (error) {
    console.error(error);
    return res.json({ serverError: true });
  }
});

app.get("/api/data/short", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.json({ notLoggedIn: true });
    }
    const user = await User.findByToken(token);
    if (user === null) {
      return res.json({ userNotExists: true });
    }
    const key = req.query.short.split("/").pop();

    const shortUrl = await urlDatabase.findOne({
      short: key,
      user: user.email,
    });
    if (shortUrl == null) return res.json({ urlNotExists: true });

    const data = await shortUrl.aggregateData(key);

    res.json(data);
  } catch (error) {
    console.error(error);
    return res.json({ serverError: true });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedDomains.client,
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(`${socket.id} user just connected!`);
  socket.on("connect_error", (error) => console.error(error));
  socket.on("connect_failed", (error) => console.error(error));
  socket.on("getData", async (key) => {
    console.log("get data");
    console.log(key);
    key = key.split("/").pop();

    const shortUrl = await urlDatabase.findOne({ short: key });
    let clicks = 0;
    if (shortUrl == null) clicks = 0;
    else clicks = shortUrl.clicks;
    socket.emit("data", { clicks: clicks.count });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
