const express = require("express");
const router = express.Router();

const { getApiInfo, getServers } = require("../controllers/serverController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// قائمة السيرفرات
router.get("/servers", getServers);

module.exports = router;
