const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path"); // [추가] 경로를 확실하게 잡기 위해 필요

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
                url: "http://localhost:4000",
                description: "Local Development Server",
            },
            {
                url: "http://13.125.96.222:4000",
                description: "AWS EC2 server",
            },
        ],
        // JWT 인증 등을 위한 설정 (필요 없으면 비워도 됨)
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
    // [핵심 수정] 절대 경로로 파일을 찾도록 변경
    // __dirname은 현재 파일(swagger.js)이 있는 'src/config' 폴더를 의미합니다.
    // '../'를 통해 'src' 폴더로 올라간 뒤, 각 폴더를 찾습니다.
    apis: [
        path.join(__dirname, "../routes/*.js"),
        path.join(__dirname, "../controllers/*.js"),
        path.join(__dirname, "../dto/*.js")
    ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;