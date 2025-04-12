<template>
  <header>
    <MenuBar />
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script lang="ts" setup>
import MenuBar from './components/MenuBar.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
header {
  height: 50px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
}

main {
  min-height: calc(100vh - 50px); /* Changed from height to min-height */
  width: 100%;
  padding-top: 70px; /* Increased to account for fixed header */
}
</style>
