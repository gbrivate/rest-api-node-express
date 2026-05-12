const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.set('strictQuery', true);

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('MongoDB connection error:', err.message);
});

async function start() {
  await mongoose.connect(config.mongoUrl, { serverSelectionTimeoutMS: 5000 });

  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Running on port ${config.port}`);
  });

  return server;
}

// Only start the server when executed directly (not when required by tests).
if (require.main === module) {
  start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(`Failed to start server (mongo: ${config.mongoUrl}):`, err.message);
    process.exitCode = 1;
  });
}

module.exports = { start };

