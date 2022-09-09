import App from "./App.vue";
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

cc(App, document.querySelector("#app"));
