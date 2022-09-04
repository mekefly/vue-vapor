<script lang="ts" setup vapor>
import { ref } from "@vue/reactivity";
import Index from "./index.vue";
const count = ref(0);
console.log(Index);

function handle() {
  count.value++;
  console.log(count.value);
}
</script>

<template>
  <div>
    <div>
      <Index :value="count" @click="handle"></Index>
      <input :value="count" />xx{{ count }}
      <button @click="handle">Add</button>
    </div>
  </div>
</template>

<style scoped></style>
