const asyncHandler = require("../utils/asyncHandler");
const service = require("../services/testcase.service");

const generate = asyncHandler(async (req, res) => {
    const data = await service.generate(req.body);
    res.status(201).json({
        success: true,
        data,
    });
});

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