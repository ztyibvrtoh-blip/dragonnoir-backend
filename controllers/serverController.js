const getApiInfo = (req, res) => {
  res.json({
    name: "DRAGONNOIR API",
    version: "1.0.0",
    status: "online",
    message: "Welcome to DRAGONNOIR Backend!"
  });
};

const getServers = (req, res) => {
  res.json([
    {
      id: 1,
      name: "My Survival Server",
      version: "1.21.1",
      status: "offline",
      players: 0
    }
  ]);
};

module.exports = {
  getApiInfo,
  getServers,
};
