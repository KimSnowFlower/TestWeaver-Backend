const config = require("./config/env");
const app = require("./app");

app.listen(config.port, () => {
    console.log(`TestWeaver API running on port ${config.port}`);
});