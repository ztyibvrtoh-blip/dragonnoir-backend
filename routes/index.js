const express = require("express");
const router = express.Router();

const { getApiInfo } = require("../controllers/serverController");

router.get("/", getApiInfo);

module.exports = router;
