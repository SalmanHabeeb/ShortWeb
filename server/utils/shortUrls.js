function getSeed() {
    let time = new Date().getTime();
    seed = parseInt(`${time}`);
    seed = seed % Math.pow(10, 6);
    seed = seed / Math.pow(10, 6);
    return seed;
}

function generateRandomNo() {
    let seed = getSeed();
    return Math.random();   // Since GM/AM <= 1
}

function generateRandomString() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
        let rand = generateRandomNo();
        const randomIndex = Math.floor(rand * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

function createURL(domain, path2Append) {
    let url = new URL(path2Append, domain).href;
    return url;
}

async function getUniqueShortPath(url, urlDatabase) {
    let shortPath = generateRandomString();
    let contains = await urlDatabase.findOne({ short: shortPath });
    while(contains) {
        shortPath = generateRandomString();
        contains = await urlDatabase.findOne({ short: shortPath });
    }
    await urlDatabase.create({ full: url, short: shortPath });
    return shortPath;
}

async function getShortURL(url, allowedDomain, urlDatabase) {
    let shortPath = await getUniqueShortPath(url, urlDatabase);
    return createURL(allowedDomain, shortPath);
}

module.exports = {
    getShortURL,
}