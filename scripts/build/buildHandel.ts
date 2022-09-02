import os from "os";
import { resolve } from "path";
import pc from "picocolors";
import { exec } from "shelljs";
import { Commend } from "./types";

export type HandelOptions = typeof DEFAULT_HANDEL_OPTIONS;
const BUILD_CONFIG_PATH = resolve("scripts/build/buildConfig/index.js");

// 超过十线程会引发一个事件坚听警告，但运行没问题
const MAX_CONCURRENCY: number = Math.min(os.cpus().length, 10);

const clash = new Map();
export const DEFAULT_HANDEL_OPTIONS = {
  $(environment: Commend, index: number, CommendList: Commend[]) {
    runParallel(async () => {
      console.log(
        pc.bgBlue(
          pc.white(
            `\n当前是第 ${index + 1} 条共 ${CommendList.length} 条，准备执行`
          )
        )
      );
      const commendString =
        DEFAULT_HANDEL_OPTIONS.genBuildStringCommend(environment);

      await new Promise<void>((resolve, reject) => {
        exec(commendString, () => {
          resolve();
        });
      });
    });
  },
  async runs(commendList: string[][]) {
    DEFAULT_HANDEL_OPTIONS.commandPreview(commendList);

    commendList.forEach(DEFAULT_HANDEL_OPTIONS.$);

    console.log("任物已提交-------------------------------------------------");
    await allCompletePromise;
    console.log("任物已完成-------------------------------------------------");
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

const executing = new Set<Promise<any>>();

let index = 1;
let ruiningOfNumber = 1;
const queue: any = [];

let complete: any;
let allCompletePromise: any = new Promise<void>((resolve, reject) => {
  complete = resolve;
});

function runParallel(callback: () => Promise<any>) {
  //等待回调函数是否已就序
  if (!complete) {
    setTimeout(() => runParallel(callback));
    return;
  }
  queue.push(callback);
  console.log();
  console.log(`[id: ${index++}]`);
  console.log(`[并发: ${executing.size}/${MAX_CONCURRENCY}]`);
  if (executing.size >= MAX_CONCURRENCY) {
    return;
  }
  runQueue();
}

let queueId = 0;
function runQueue() {
  if (queueId >= queue.length) {
    return;
  }
  const task = queue[queueId++];

  console.log();
  console.log(`[StartRun: ${ruiningOfNumber++}]`);
  console.log(`[并发: ${executing.size + 1}/${MAX_CONCURRENCY}]`);

  const thisId = queueId;

  task().then(() => {
    console.log(`Exit queue: ${thisId}`);
    executing.delete(task);
    runQueue();

    //退出
    if (thisId === queue.length) {
      complete();
    }
  });

  executing.add(task);
}
