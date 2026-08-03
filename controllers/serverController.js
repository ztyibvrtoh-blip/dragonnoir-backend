const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { spawn } = require("child_process");

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

// إنشاء سيرفر وتدشينه
const createServer = async (req, res) => {
  const servers = getServers();

  // خطوة الفحص الذاتي وتطهير الحالات العالقة الناتجة عن إعادة تشغيل الحاوية
  servers.forEach(srv => {
    if ((srv.status === "online" || srv.status === "starting") && !srv.pid) {
      srv.status = "offline";
    }
  });
  
  // تعديل 1: حفظ التعديلات مباشرة بعد عملية التطهير الذاتي
  saveServers(servers);

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

  let paperInfo = null;

  try {
    // [تعليق]: Downloading Paper...
    console.log(`[Server ${serverName}]: Downloading Paper...`);
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

    // [تعليق]: Starting Java...
    console.log("Starting Java server...");

    const child = spawn(
      "java",
      [
        "-Xms1G",
        "-Xmx1G",
        "-jar",
        "paper.jar",
        "nogui"
      ],
      {
        cwd: serverPath,
        stdio: ["ignore", "pipe", "pipe"]
      }
    );

    // الحفظ المتزامن لبيانات الـ PID فور التفعيل
    newServer.pid = child.pid;
    console.log(`Java PID: ${child.pid}`);
    saveServers(servers);

    if (child.stdout) {
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (data) => {
        const output = data.toString();
        console.log(`[Server ${serverName}]: ${output}`);

        if ((output.includes("Done") || output.includes('For help, type "help"')) && newServer.status !== "online") {
          // [تعليق]: Server Online...
          newServer.status = "online";
          saveServers(servers);
          console.log(`[Server ${serverName}]: Server Online...`);
        }
      });
    }

    if (child.stderr) {
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (data) => {
        console.error(`[Server Error ${serverName}]: ${data.toString()}`);
      });
    }

    // التعامل مع خروج العملية أو إغلاق السيرفر
    child.on("exit", (code) => {
      // [تعليق]: Server Offline...
      if (code !== 0 && code !== null) {
        console.log(`Server process exited unexpectedly with non-zero exit code: ${code}`);
      } else {
        console.log(`Server process exited normally with code ${code}`);
      }
      
      newServer.status = "offline";
      newServer.pid = null;
      saveServers(servers);
      console.log(`[Server ${serverName}]: Server Offline...`);
    });

    // التعامل مع الفشل أو غياب الجافا في نظام التشغيل
    child.on("error", (err) => {
      if (err.code === "ENOENT") {
        console.error("Error: Java is not installed or not found in PATH. Please verify your system environment variables.");
      } else {
        console.error(`Failed to start server process: ${err.message}`);
      }
      
      newServer.status = "offline";
      newServer.pid = null;
      saveServers(servers);
      console.log(`[Server ${serverName}]: Server Offline...`);
    });

  } catch (err) {
    console.error("Paper Error:", err.stack);
    newServer.status = "offline";
    newServer.pid = null;
    saveServers(servers);
    console.log(`[Server ${serverName}]: Server Offline...`);
  }

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

