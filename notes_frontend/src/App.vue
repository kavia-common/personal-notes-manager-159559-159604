<script setup lang="ts">
</script>

<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  color: var(--color-text);
}
</style>
