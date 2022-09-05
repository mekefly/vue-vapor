const { exec } = require("shelljs");
const {
  existsSync,
  accessSync,
  readdirSync,
  writeFileSync,
  readFileSync,
} = require("fs");
const { resolve, basename, relative, join, dirname } = require("path");
const minimist = require("minimist");
const { exit } = require("process");
const pc = require("picocolors");

const { scriptsArgv, commendArgv, scriptsOptions } = getArgvOptions(
  global.process.argv
);

const exclude = [/\.json$/, "index.js"];

const ROOT_DIR = resolve();

const BASE_PATH = __dirname;
const DIST_BASE_PATH = resolve("dist", relativePath(BASE_PATH));
const possibleName = ["main.js"];

const TS_CONFIG_PATH = `./tsconfig.json`;
const TEMP_TS_CONFIG_PATH = resolve(
  BASE_PATH,
  dirname(TS_CONFIG_PATH),
  `temp.${basename(TS_CONFIG_PATH)}`
);

const rPath = scriptsArgv.join("/");
const distPath = resolve(DIST_BASE_PATH, rPath);
const path = resolve(BASE_PATH, rPath);

if (scriptsArgv.length === 0) {
  help();
  exit(-1);
}
run();

function run(params) {
  //验证要运行的scriptBuild是否存在
  if (!scriptsOptions.reBuild && existsSync(distPath)) {
    runScript(distPath);
  } else {
    if (existsSync(path)) {
      buildScript(path);
      runScript(distPath);
    } else {
      console.error("命令不存在%s", rPath);
      process.exit(-1);
    }
  }
}

function relativePath(path) {
  return relative(ROOT_DIR, path);
}

function runScript(scriptPath) {
  const sp = findScriptPath(scriptPath);
  let c = `node ${relativePath(sp)} ${commendArgv.join(" ")}`;
  console.log(`run: ${c}`);
  exec(c);
}

function findScriptPath(scriptPath) {
  for (const name of possibleName) {
    const newScriptPath = resolve(scriptPath, name);
    if (existsSync(newScriptPath)) {
      return newScriptPath;
    }
  }
  return scriptPath;
}

function buildScript(buildPath) {
  writeConfig(buildPath);

  let c = `npx tsc -p ${relativePath(TEMP_TS_CONFIG_PATH)}`;
  console.log(`buildScript: ${c}`);
  exec(c);
}
function writeConfig(buildPath) {
  const include =
    JSON.parse(readFileSync(resolve(BASE_PATH, TS_CONFIG_PATH), "utf-8"))
      ?.include ?? [];
  const jsonConfigContent = JSON.stringify({
    extends: TS_CONFIG_PATH,
    include:
      include.length === 0
        ? [relative(BASE_PATH, buildPath)]
        : include.map((include) =>
            relative(BASE_PATH, resolve(buildPath, include))
          ),
  });

  writeFileSync(TEMP_TS_CONFIG_PATH, jsonConfigContent);
}

function findTsConfig(path) {
  let p = path;
  while (p.length > __dirname.length) {
    p = resolve(p, "../");
    const tsConfigPath = resolve(p, TS_CONFIG_PATH);
    if (existsSync(tsConfigPath)) {
      return tsConfigPath;
    }
  }

  console.error(
    "'tsconfig.json' is Not Found in scripts path.\npath:%s",
    rPath
  );
  exit(-2);
}

function getArgvOptions(argv) {
  let index = argv.indexOf("$", 2);
  index = index === -1 ? argv.length : index;

  const scriptsArgv = argv.slice(2, index);
  const commendArgv = argv.slice(index + 1, argv.length);

  const scriptsOptions = minimist(scriptsArgv);
  return { scriptsArgv: scriptsOptions._, commendArgv, scriptsOptions };
}

function help() {
  console.log("你可以在$后面跟随子命令，例如：");
  console.log(
    "node scripts build $ xxx => npx tsc -p scripts/**/tsconfig.json && node scripts/build xxx"
  );

  let commends = readdirSync(BASE_PATH);
  commends = commends.filter(
    (commend) =>
      !exclude.some((ex) => {
        return typeof ex === "string" ? commend.includes(ex) : ex.test(commend);
      })
  );
  commends.forEach((commend) => console.log(` ${pc.blue(commend)}`));
  exit(0);
}
