const axios = require("axios");

async function testPaperAPI(version) {
  const query = `
    query GetVersionBuild {
      project(key: "paper") {
        key
        versions(filterBy: { keys: ["${version}"] }) {
          edges {
            node {
              key
              builds(
                filterBy: {
                  channels: [STABLE]
                }
                first: 1
                orderBy: { direction: DESC }
              ) {
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
