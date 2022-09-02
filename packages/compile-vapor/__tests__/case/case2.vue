<script lang="ts" setup vapor>
import { ref } from "@vue/reactivity";
const count = ref(0);
count.value++;
console.log(count.value);
</script>

<template>
  <div></div>
</template>

<style scoped></style>
