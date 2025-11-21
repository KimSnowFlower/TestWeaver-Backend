const TestCaseValidator = require("./TestCaseValidator");

/**
 * 기본 구현: 지금은 추가 규칙 없음
 * 나중에 "금지 조합" 같은 비즈니스 룰을 여기에 넣을 수 있음
 */
class DefaultTestCaseValidator extends TestCaseValidator {
  // 필요 시 validateCustom override
}

module.exports = DefaultTestCaseValidator;