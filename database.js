const fs = require("fs");
const path = require("path");

const DB_FOLDER = path.join(__dirname, "data");
const DB_FILE = path.join(DB_FOLDER, "servers.json");

function initDatabase() {
  if (!fs.existsSync(DB_FOLDER)) {
    fs.mkdirSync(DB_FOLDER, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
  }
}

function getServers() {
  initDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveServers(servers) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(servers, null, 2));
}

module.exports = {
  initDatabase,
  getServers,
  saveServers
};
