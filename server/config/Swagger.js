import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pluton API Documentation",
      version: "1.0.0",
      description: "REST API docs for the Pluton Assessment project",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./routes/*.js", "./docs/*.js"], // 👈 include docs folder
};

const swaggerSpec = swaggerJSDoc(options);

const SetupSwaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default SetupSwaggerDocs;
