import { effect, ref, unref } from "@vue/reactivity";

export default function (props, context) {
  const count = ref(0);
  function handle() {
    count.value++;
    console.log(count.value);
  }

  var node = {
    $0: context.parentEl,
    $1: document.createTextNode("\n  "),
    $2: document.createElement("div"),
    $3: document.createTextNode("\n"),
    $4: document.createTextNode("\n    "),
    $5: document.createElement("div"),
    $6: document.createTextNode("\n  "),
    $7: document.createTextNode("\n      "),
    $8: document.createElement("input"),
    $9: document.createTextNode("xx"),
    $10: document.createTextNode(""),
    $11: document.createTextNode("1343"),
    $12: document.createElement("button"),
    $13: document.createTextNode("\n    "),
    $14: document.createTextNode("\n        ClickOn\n      "),
  };
  node.$0.append(node.$1, node.$2, node.$3);

  node.$2.append(node.$4, node.$5, node.$6);

  node.$5.append(
    node.$7,
    node.$8,
    node.$9,
    node.$10,
    node.$11,
    node.$12,
    node.$13
  );

  node.$12.append(node.$14);
  effect(() => {
    effect(() => {
      node.$8.setAttribute("value", unref(count));
    });
    effect(() => {
      node.$10.nodeValue = ' "111" ';
    });
    effect(() => {
      node.$12.addEventListener("click", handle);
    });
  });
}
