const express = require("express");
const router = express.Router();

const { getServers } = require("../controllers/serverController");

router.get("/", getServers);

module.exports = router;
