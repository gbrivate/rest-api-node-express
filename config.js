function getEnv(name, fallback) {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

function getBoolEnv(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === '') return fallback;
  return v === '1' || v.toLowerCase() === 'true';
}

const nodeEnv = getEnv('NODE_ENV', 'development');
// Back-compat with older code/tests that used ENV=Test
const legacyEnv = getEnv('ENV', '').toLowerCase();
const isTest = legacyEnv === 'test' || nodeEnv === 'test';

const port = Number(getEnv('PORT', '3000'));
const defaultDbName = isTest ? 'bookAPI_Test' : 'bookAPI';
const mongoUrl = getEnv('MONGO_URL', `mongodb://localhost:27017/${defaultDbName}`);

module.exports = {
  nodeEnv,
  isTest,
  port,
  mongoUrl,
  // Feature flags / knobs
  enableSwagger: getBoolEnv('SWAGGER_ENABLED', true)
};

