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
      <input :value="count" />xx{{ "111" }}1343<button @click="handle">
        ClickOn
      </button>
    </div>
  </div>
</template>

<style scoped></style>
