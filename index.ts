export function hello() {
  console.log("hello");
  if (__DEV__) {
    //这里面的内容在prod包中不存在(被删除)
    console.log("hello_dev");
  }
}
