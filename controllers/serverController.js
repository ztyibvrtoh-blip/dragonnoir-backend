const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data/servers.json");

// قراءة السيرفرات من الملف
const loadServers = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }

  const data = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(data);
};

// حفظ السيرفرات في الملف
const saveServers = (servers) => {
  fs.writeFileSync(dataFile, JSON.stringify(servers, null, 2));
};

// معلومات الـ API
const getApiInfo = (req, res) => {
  res.json({
    name: "DRAGONNOIR API",
    version: "1.0.0",
    status: "online",
    message: "Welcome to DRAGONNOIR Backend!"
  });
};

// عرض جميع السيرفرات
const getServers = (req, res) => {
  const servers = loadServers();
  res.json(servers);
};

// إنشاء سيرفر جديد
const createServer = (req, res) => {
  const servers = loadServers();

  const { name, version, type, cracked } = req.body;

  const newServer = {
    id: servers.length + 1,
    name: name || `Server ${servers.length + 1}`,
    version: version || "1.21.1",
    type: type || "Java",
    cracked: cracked ?? false,
    status: "offline",
    players: 0
  };

  servers.push(newServer);
  saveServers(servers);

  res.status(201).json({
    message: "Server created successfully!",
    server: newServer
  });
};

module.exports = {
  getApiInfo,
  getServers,
  createServer,
};
