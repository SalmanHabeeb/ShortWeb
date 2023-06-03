// utils.js -- for redirect.js

function getPath() {
    return window.location.pathname.slice(1);
}

module.exports = {
    getPath
}