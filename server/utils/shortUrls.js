function getSeed() {
  let time = new Date().getTime();
  seed = parseInt(`${time}`);
  seed = seed % Math.pow(10, 6);
  seed = seed / Math.pow(10, 6);
  return seed;
}

function generateRandomNoInRange(range) {
  let seed = getSeed();
  return Math.random() * range;
}

function generateRandomString() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    let rand = generateRandomNoInRange(characters.length);
    const randomIndex = Math.floor(rand);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function createURL(domain, path2Append) {
  let url = new URL(path2Append, domain).href;
  return url;
}

async function getUniqueShortPath(urlDatabase) {
  let shortPath = generateRandomString();
  let contains = await urlDatabase.findOne({ short: shortPath });
  while (contains) {
    shortPath = generateRandomString();
    contains = await urlDatabase.findOne({ short: shortPath });
  }
  return shortPath;
}

module.exports = {
  createURL,
  getUniqueShortPath,
};
