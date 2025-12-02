const { faker } = require('@faker-js/faker');
const asyncHandler = require("../utils/asyncHandler");
const service = require("../services/testcase.service");

/**
 * @swagger
 * /api/v1/testcases/generate:
 *   post:
 *     summary: Generate test case set
 *     tags: [TestCases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestCaseGenerateReq'
 *     responses:
 *       201:
 *         description: Test cases generated successfully
 */
const generate = asyncHandler(async (req, res) => {
    let { projectId, name, strategy, coverage, parameters } = req.body;

    // 파라미터가 없으면 Faker로 랜덤 생성
    if (!parameters || parameters.length === 0) {
        console.log("🎲 파라미터 미입력 감지: Faker로 랜덤 테스트 데이터를 생성합니다.");

        parameters = [
            {
                name: "Browser",
                values: ["Chrome", "Firefox", "Safari", "Edge"]
            },
            {
                name: "OS",
                values: ["Windows 10", "Windows 11", "macOS", "Linux"]
            },
            {
                name: "UserType",
                values: ["Admin", "Guest", "Regular"]
            },
            {
                name: "TestEmail",
                values: [
                    faker.internet.email(),
                    faker.internet.email(),
                    faker.internet.email()
                ]
            },
            {
                name: "TestCountry",
                values: [
                    faker.location.country(),
                    faker.location.country()
                ]
            }
        ];

        if (!name) {
            name = `Auto-Generated Test (${new Date().toLocaleTimeString()})`;
        }
    }

    const requestData = { projectId, name, strategy, coverage, parameters };
    const data = await service.generate(requestData);

    res.status(201).json({
        success: true,
        data,
        generatedParameters: parameters
    });
});

/**
 * @swagger
 * /api/v1/testcases/{id}:
 *   get:
 *     summary: Get testcase set by ID
 *     tags: [TestCases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Test case set loaded successfully
 */
const getSet = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await service.getSet(id);

    res.json({
        success: true,
        data,
    });
});

/**
 * @swagger
 * /api/v1/testcases/{id}/export:
 *   get:
 *     summary: Export test case set as CSV or Excel
 *     tags: [TestCases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, excel, xlsx]
 *     responses:
 *       200:
 *         description: File exported successfully
 */
const exportFile = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const type = req.query.type || "csv";

    const { filename, mime, data } = await service.exportSet(id, type);

    res.setHeader("Content-Type", mime);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(data);
});

module.exports = {
    generate,
    getSet,
    exportFile,
};
