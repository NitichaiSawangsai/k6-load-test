const fs = require("fs");
const path = require("path");

const users = JSON.parse(fs.readFileSync(path.join(__dirname, "user.json"), "utf-8"));
console.log('USERS="' + JSON.stringify(users).replace(/"/g, '\\"') + '"');
