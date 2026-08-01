const express = require("express");
const router = express.Router();

const {
  getApiInfo,
  getServers,
  createServer,
  getServerFolders,
} = require("../controllers/serverController");

const {
  startServer,
  stopServer,
} = require("../controllers/serverProcessController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// السيرفرات
router.get("/servers", getServers);
router.get("/servers/folders", getServerFolders);
router.post("/servers", createServer);

// تشغيل وإيقاف السيرفر
router.post("/servers/start", startServer);
router.post("/servers/stop", stopServer);

module.exports = router;
