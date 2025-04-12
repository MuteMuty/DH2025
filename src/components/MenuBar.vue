<template>
  <div class="menu-bar">
    <Menubar :model="items">
      <template #start>
        <div class="navigation-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/trending" class="nav-link">Trending</router-link>
        </div>
        <div class="menubar-content">
          <!-- Search without icon -->
          <div class="search-container">
            <InputText v-model="searchQuery" placeholder="Search for products..." @keyup.enter="searchProducts" />
          </div>

          <!-- Store selector as a dropdown with checkboxes -->
          <div class="store-selector">
            <OverlayPanel ref="storeOverlay" :style="{ width: '250px' }">
              <div class="store-checkbox-container">
                <div v-for="option in storeOptions.slice(1)" :key="option.value" class="store-checkbox-item">
                  <Checkbox v-model="selectedStores" :value="option.value" :inputId="option.value" />
                  <label :for="option.value" class="ml-2">{{ option.name }}</label>
                </div>
              </div>
              <div class="store-actions">
                <Button label="Clear All" text @click="selectedStores = []" />
                <Button label="Select All" text @click="selectAllStores" />
              </div>
            </OverlayPanel>

            <Button
              icon="pi pi-plus"
              class="store-button"
              aria-label="Select Stores"
              @click="toggleStoreMenu"
              :badge="selectedStoresBadge"
              :badgeClass="selectedStores.length ? 'p-badge-primary' : 'p-badge-secondary'"
              text
              rounded
            />
          </div>
        </div>
      </template>
      <template #end>
        <div class="cart-container">
          <router-link to="/shopping-cart" class="cart-link">
            <Button icon="pi pi-shopping-cart" rounded text badge="2" badgeClass="p-badge-danger" />
          </router-link>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import OverlayPanel from 'primevue/overlaypanel'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const selectedStores = ref([])
const storeOverlay = ref(null)

const storeOptions = [
  { name: 'All Stores', value: null },
  { name: 'Lidl', value: 'Lidl' },
  { name: 'Hofer', value: 'Hofer' },
  { name: 'Spar', value: 'Spar' },
  { name: 'Mercator', value: 'Mercator' }
]

// Computed property for the badge count
const selectedStoresBadge = computed(() => {
  const count = selectedStores.value.length;
  return count > 0 ? count.toString() : '';
})

// Function to select all stores
const selectAllStores = () => {
  selectedStores.value = storeOptions.slice(1).map(option => option.value)
}

// Remove items array as we're now using direct router-links
const items = []

const searchProducts = () => {
  if (searchQuery.value.trim()) {
    const query = { q: searchQuery.value }

    if (selectedStores.value.length > 0) {
      query.stores = selectedStores.value.join(',')
    }

    router.push({
      path: '/search',
      query
    })
    searchQuery.value = ''
  }
}

const toggleStoreMenu = (event) => {
  storeOverlay.value.toggle(event)
}
</script>

<style scoped>
.menu-bar {
  width: 100%;
}

:deep(.p-menubar) {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--surface-card);
  border: none;
}

.navigation-links {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link + .nav-link {
  margin-left: 0.5rem;
}

.menubar-content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}

.search-container {
  width: 100%;
  max-width: 500px;
  margin-right: 0.5rem;
}

.search-container .p-inputtext {
  width: 100%;
}

.store-selector {
  display: flex;
  align-items: center;
}

.store-button {
  height: 2.5rem;
  width: 2.5rem;
}

.store-button:hover {
  background-color: var(--surface-hover);
}

.cart-container {
  display: flex;
  align-items: center;
}

.cart-link {
  text-decoration: none;
  color: inherit;
}

:deep(.p-badge) {
  min-width: 1.2rem;
  height: 1.2rem;
  font-size: 0.7rem;
}

.store-checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.store-checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.25rem;
}

.store-checkbox-item:hover {
  background-color: var(--surface-hover);
  border-radius: 4px;
}

.store-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--surface-border);
}

@media (min-width: 768px) {
  :deep(.p-menubar-start) {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  :deep(.p-menubar-end) {
    display: flex;
    align-items: center;
  }

  .menubar-content {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .navigation-links {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }

  :deep(.p-menubar-start) {
    flex-direction: column;
    align-items: stretch;
  }

  .menubar-content {
    flex-direction: column;
    align-items: stretch;
  }

  .store-selector {
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
