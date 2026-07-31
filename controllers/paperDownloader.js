const axios = require("axios");

async function testPaperAPI(version = "26.2") {
  try {
    // الحصول على آخر Build
    const buildsResponse = await axios.get(
      `https://fill.papermc.io/v3/projects/paper/versions/${version}/builds/latest`
    );

    const build = buildsResponse.data;

    return {
      version,
      build: build.id,
      download: {
        name: build.downloads["server:default"].name,
        url: build.downloads["server:default"].url
      }
    };

  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Paper API Error");
  }
}

module.exports = {
  testPaperAPI,
};
