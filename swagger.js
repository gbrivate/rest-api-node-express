const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Book API',
    version: '1.0.0'
  }
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./routes/*.js']
});

module.exports = { swaggerSpec };

