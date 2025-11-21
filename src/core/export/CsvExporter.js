class CsvExporter {
    /**
     * testCases: [{ index, values: {param: value,...} }, ...]
     * @returns string (CSV)
     */
    export(testCases) {
        if (!testCases || testCases.length === 0) return "";

        const paramNames = Object.keys(testCases[0].values);
        const headers = ["#"].concat(paramNames);
        const lines = [headers.join(",")];

        for (const row of testCases) {
            const cols = [row.index];

            for (const name of paramNames) {
                const v = row.values[name] ?? "";
                cols.push(this.escape(String(v)));
            }
            lines.push(cols.join(","));
        }

        return lines.join("\n");
    }

    
    escape(value) {
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
        }

        return value;
    }
}

module.exports = CsvExporter;