const CsvExporter = require("./CsvExporter");
const ExcelExporter = require("./ExcelExporter");

function createExporter(type) {
    const t = (type || "csv").toLowerCase();

    switch (t) {
        case "xlsx":
        case "excel":
            return new ExcelExporter();
        case "csv":
        default:
            return new CsvExporter();
    }
}

module.exports = { createExporter, };