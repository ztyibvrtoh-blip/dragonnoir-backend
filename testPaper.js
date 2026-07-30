const axios = require("axios");

async function test() {
  try {
    const response = await axios.get("https://fill.papermc.io/v3/projects/paper");

    console.log(response.data);
  } catch (err) {
    console.log("ERROR:");
    console.log(err.response?.status);
    console.log(err.response?.data || err.message);
  }
}

test();
