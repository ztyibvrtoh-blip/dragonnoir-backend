const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { testPaperAPI } = require("./paperDownloader");
const { getServers, saveServers } = require("../database");

const serversFolder = path.join(__dirname, "../servers");

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
const getServersList = (req, res) => {
  res.json(getServers());
};

// عرض المجلدات
const getServerFolders = (req, res) => {
  if (!fs.existsSync(serversFolder)) {
    return res.json([]);
  }

  res.json(fs.readdirSync(serversFolder));
};

// عرض ملفات سيرفر
const getServerFiles = (req, res) => {
  const { name } = req.params;

  const serverPath = path.join(serversFolder, name);

  if (!fs.existsSync(serverPath)) {
    return res.status(404).json({
      success: false,
      message: "Server not found."
    });
  }

  res.json({
    success: true,
    server: name,
    files: fs.readdirSync(serverPath)
  });
};

// إنشاء سيرفر
const createServer = async (req, res) => {
  const servers = getServers();

  const { name, version, type, cracked } = req.body;

  const serverName = name || `Server ${servers.length + 1}`;

  if (!fs.existsSync(serversFolder)) {
    fs.mkdirSync(serversFolder, { recursive: true });
  }

  const serverPath = path.join(serversFolder, serverName);

  fs.mkdirSync(serverPath, { recursive: true });

  ["world", "plugins", "logs"].forEach(folder => {
    fs.mkdirSync(path.join(serverPath, folder), {
      recursive: true,
    });
  });

  fs.writeFileSync(
    path.join(serverPath, "eula.txt"),
    "eula=true"
  );

  fs.writeFileSync(
    path.join(serverPath, "server.properties"),
`motd=${serverName}
online-mode=${!cracked}
max-players=20
enable-command-block=true`
  );

  fs.writeFileSync(
    path.join(serverPath, "start.bat"),
`@echo off
java -Xms1G -Xmx1G -jar paper.jar nogui
pause`
  );

  let paperInfo = null;

  try {
    paperInfo = await testPaperAPI(version || "26.2");

    const jarPath = path.join(serverPath, "paper.jar");

    const response = await axios({
      method: "GET",
      url: paperInfo.download.url,
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(jarPath);

      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("paper.jar downloaded.");
  } catch (err) {
    console.log("Paper Error:", err.message);
  }

  const newServer = {
    id: servers.length + 1,
    name: serverName,
    version: version || "26.2",
    type: type || "Java",
    cracked: cracked ?? false,
    status: "starting",
    players: 0,
    pid: null,
    createdAt: new Date().toISOString()
  };

  servers.push(newServer);

  saveServers(servers);

  res.status(201).json({
    success: true,
    message: "Server created successfully!",
    paper: paperInfo,
    server: newServer
  });
};

module.exports = {
  getApiInfo,
  getServers: getServersList,
  getServerFolders,
  getServerFiles,
  createServer,
};
