function isValidURL(url2Check) {
  const pattern =
    /^([a-zA-Z]+:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  return pattern.test(url2Check);
}

function hasHTTPHeader(url2Check) {
  const headerPattern = new RegExp("^([a-zA-Z]+:\\/\\/)");
  return headerPattern.test(url2Check);
}

function addHTTPHeader(url) {
  url = "https://" + url;
  return url;
}

function ensureHTTPHeader(url) {
  return hasHTTPHeader(url) ? url : addHTTPHeader(url);
}

module.exports = {
  isValidURL,
  ensureHTTPHeader,
};
