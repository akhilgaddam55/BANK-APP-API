import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BANK APP API (Akhil Gaddam)',
      description: 'API documentation for BANK API VI',
      version: '1.0.0',
    },
    servers: [
      {
        url: ' http://localhost:9000/api/v1',
        description: 'Local development server',
      },
      {
        "url": "https://bank-app-api-6to9.onrender.com/api/v1",
        "description": "Production server For API hosted on Render"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      BearerAuth: []
    }]
  },
  apis: ['./src/routes/routes.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
