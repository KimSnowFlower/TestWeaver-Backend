const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/testcase.controller");

// 테스트 케이스 생성
router.post("/generate", ctrl.generate);

// 특정 세트 조회
router.get("/:id", ctrl.getSet);

// 특정 세트 export (CSV/Excel)
router.get("/:id/export", ctrl.exportFile);

module.exports = router;