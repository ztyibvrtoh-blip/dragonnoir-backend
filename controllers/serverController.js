const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { testPaperAPI } = require("./paperDownloader");

const dataFile = path.join(__dirname, "../data/servers.json");
const serversFolder = path.join(__dirname, "../servers");

// قراءة السيرفرات من الملف
const loadServers = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }

  const data = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(data);
};

// حفظ السيرفرات
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

// عرض السيرفرات
const getServers = (req, res) => {
  res.json(loadServers());
};

// عرض مجلدات السيرفرات
const getServerFolders = (req, res) => {
  if (!fs.existsSync(serversFolder)) {
    return res.json([]);
  }

  res.json(fs.readdirSync(serversFolder));
};

// إنشاء سيرفر
const createServer = async (req, res) => {
  const servers = loadServers();

  const { name, version, type, cracked } = req.body;

  const serverName = name || `Server ${servers.length + 1}`;

  if (!fs.existsSync(serversFolder)) {
    fs.mkdirSync(serversFolder, { recursive: true });
  }

  const serverPath = path.join(serversFolder, serverName);

  if (!fs.existsSync(serverPath)) {
    fs.mkdirSync(serverPath, { recursive: true });
  }

  ["world", "plugins", "logs"].forEach(folder => {
    const folderPath = path.join(serverPath, folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  const eulaPath = path.join(serverPath, "eula.txt");
  if (!fs.existsSync(eulaPath)) {
    fs.writeFileSync(eulaPath, "eula=true");
  }

  const propertiesPath = path.join(serverPath, "server.properties");
  if (!fs.existsSync(propertiesPath)) {
    fs.writeFileSync(
      propertiesPath,
`motd=${serverName}
online-mode=${!cracked}
max-players=20
enable-command-block=true`
    );
  }

  // جلب معلومات PaperMC باستخدام الإصدار الذي يختاره المستخدم
  let paperInfo = null;

  try {
    paperInfo = await testPaperAPI(version || "1.21.1");

    console.log("Paper API:");
    console.log(JSON.stringify(paperInfo, null, 2));
  } catch (err) {
    console.log("PaperMC API Error:", err.message);
  }

  const newServer = {
    id: servers.length + 1,
    name: serverName,
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
    paper: paperInfo,
    server: newServer
  });
};

module.exports = {
  getApiInfo,
  getServers,
  getServerFolders,
  createServer,
};
