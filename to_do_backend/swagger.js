const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do Backend API',
      version: '1.0.0',
      description: 'REST API for managing to-do tasks (create, list, update, delete, complete).',
    },
    tags: [
      { name: 'Tasks', description: 'To-do task management' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
