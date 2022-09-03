import { unref,effect } from "@vue/reactivity";
import { ref } from "@vue/reactivity"

const sa = (e, key, value)=>e.setAttribute(key, value)
const ae = (e, key, value)=>e.addEventListener(key, value)
const ce = document.createElement.bind(document)

const ct = document.createTextNode.bind(document)
export default function (props,context){
    const count = ref(0);
  function handle() { 
  count.value++;
  console.log(count.value);
  };
  

    
    var node = {$0:context.parentEl,$1: ct("\n  "),$2: ce("div"),$3: ct("\n"),$4: ct("\n    "),$5: ce("div"),$6: ct("\n  "),$7: ct("\n      "),$8: ce("input"),$9: ct("xx"),$10: ct(''),$11: ct("\n      "),$12: ce("button"),$13: ct("\n    "),$14: ct("Add")};
    node.$0.append(node.$1,node.$2,node.$3);
  
  node.$2.append(node.$4,node.$5,node.$6);
  
  
  node.$5.append(node.$7,node.$8,node.$9,node.$10,node.$11,node.$12,node.$13);
  
  
  
  
  
  
  node.$12.append(node.$14);
    effect(()=>{effect(()=>{sa(node.$8,"value",String(unref(count)));});effect(()=>{node.$10.nodeValue = String(unref( count ))});effect(()=>{ae(node.$12,"click",handle);});});
}