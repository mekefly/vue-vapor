import { effect, ref, unref } from "@vue/reactivity";

export default function (props, context) {
  const count = ref(0);
  count.value++;
  console.log(count.value);
  console.log(count.value);
  console.log(count.value);
  console.log(count.value);
  console.log(count.value);
  console.log(count.value);

  var node = {
    $0: context.parentEl,
    $1: document.createTextNode("\n  "),
    $2: document.createElement("div"),
    $3: document.createTextNode("\n"),
    $4: document.createTextNode("\n    "),
    $5: document.createElement("div"),
    $6: document.createTextNode("\n  "),
    $7: document.createElement("input"),
  };
  node.$0.append(node.$1, node.$2, node.$3);

  node.$2.append(node.$4, node.$5, node.$6);

  node.$5.append(node.$7);
  effect(() => {
    effect(() => {
      node.$7.setAttribute(":value", unref(count));
    });
  });
}
