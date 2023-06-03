// utils.js -- for server.js

function isValidURL(url2Check) {
    const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' + // protocol(Optional)
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
      );
    return pattern.test(url2Check);
}

function generateRandomString() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let seed = new Date().getTime();
    seed = parseInt(`${seed}`);
    seed = Math.floor(seed/Math.pow(10, 6));
    seed = seed % Math.pow(10, 6);
    seed = seed / Math.pow(10, 6);
    // seed = seed/Math.pow();
    let randomString = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor((Math.random()+seed)/2 * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

module.exports = {
    isValidURL,
    generateRandomString,
}