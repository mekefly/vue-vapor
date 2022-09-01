import { readdirSync } from "fs";
import { basename, resolve } from "path";
import { splitter } from "./build";
import { CliOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS = {
  inputPath: ["./src/index.ts"],
  workSpace: ["packages"],
  //过滤
  includePackages: [] as string[],
  include: [],
  packages: ["./"],
  output: "dist",
  format: ["cjs", "esm", "iife"],
  prod: ["false", "true"],
  declaration: true,
};
export type BuildOptions = typeof DEFAULT_BUILD_OPTIONS;

export function createOptions(parsedOptions: CliOptions) {
  const options = Object.assign(
    {},
    DEFAULT_BUILD_OPTIONS,
    parseCliOptions(parsedOptions, DEFAULT_BUILD_OPTIONS)
  );

  const packages = options.workSpace
    .map((workspaceName) => {
      return readdirSync(workspaceName).map((dirName) => {
        return resolve(workspaceName, dirName);
      });
    })
    .flat(Infinity) as string[];

  packages.push(...options.packages.map((dir) => resolve(dir)));

  options.packages = includeDir(packages, options.includePackages);

  return options;
}
export function includeDir(dirs: string[], filters: string[]) {
  if (filters.length === 0) {
    return dirs;
  }
  return dirs.filter((dir) => filters.includes(basename(dir)));
}

export function parseCliOptions(
  cliOptions: CliOptions,
  buildOptions: BuildOptions = DEFAULT_BUILD_OPTIONS as any
): BuildOptions {
  const options: any = {};

  Object.keys(buildOptions).forEach((key) => {
    const cliValue = cliOptions[key];

    if (cliValue === undefined) {
      return;
    }
    const buildValue = (buildOptions as any)[key];

    if (Array.isArray(buildValue)) {
      if (cliValue === ",") {
        options[key] = [];
        return;
      }
      options[key] = (cliValue as string)?.split(splitter) ?? [];
    } else if (typeof cliValue === "boolean") {
      options[key] = cliValue ? "true" : "false";
    } else {
      options[key] = cliValue;
    }
  });
  return options as any;
}
