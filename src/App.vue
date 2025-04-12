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
}

main {
  min-height: calc(100vh - 50px); /* Changed from height to min-height */
  width: 100%; /* Changed from width: 100vw */
  padding-top: 20px;
}
</style>
