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

function hasHTTPHeader(url2Check) {
  const headerPattern = new RegExp('^([a-zA-Z]+:\\/\\/)');
  return headerPattern.test(url2Check);
}

function addHTTPHeader(url) {
  url = "https://" + url;
  return url;
}

function ensureHTTPHeader(url) {
  return hasHTTPHeader(url)? url:addHTTPHeader(url);
}

module.exports = {
  isValidURL,
  ensureHTTPHeader,
}