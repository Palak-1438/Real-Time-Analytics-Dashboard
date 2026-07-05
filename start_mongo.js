const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(uri);
  // keep process alive
  setInterval(() => {}, 1000);
})();
