# Templates

各种类型的 template 将通过分支的方式添加进来

## task

- [x] workspace build
  - [x] scripts
  - [x] rollup.config.js
  - [x] 多线程序 build
  - [x] 修改坚听 build
- [ ] compile-core
  - [ ] 框架
    - [x] parser ast
    - [x] traverser ast 遍历器
- [ ] compile-sfc
  - [ ] vapor
  - [ ] setup
  - [ ] default
- [ ] compile-vapor
  - [x] dom 解析，生成代码
  - [ ] 组件解析
  - [x] 类似与这样的{{}}模板解析与响应编译
  - [x] dom 事件注册
  - [x] 响应化的属性
- [ ] runtime-resolve
- [ ] runtime-core
- [x] dev 开发实时预览效果

## 编译预览

编译前

```vue
<script lang="ts" setup vapor>
import { ref } from "@vue/reactivity";
import Index from "./index.vue";
const count = ref(0);
console.log(Index);

function handle() {
  count.value++;
  console.log(count.value);
}
</script>

<template>
  <div>
    <div>
      <Index :value="count" @click="handle"></Index>
      <input :value="count" />xx{{ count }}
      <button @click="handle">Add</button>
    </div>
  </div>
</template>

<style scoped></style>
```

编译后

```javascript
import { effect, unref } from "@vue/reactivity";
import { ref } from "@vue/reactivity";

import Index from "./index.vue";

const sa = (e, key, value) => e.setAttribute(key, value);
const ae = (e, key, value) => e.addEventListener(key, value);
const ce = document.createElement.bind(document);
const ct = document.createTextNode.bind(document);

const cc = (Component, parentEl) => {
  const instance = {
    Component,
    props: {},
    el: [],
    parentEl,
    emit(type, value) {
      this.props[`@${type}`]?.(value);
    },
  };
  Component(instance.props, instance);
  return instance;
};
export default function (props, __context) {
  const count = ref(0);
  console.log(Index);

  function handle() {
    count.value++;
    console.log(count.value);
  }
  (function () {
    const $ = __context.el;
    $[0] = __context.parentEl;
    $[1] = ct("\n  ");
    $[2] = ce("div");
    $[3] = ct("\n");
    $[4] = ct("\n    ");
    $[5] = ce("div");
    $[6] = ct("\n  ");
    $[7] = ct("\n      ");
    $[8] = cc(Index, $[5]);
    $[9] = ct("\n      ");
    $[10] = ce("input");
    $[11] = ct("xx");
    $[12] = ct("");
    $[13] = ct("\n      ");
    $[14] = ce("button");
    $[15] = ct("\n    ");
    $[16] = ct("Add");

    $[0].append($[1], $[2], $[3]);
    $[2].append($[4], $[5], $[6]);
    $[5].append($[7], $[8], $[9], $[10], $[11], $[12], $[13], $[14], $[15]);
    $[14].append($[16]);

    effect(() => {
      $[8].props["value"] = unref(count);
      $[8].props["@click"] = handle;
    });
    effect(() => {
      sa($[10], "value", String(unref(count)));
    });
    effect(() => {
      $[12].nodeValue = String(unref(count));
    });
    effect(() => {
      ae($[14], "click", handle);
    });
  })();
}
```

## Includes

- [x] TypeScript@4.7.4
- [x] build (Rollup@2.77)
- [x] test (vitest@0.22)

## Get started

## 1. 创建文件夹

> mkdir FolderName

## 2. 进入文件夹

> cd FolderName

## 3. 下载模板

> git clone <https://github.com/mekefly/templates.git> -b typescript-rollup-vitest ./

> git branch -m main

thisPath 代表当前仓库的连接，你可以直接在上面地址栏复制

## 4. 安装依赖

> pnpm install

## 5. 删除本仓库地址

> git remote remove origin

## 6. 开始使用
