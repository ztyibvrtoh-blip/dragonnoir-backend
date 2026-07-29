const express = require("express");

const app = express();

// قراءة بيانات JSON القادمة من الموقع
app.use(express.json());

const PORT = process.env.PORT || 3000;

// استيراد المسارات
const routes = require("./routes");

// استخدام المسارات
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`DRAGONNOIR Backend started on port ${PORT}`);
});
