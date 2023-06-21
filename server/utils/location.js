const axios = require("axios");

async function getLocation(address) {
  try {
    let response = await axios.get(
      `http://www.geoplugin.net/json.gp?ip=${address}`
    );
    return {
      countryCode: response.data.geoplugin_countryCode,
      regionCode: response.data.geoplugin_regionCode,
    };
  } catch (error) {
    console.error(error);
    return { error: true };
  }
}

module.exports = {
  getLocation,
};
