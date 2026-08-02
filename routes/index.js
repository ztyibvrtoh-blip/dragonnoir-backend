const express = require("express");
const router = express.Router();

const {
  getApiInfo,
  getServers,
  getServerFolders,
  getServerFiles,
  createServer,
} = require("../controllers/serverController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// عرض جميع السيرفرات
router.get("/servers", getServers);

// عرض مجلدات السيرفرات
router.get("/servers/folders", getServerFolders);

// عرض ملفات سيرفر معين
router.get("/servers/:name/files", getServerFiles);

// إنشاء سيرفر جديد
router.post("/servers", createServer);

module.exports = router;
