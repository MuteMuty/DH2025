<template>
  <div class="menu-bar">
    <Menubar>
      <template #start>
        <div class="navigation-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/trending" class="nav-link">Trending</router-link>
        </div>
        <div class="menubar-content">
          <!-- Search without icon -->
          <div class="search-container">
            <InputText
              v-model="searchQuery"
              placeholder="Search for products..."
              @keyup.enter="() => {}"
              @input="handleSearchInput"
            />
          </div>

          <!-- Store selector as a dropdown with checkboxes -->
          <div class="store-selector">
            <OverlayPanel ref="storeOverlay" :style="{ width: '250px' }">
              <div class="store-checkbox-container">
                <div v-for="option in storeOptions" :key="option.value" class="store-checkbox-item">
                  <Checkbox
                    v-model="selectedStores"
                    :value="option.value"
                    :inputId="option.value"
                  />
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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const selectedStores = ref<string[]>([])
const storeOverlay = ref<any>(null)
const debounceTimeout = ref<number | null>(null)

const storeOptions = [
  { name: 'Lidl', value: 'Lidl' },
  { name: 'Hofer', value: 'Hofer' },
  { name: 'Spar', value: 'Spar' },
  { name: 'Mercator', value: 'Mercator' },
]

// Computed property for the badge count
const selectedStoresBadge = computed(() => {
  const count = selectedStores.value.length
  return count > 0 ? count.toString() : ''
})

// Function to select all stores
const selectAllStores = () => {
  selectedStores.value = storeOptions.map((option) => option.value)
}

// Handle both search input and empty search
const handleSearchInput = (event: any) => {
  const query = event.target.value.trim()

  // Clear previous timeout
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  // If search is emptied and we're on the search page, go back to home
  if (query === '' && route.name === 'search') {
    debounceTimeout.value = setTimeout(() => {
      router.push('/')
    }, 300)
    return
  }

  // Only navigate if we're typing something meaningful
  if (query.length >= 2) {
    // Set new timeout for debounce (300ms)
    debounceTimeout.value = setTimeout(() => {
      // Only navigate if we're not already on the search page
      if (route.name !== 'search') {
        router.push({
          path: '/search',
          query: {
            q: query,
            ...(selectedStores.value.length > 0 ? { stores: selectedStores.value.join(',') } : {}),
          },
        })
      } else {
        // If already on search page, just update the query parameter
        router.replace({
          query: {
            ...route.query,
            q: query,
            ...(selectedStores.value.length > 0 ? { stores: selectedStores.value.join(',') } : {}),
          },
        })
      }
    }, 300)
  }
}

// For backwards compatibility, keeping the original function name but calling our new handler
const onSearchInput = handleSearchInput

// const searchProducts = () => {
//   if (searchQuery.value.trim()) {
//     const query = { q: searchQuery.value }

//     if (selectedStores.value.length > 0) {
//       query.stores = selectedStores.value.join(',')
//     }

//     router.push({
//       path: '/search',
//       query,
//     })
//     searchQuery.value = ''
//   }
// }

const toggleStoreMenu = (event: MouseEvent) => {
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
  padding: 0.75rem 1.5rem;
  background-color: #FFFFFF;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.navigation-links {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.nav-link {
  color: #2C2C2C;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
  border-radius: 6px;
}

.nav-link:hover {
  color: #4A90E2;
  background-color: rgba(74, 144, 226, 0.05);
}

.nav-link.router-link-active {
  color: #4A90E2;
  font-weight: 600;
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
  margin-right: 0.75rem;
}

.search-container .p-inputtext {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-container .p-inputtext:hover {
  border-color: #4A90E2;
}

.search-container .p-inputtext:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.store-selector {
  display: flex;
  align-items: center;
}

.store-button {
  height: 2.75rem;
  width: 2.75rem;
  color: #2C2C2C;
  transition: background-color 0.2s, color 0.2s;
}

.store-button:hover {
  background-color: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
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
  background-color: #4A90E2;
}

:deep(.p-badge-danger) {
  background-color: #FF6B6B;
}

:deep(.p-badge-secondary) {
  background-color: #E0E0E0;
  color: #2C2C2C;
}

:deep(.p-badge-primary) {
  background-color: #4A90E2;
}

.store-checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.5rem 0;
}

.store-checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
}

.store-checkbox-item:hover {
  background-color: rgba(74, 144, 226, 0.05);
}

.store-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #E0E0E0;
}

:deep(.store-actions .p-button-text) {
  color: #4A90E2;
}

:deep(.store-actions .p-button-text:hover) {
  background-color: rgba(74, 144, 226, 0.1);
}

:deep(.p-overlaypanel) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #E0E0E0;
}

:deep(.p-overlaypanel:before, .p-overlaypanel:after) {
  border-bottom-color: #FFFFFF;
}

:deep(.p-checkbox-box.p-highlight) {
  border-color: #4A90E2;
  background-color: #4A90E2;
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
    margin-bottom: 0.75rem;
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
    margin-top: 0.75rem;
    justify-content: flex-end;
  }

  .search-container {
    margin-right: 0;
  }
}
</style>
