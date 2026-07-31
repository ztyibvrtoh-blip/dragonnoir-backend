const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { testPaperAPI } = require("./paperDownloader");

const dataFile = path.join(__dirname, "../data/servers.json");
const serversFolder = path.join(__dirname, "../servers");

// قراءة السيرفرات
const loadServers = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
  }

  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
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

// عرض المجلدات
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

  fs.writeFileSync(path.join(serverPath, "eula.txt"), "eula=true");

  fs.writeFileSync(
    path.join(serverPath, "server.properties"),
`motd=${serverName}
online-mode=${!cracked}
max-players=20
enable-command-block=true`
  );

  let paperInfo = null;

  try {
    paperInfo = await testPaperAPI(version || "26.2");

    console.log("Paper API:");
    console.log(JSON.stringify(paperInfo, null, 2));

    // تحميل paper.jar
    const jarPath = path.join(serverPath, "paper.jar");

    const response = await axios({
      method: "GET",
      url: paperInfo.download.url,
      responseType: "stream"
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(jarPath);

      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("paper.jar downloaded successfully!");

  } catch (err) {
    console.log("PaperMC API Error:", err.message);
  }

  const newServer = {
    id: servers.length + 1,
    name: serverName,
    version: version || "26.2",
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
