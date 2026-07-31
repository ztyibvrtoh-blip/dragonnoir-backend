const axios = require("axios");

async function testPaperAPI(version = "1.21.1") {
  try {
    // الحصول على قائمة الـ Builds للإصدار
    const buildsResponse = await axios.get(
      `https://fill.papermc.io/v3/projects/paper/versions/${version}/builds`
    );

    const builds = buildsResponse.data.builds;

    if (!builds || builds.length === 0) {
      throw new Error(`لم يتم العثور على Builds للإصدار ${version}`);
    }

    // آخر Build
    const latestBuild = builds[builds.length - 1];

    // معلومات الـ Build
    const buildResponse = await axios.get(
      `https://fill.papermc.io/v3/projects/paper/versions/${version}/builds/${latestBuild}`
    );

    const download = buildResponse.data.downloads["server:default"];

    return {
      version,
      build: latestBuild,
      download: {
        name: download.name,
        url: download.url
      }
    };
  } catch (err) {
    throw new Error(`Paper API Error: ${err.message}`);
  }
}

module.exports = {
  testPaperAPI,
};
