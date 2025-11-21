const ExcelJS = require("exceljs");

class ExcelExporter {
    /**
    * testCases: [{ index, values: {param: value,...} }, ...]
    * @returns Promise<Buffer>
    */
    async export(testCases) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("TestCases");

        if (!testCases || testCases.length === 0)
            return workbook.xlsx.writeBuffer();


        const paramNames = Object.keys(testCases[0].values);
        const headerRow = ["#", ...paramNames];

        sheet.addRow(headerRow);

        for (const row of testCases) {
            const cols = [row.index];

            for (const name of paramNames) {
                cols.push(row.values[name] ?? "");
            }
            
            sheet.addRow(cols);
        }

        const buf = await workbook.xlsx.writeBuffer();

        return buf;
    }
}

module.exports = ExcelExporter;
