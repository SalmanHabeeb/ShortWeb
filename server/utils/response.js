function getShortenedURLData(shortUrl, valid = true) {
    return {shortUrl: shortUrl, valid: valid};
}

function getMappedURLData(url, clicks, isSafe = true) {
    return {url: url, clicks: clicks, isSafe: isSafe};
}

module.exports = {
    getShortenedURLData,
    getMappedURLData,
}