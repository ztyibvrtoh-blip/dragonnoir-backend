controllers/serverController");

// الصفحة الرئيسية
router.get("/", getApiInfo);

// عرض جميع السيرفرات
router.get("/servers", getServers);

// إنشاء سيرفر جديد
router.post("/servers", createServer);

module.exports =
