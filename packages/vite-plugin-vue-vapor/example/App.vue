<script lang="ts" setup vapor>
import { ref } from "@vue/reactivity";

const count = ref(0);

function handle() {
  count.value++;
  console.log(count.value);
  console.log("34343");
}
const log = console.log;
</script>

<template>
  <div>
    <div>
      <input :value="count" />xx{{ count }}
      <button @click="handle">Add</button>
      <div @click="">
        {{
          (() => {
            return "343434";
          })()
        }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
