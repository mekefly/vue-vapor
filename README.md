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
