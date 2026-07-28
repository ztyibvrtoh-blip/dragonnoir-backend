const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "DRAGONNOIR API",
    version: "1.0.0",
    status: "online"
  });
});

module.exports = router;
