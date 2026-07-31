const axios = require("axios");

async function testPaperAPI() {
  const query = `
    query LatestStableBuildDownloadURL {
      project(key: "paper") {
        key
        versions(first: 1, orderBy: {direction: DESC}) {
          edges {
            node {
              key
              builds(filterBy: { channel: STABLE }, first: 1, orderBy: { direction: DESC }) {
                edges {
                  node {
                    number
                    download(key: "server:default") {
                      name
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(
    "https://fill.papermc.io/graphql",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "DRAGONNOIR/1.0"
      }
    }
  );

  return response.data;
}

module.exports = {
  testPaperAPI,
};
