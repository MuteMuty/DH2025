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
}

main {
  height: calc(100vh - 50px);
  width: 100vw;
}
</style>
