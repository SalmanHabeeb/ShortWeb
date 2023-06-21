const urlparser = require("url-parse");
function getShortenedURLData(shortUrl, valid = true) {
  return { shortUrl: shortUrl, valid: valid };
}

function getMappedURLData(url, isSafe) {
  let encodedUrl = btoa(urlparser(url).hostname.toString()).replace(/=+$/, "");
  let virustotalScanLink = `https://www.virustotal.com/gui/url/${encodedUrl}`;
  if (isSafe === -1) {
    encodedUrl = encodeURIComponent(url);
    virustotalScanLink = `https://www.virustotal.com/gui/search/${encodedUrl}`;
  }
  return {
    url: url,
    isSafe: isSafe,
    virustotalScanLink: virustotalScanLink,
  };
}

// Define a function that takes an array of suggestionData objects as input
function formatSuggestionData(data) {
  let formattedData = [];
  for (let obj of data) {
    let newObj = {
      short: obj.short,
      full: obj.full,
      notes: obj.notes,
      createdAt: obj.createdAt,
    };
    formattedData.push(newObj);
  }
  return formattedData;
}

module.exports = {
  formatSuggestionData,
  getShortenedURLData,
  getMappedURLData,
};
