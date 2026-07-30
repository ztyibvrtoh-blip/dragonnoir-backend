const express = require("express");
const router = express.Router();

const {
  getApiInfo,
  getServers,
  createServer,
  getServerFolders,
} = require("../controllers/serverController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// عرض جميع السيرفرات
router.get("/servers", getServers);

// عرض مجلدات السيرفرات
router.get("/servers/folders", getServerFolders);

// إنشاء سيرفر جديد
router.post("/servers", createServer);

module.exports = router;
