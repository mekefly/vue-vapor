import { readFileSync } from "fs";
import { resolve } from "path";

export function readPackageJson(packagePath: string): PackageJson {
  return readJson(resolve(packagePath, "./package.json"));
}
export function readJson(path: string): any {
  try {
    console.log(path);

    return JSON.parse(readFileSync(path, "utf-8"));
  } catch (error) {
    return {};
  }
}

export type PackageJson = {
  name?: string;
  shortName?: string;
  buildOptions?: BuildOptions;
};
export type BuildOptions = { disableBuild: boolean };
