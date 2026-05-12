const express = require('express');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const app = express();

// Ensure models are registered once when the app is loaded (tests rely on this).
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);
const { swaggerSpec } = require('./swagger');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (config.enableSwagger) {
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome tomy API =D!');
});

// Centralized error handler (keeps route handlers simpler).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'internal_server_error' });
});

module.exports = app;
