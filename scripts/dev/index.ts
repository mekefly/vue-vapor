const { exec, sed, uniq } = require("shelljs");
const { accessSync } = require("fs");
const { resolve } = require("path");

build();

function build() {
  let c = `pnpm build --watch --prod false --format iife ${process.argv
    .splice(2)
    .join(" ")}`;
  console.log(`run: ${c}`);

  let s = 5;
  let index = 0;

  const i1 = setInterval(() => {
    console.log(`The build will start in ${s - index} seconds......`);
    index++;
    if (index >= 5) {
      exec(c, { async: true });
      clearInterval(i1);
    }
  }, 1000);

  exec(`npx vite`, { async: true });
}
