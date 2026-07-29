const express = require("express");
const router = express.Router();

const {
  getApiInfo,
  getServers,
  createServer,
} = require("../controllers/serverController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// عرض جميع السيرفرات
router.get("/servers", getServers);

// إنشاء سيرفر جديد
router.post("/servers", createServer);

module.exports = router;
