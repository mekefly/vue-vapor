import { DEFAULT_HANDEL_OPTIONS, HandelOptions } from "./buildHandel";
import { BuildOptions, mixinAndFilterBuildOptions } from "./buildOptions";
import { createCommendList } from "./createCommendList";
import { PackageJson, readPackageJson } from "./json";
import { CliOptions, Commend } from "./types";

import { createOptions } from "./buildOptions";

export const splitter = ",";

export async function build(cliOptions: CliOptions) {
  const configOptions = createOptions(cliOptions);

  await buildPackages(configOptions);
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
  const { watch, disableConcurrent } = configOptions;

  if (watch) {
    handelOptions.addCommend("--watch");
    handelOptions.queue.MAX_CONCURRENCY = Infinity;
  }

  //执行rollup命令
  await handelOptions.runs(allCommendList, disableConcurrent);
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
