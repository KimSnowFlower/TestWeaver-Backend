const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty())
        return next();

    const first = errors.array()[0];

    return res.status(400).json({
        success: false,
        message: `${first.param}: ${first.msg}`,
    });
}

module.exports = validateRequest;