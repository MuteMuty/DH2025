<template>
  <div class="menu-bar">
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts" setup>
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import { RouterLink } from 'vue-router'

const items = [
  {
    label: 'Saving Grace',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Shopping Cart',
    icon: 'pi pi-shopping-cart',
    route: '/shopping-cart',
  },
  {
    label: 'Trending',
    icon: 'pi pi-trending-up',
    route: '/trending',
  },
  {
    label: 'Search',
    icon: 'pi pi-search',
    route: '/search',
  },
]
</script>

<style scoped>
.menu-bar {
  background-color: var(--p-primary-color);
}
</style>
