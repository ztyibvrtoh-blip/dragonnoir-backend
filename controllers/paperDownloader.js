const axios = require("axios");

async function getLatestPaperBuild(version = "1.21.1") {
  try {
    const response = await axios.get(
      `https://fill.papermc.io/v3/projects/paper/versions/${version}/builds`,
      {
        headers: {
          "User-Agent": "DRAGONNOIR/1.0"
        }
      }
    );

    return response.data;
  } catch (err) {
    console.error("Paper Downloader Error:", err.message);
    return null;
  }
}

module.exports = {
  getLatestPaperBuild
};
