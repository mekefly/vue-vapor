import { DEFAULT_HANDEL_OPTIONS, HandelOptions } from "./buildHandel";
import { BuildOptions } from "./buildOptions";
import { createCommendList } from "./createCommendList";
import { PackageJson, readPackageJson } from "./json";
import { CliOptions, Commend } from "./types";

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
  const allCommendList: Commend[] = [];

  for (const packagePath of configOptions.packages) {
    const commendList = createPackageCommendList(packagePath, configOptions);
    allCommendList.push(...commendList);
  }

  //执行rollup命令
  handelOptions.runs(allCommendList);
}

function createPackageCommendList(
  packagePath: string,
  configOptions: BuildOptions
) {
  //读取json文件
  const packageJson = readPackageJson(packagePath);
  //检查是否在packageJSON中是否强制禁止build
  if (disableBuild(packageJson)) {
    return [];
  }

  //创建命令列表
  const commendList = createCommendList(
    configOptions,
    packageJson,
    packagePath
  );

  return commendList;
}

function disableBuild(packageJson: PackageJson) {
  return packageJson?.buildOptions?.disableBuild;
}
