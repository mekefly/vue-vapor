import { DEFAULT_HANDEL_OPTIONS, HandelOptions } from "./buildHandel";
import { BuildOptions } from "./buildOptions";
import { createCommendList } from "./createCommendList";
import { PackageJson, readPackageJson } from "./json";
import { CliOptions } from "./types";

import { createOptions } from "./buildOptions";

export const splitter = ",";

export function build(cliOptions: CliOptions) {
  const configOptions = createOptions(cliOptions);

  buildPackages(configOptions);
}

export async function buildPackages(
  configOptions: BuildOptions,
  handelOptions: HandelOptions = DEFAULT_HANDEL_OPTIONS
) {
  for (const packagePath of configOptions.packages) {
    buildPackage(handelOptions, packagePath, configOptions);
  }
}

function buildPackage(
  handelOptions: HandelOptions,
  packagePath: string,
  configOptions: BuildOptions
) {
  //读取json文件
  const packageJson = readPackageJson(packagePath);
  //检查是否在packageJSON中是否强制禁止build
  if (disableBuild(packageJson)) {
    return;
  }

  //创建命令列表
  const commendList = createCommendList(
    configOptions,
    packageJson,
    packagePath
  );

  //执行rollup命令

  handelOptions.runs(commendList);
}

function disableBuild(packageJson: PackageJson) {
  return packageJson?.buildOptions?.disableBuild;
}
