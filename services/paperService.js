const axios = require("axios");

async function getPaperVersions() {
  try {
    const response = await axios.get(
      "https://fill.papermc.io/v3/projects/paper",
      {
        headers: {
          "User-Agent": "DRAGONNOIR/1.0"
        }
      }
    );

    return response.data;
  } catch (err) {
    console.log("Paper Error:", err.response?.status || err.message);
    return null;
  }
}

module.exports = {
  getPaperVersions
};
