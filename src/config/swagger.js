const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TestWeaver API Doc",
            version: "1.0.0",
            description: "Pairwise Test Case Generator for TestWeaver",
        },
        servers: [
            {
                url: "http://13.125.96.222:4000",
                description: "AWS EC2 server",
            },
            {
                url: "http://localhost:4000",
                description: "Local Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "access_token",
                },
            },
        },
    },
    apis: ["./src/routes/*.js", "./src/controllers/*.js, ./src/dto/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;