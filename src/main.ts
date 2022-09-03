const editDom: any = document.querySelector(".edit");
async function init() {
  const xxx = await fetch("./case2.vue");
  editDom.value = await xxx.text();
  update();
}
init();

editDom.addEventListener("input", throttle(update));
let timelier;
function throttle(callback) {
  return () => {
    clearTimeout(timelier);
    timelier = setTimeout(callback, 1000);
  };
}

function update() {
  const appDom = (document.querySelector("#app");
  if(!appDom){
    return
  }
  appDom.innerHTML = "");

  const code = editDom.value;
  const ast = parser(code);
  const sfc = compileSFC(ast);
  const newCode = codegen(sfc);
  const extractImportValue = extractImport(newCode);
  const script = deleteExport(extractImportValue.script);
  eval(script);

  (App as any)({}, { parentEl:appDom });
}

function deleteExport(code) {
  return code.replace("export default function ", "function App");
}
