import { effect,unref } from "@vue/reactivity";
import { ref } from "@vue/reactivity";
import Index from "./index.vue";

const sa = (e, key, value)=>e.setAttribute(key, value);
const ae = (e, key, value)=>e.addEventListener(key, value);
const ce = document.createElement.bind(document);
const ct = document.createTextNode.bind(document);

const cc = (Component, parentEl) => {
  const instance = {
    Component,
    props: {},
    el:[],
    parentEl,
    emit(type,value){
      this.props[`@${type}`]?.(value)
    }
  };
  Component(instance.props, instance);
  return instance;
};
export default function (props,__context){
  const count = ref(0);
  console.log(Index);
  
  function handle() {
    count.value++;
    console.log(count.value);
  }
  (function(){
    const $ = __context.el;
    $[0] = __context.parentEl;
    $[1] = ct("\n  ");
    $[2] = ce("div");
    $[3] = ct("\n");
    $[4] = ct("\n    ");
    $[5] = ce("div");
    $[6] = ct("\n  ");
    $[7] = ct("\n      ");
    $[8] = cc(Index,$[5]);
    $[9] = ct("\n      ");
    $[10] = ce("input");
    $[11] = ct("xx");
    $[12] = ct('');
    $[13] = ct("\n      ");
    $[14] = ce("button");
    $[15] = ct("\n    ");
    $[16] = ct("Add");
    
    $[0].append($[1],$[2],$[3]);
    $[2].append($[4],$[5],$[6]);
    $[5].append($[7],$[8],$[9],$[10],$[11],$[12],$[13],$[14],$[15]);
    $[14].append($[16]);
    
    effect(()=>{
      $[8].props['value'] = unref(count);
      $[8].props['@click'] = handle;
    });
    effect(()=>{
      sa($[10],"value",String(unref(count)));
    });
    effect(()=>{
      $[12].nodeValue = String(unref( count ))
    });
    effect(()=>{
      ae($[14],"click",handle);
    });
  })()
}