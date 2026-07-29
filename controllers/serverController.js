// قائمة مؤقتة للسيرفرات
let servers = [
  {
    id: 1,
    name: "My Survival Server",
    version: "1.21.1",
    status: "offline",
    players: 0
  }
];

// معلومات الـ API
const getApiInfo = (req, res) => {
  res.json({
    name: "DRAGONNOIR API",
    version: "1.0.0",
    status: "online",
    message: "Welcome to DRAGONNOIR Backend!"
  });
};

// عرض جميع السيرفرات
const getServers = (req, res) => {
  res.json(servers);
};

// إنشاء سيرفر جديد
const createServer = (req, res) => {
  const { name, version, type, cracked } = req.body;

  const newServer = {
    id: servers.length + 1,
    name: name || `Server ${servers.length + 1}`,
    version: version || "1.21.1",
    type: type || "Java",
   cracked: cracked ?? false,
    status: "offline",
    players: 0
  };

  servers.push(newServer);

  res.status(201).json({
    message: "Server created successfully!",
    server: newServer
  });
};
module.exports = {
  getApiInfo,
  getServers,
  createServer,
};
