#!/usr/bin/env node
import { cac } from "cac";
import { readFileSync } from "fs";
import { build } from "./build";
import { DEFAULT_BUILD_OPTIONS } from "./buildOptions";
const packageJsonString = readFileSync("package.json", "utf-8");
const packageJson = JSON.parse(packageJsonString);

const cli = cac();
cli.version(packageJson.version);

const map: any = {};
const set = new Set();
for (const key in DEFAULT_BUILD_OPTIONS) {
  const value = (DEFAULT_BUILD_OPTIONS as any)[key];

  let help = "";
  if (Array.isArray(value)) {
    help = `可以用,号分隔写多个 例子：${value.join(",")}`;
  } else {
    help = String(value);
  }
  const short = key.slice(0, 1).toLocaleUpperCase();
  if (set.has(short)) {
    cli.option(`--${key} <${key}>`, help);
    continue;
  }
  set.add(short);

  cli.option(`-${short}, --${key} <${key}>`, help);
}

cli.usage("可以输入参数设置");
cli.help();

const parsed = cli.parse();

if (!parsed.options["help"]) {
  build(parsed.options);
}
