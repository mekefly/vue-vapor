const { exec } = require("shelljs");
let c = "tsc -p scripts/tsconfig.json";
exec(c);
console.log(`run: ${c}`);
c = `node dist/scripts/build/main.js ${process.argv.splice(2).join(" ")}`;
console.log(`run: ${c}`);
exec(c);
