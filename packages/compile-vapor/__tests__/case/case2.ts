import { effect } from "@vue/reactivity";

import { ref } from "@vue/reactivity";

export default function (){
  
const count = ref(0);
count.value++;
console.log(count.value);


  
  var node = {$0: document.createTextNode("\n  "),$1: document.createElement("div"),$2: document.createTextNode("\n")};
  node.$0.append(node.$0,node.$1,node.$2);
  effect(()=>{effect(()=>{});});
}