const { faker } = require('@faker-js/faker');
const asyncHandler = require("../utils/asyncHandler");
const service = require("../services/testcase.service");

/**
 * @swagger
 * /api/v1/testcases/generate:
 * post:
 * summary: Generate test case set
 * tags: [TestCases]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/TestCaseGenerateReq' 
 * responses:
 * 201:
 * description: Test cases generated successfully
 */
const generate = asyncHandler(async (req, res) => {
    // 요청 데이터 구조 분해 할당
    let { projectId, name, strategy, coverage, parameters } = req.body;

    // [추가 2] 파라미터가 없거나 비어있으면 랜덤 데이터 생성 (Faker Logic)
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
                // Faker를 사용해 매번 다른 이메일 3개 생성
                values: [faker.internet.email(), faker.internet.email(), faker.internet.email()]
            },
            {
                name: "TestCountry",
                // Faker를 사용해 매번 다른 국가 2개 생성
                values: [faker.location.country(), faker.location.country()]
            }
        ];

        // 이름도 없으면 자동으로 지어주기
        if (!name) {
            name = `Auto-Generated Test (${new Date().toLocaleTimeString()})`;
        }
    }

    // 변경된 parameters를 포함하여 서비스 호출
    const requestData = { projectId, name, strategy, coverage, parameters };
    const data = await service.generate(requestData);

    res.status(201).json({
        success: true,
        data,
        // (선택사항) 사용자가 어떤 랜덤값으로 생성되었는지 알 수 있게 generatedParameters를 응답에 포함
        generatedParameters: parameters
    });
});

/**
 * @swagger
 * /api/v1/testcases/{id}:
 * get:
 * summary: Get testcase set by ID
 * tags: [TestCases]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: number
 * responses:
 * 200:
 * description: Test case set loaded successfully
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
 * 파일 export (CSV / Excel)
 * GET /api/v1/testcases/:id/export?type=csv|excel|xlsx
 */
/**
 * @swagger
 * /api/v1/testcases/{id}/export:
 * get:
 * summary: Export test case set as CSV or Excel
 * tags: [TestCases]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: number
 * - in: query
 * name: type
 * required: false
 * schema:
 * type: string
 * enum: [csv, excel, xlsx]
 * responses:
 * 200:
 * description: File exported successfully
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