const { spawn } = require("child_process");

let runningServer = null;

const startServer = async (req, res) => {
  if (runningServer) {
    return res.json({
      success: false,
      message: "Server is already running."
    });
  }

  runningServer = spawn("echo", ["Starting Minecraft Server..."]);

  runningServer.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  runningServer.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  runningServer.on("close", () => {
    runningServer = null;
    console.log("Server stopped.");
  });

  res.json({
    success: true,
    message: "Server started successfully."
  });
};

const stopServer = async (req, res) => {
  if (!runningServer) {
    return res.json({
      success: false,
      message: "No running server."
    });
  }

  runningServer.kill();

  res.json({
    success: true,
    message: "Server stopped successfully."
  });
};

module.exports = {
  startServer,
  stopServer
};
