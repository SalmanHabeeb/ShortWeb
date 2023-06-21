// Import axios and config
const axios = require("axios");
const config = require("../config");

// Function to get the location object of a user based on their IP address
async function getLocation(address) {
  try {
    // Call the ipstack API with the IP address and the access key
    let response = await axios.get(
      `http://www.geoplugin.net/json.gp?ip=${address}`
    );
    // Return the location object from the response data
    return {
      countryCode: response.data.geoplugin_countryCode,
      regionCode: response.data.geoplugin_regionCode,
    };
  } catch (error) {
    // Handle any errors
    console.error(error);
    return { error: true };
  }
}

module.exports = {
  getLocation,
};
