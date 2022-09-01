import { resolve } from "path";
import pc from "picocolors";
import { exec } from "shelljs";
import { Commend } from "./types";

export type HandelOptions = typeof DEFAULT_HANDEL_OPTIONS;
const BUILD_CONFIG_PATH = resolve("scripts/build/buildConfig/index.js");

const clash = new Map();
export const DEFAULT_HANDEL_OPTIONS = {
  $(environment: Commend, index: number, CommendList: Commend[]) {
    console.log(
      pc.bgBlue(
        pc.white(
          `\n当前是第 ${index + 1} 条共 ${CommendList.length} 条，准备执行`
        )
      )
    );
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

      console.log(
        pc.bgGreen(
          pc.white(
            `\n当前是第 ${index + 1} 条共 ${commendList.length} 条，准备预览`
          )
        )
      );

      console.log(
        pc.green(
          `\n${pc.bold(pc.red("settings:"))}\n${commend
            .map((option) => {
              const fragments = option.split(":");
              return `${pc.bold(pc.red(`${fragments[0]}:`))} ${fragments
                .slice(1)
                .join(":")}`;
            })
            .join("\n")}`
        )
      );
      console.log(
        pc.blue(`\n${pc.bold(pc.red("commend:"))}\n${commandString}\n`)
      );
    });
  },
};
