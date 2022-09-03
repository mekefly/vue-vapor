<script lang="ts" setup vapor>
import { ref } from "@vue/reactivity";

const count = ref(0);

function handle() {
  count.value++;
  console.log(count.value);
}
</script>

<template>
  <div>
    <div>
      <input :value="count" />xx{{ count }}
      <button @click="handle">Add</button>
    </div>
  </div>
</template>

<style scoped></style>
