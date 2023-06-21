const config = require("../config");
const urlparser = require("url-parse");
const axios = require("axios");
const mongoose = require("mongoose");
const utils = require("../utils");

const shortURLSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    count: {
      type: Number,
      default: 0,
    },
    locations: {
      type: Array,
      of: {
        countryCode: String,
        regionCode: String,
        count: Number,
      },
      default: [],
    },
    timeStamps: {
      type: Array,
    },
  },
  user: {
    type: String,
    required: true,
    default: "Anonymous",
  },
  notes: {
    type: String,
    default: "",
  },
  isSafe: {
    type: Number,
    default: -2,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

function isMaliciousUrl(urlData) {
  let maliciousCount =
    urlData.data.data.attributes.last_analysis_stats.malicious;
  return maliciousCount > 0;
}

shortURLSchema.pre("save", async function () {
  if (this.isSafe === -2) {
    let url = utils.validateUrls.ensureHTTPHeader(this.full);
    let encodedUrl = btoa(urlparser(url).hostname.toString()).replace(
      /=+$/,
      ""
    );
    try {
      console.log(urlparser(url));
      let data = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${encodedUrl}`,
        {
          headers: {
            "x-apikey": config.virustotalApiKey,
          },
        }
      );
      console.log(data.data.data.attributes.last_analysis_stats);
      this.isSafe = isMaliciousUrl(data) ? 0 : 1;
    } catch (error) {
      console.error(error);
      this.isSafe = -1;
    }
  }
});

shortURLSchema.pre("save", function (next) {
  if (this.isModified("clicks.count")) {
    this.clicks.timeStamps.push(Date.now());
  }
  next();
});

module.exports = mongoose.model("urlDatabase", shortURLSchema);
