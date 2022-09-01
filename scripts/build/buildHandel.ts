import { resolve } from "path";
import { exec } from "shelljs";

export type HandelOptions = typeof DEFAULT_HANDEL_OPTIONS;
const BUILD_CONFIG_PATH = resolve("scripts/build/buildConfig/index.js");

const clash = new Map();
export const DEFAULT_HANDEL_OPTIONS = {
  $(environment: string[], index: number) {
    console.log(`\n当前是第 ${index + 1} 条命令，准备执行`);
    const commendString =
      DEFAULT_HANDEL_OPTIONS.genBuildStringCommend(environment);

    exec(commendString);
  },
  runs(commendList: string[][]) {
    DEFAULT_HANDEL_OPTIONS.commandPreview(commendList);

    commendList.forEach(DEFAULT_HANDEL_OPTIONS.$);
  },
  genBuildStringCommend(environment: string[]) {
    let commendString = clash.get(environment);
    if (commendString) {
      return commendString;
    }

    commendString = [
      "npx",
      "rollup",
      "-c",
      BUILD_CONFIG_PATH,
      "--environment",
      environment.filter(Boolean).join(","),
    ].join(" ");
    clash.set(environment, commendString);

    return commendString;
  },
  commandPreview(commendList: string[][]) {
    commendList.forEach((commend, index) => {
      const commandString = this.genBuildStringCommend(commend);

      console.log(`\n当前是第 ${index + 1} 条命令，准备预览`);

      console.log(`\nsettings:\n${commend.join("\n").replaceAll(":", ": ")}`);
      console.log(`\ncommend:\n${commandString}\n`);
    });
  },
};
