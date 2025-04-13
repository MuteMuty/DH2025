<template>
  <div class="menu-bar">
    <Menubar>
      <template #start>
        <img src="/Benis4.png" alt="The Saving Grace" class="nav-logo" />
        <div class="navigation-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/trending" class="nav-link">New Deals!</router-link>
        </div>
        <div class="menubar-content">
          <!-- Search without icon -->
          <div class="search-container">
            <span class="p-input-icon-right">
              <InputText
                v-model="searchQuery"
                placeholder="Search for products..."
                @keyup.enter="() => {}"
                @input="handleSearchInput"
              />
            </span>
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
                  <label style="padding-left: 0.5rem" :for="option.value" class="ml-2">{{
                    option.name
                  }}</label>
                </div>
              </div>
              <div class="store-actions">
                <Button label="Clear All" text @click="selectedStores = []" />
                <Button label="Select All" text @click="selectAllStores" />
              </div>
            </OverlayPanel>

            <Button
              icon="pi pi-filter"
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
        <div class="notification-button">
          <Toast />
          <Button
            @click="toggleNotification"
            icon="pi pi-bell"
            rounded
            text
            badgeClass="p-badge-danger"
          />
        </div>
        <div class="cart-container">
          <router-link to="/shopping-cart" class="cart-link">
            <Button
              :icon="isCartRoute || isCartHovered ? 'pi pi-star-fill' : 'pi pi-star'"
              rounded
              text
              :badge="cartCount > 0 ? cartCount.toString() : ''"
              badgeClass="p-badge-danger"
              @mouseenter="isCartHovered = true"
              @mouseleave="isCartHovered = false"
            />
          </router-link>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import Menubar from 'primevue/menubar'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import OverlayPanel from 'primevue/overlaypanel'
import Toast from 'primevue/toast'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAppStore } from '../stores/appStore'
const toast = useToast()

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
  { name: 'Eurospin', value: 'Eurospin' },
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
      // Build query object
      const queryObject: Record<string, string> = { q: query }

      // Only add stores filter if at least one store is selected
      if (selectedStores.value.length > 0) {
        queryObject.stores = selectedStores.value.join(',')
      }

      // Only navigate if we're not already on the search page
      if (route.name !== 'search') {
        router.push({
          path: '/search',
          query: queryObject,
        })
      } else {
        // If already on search page, just update the query parameter
        // Make sure we preserve any existing query parameters that aren't being updated
        router.replace({
          query: {
            ...queryObject,
          },
        })
      }

      // Always call searchProducts with the current query and apply filters in the view
      store.searchProducts({
        name: query,
        orderBy: 'discount_percentage',
        sortOrder: 'desc',
      })
    }, 300)
  }
}

const toggleStoreMenu = (event: MouseEvent) => {
  storeOverlay.value.toggle(event)
}

const toggleNotification = () => {
  console.log('toggleNotification')
  toast.add({
    severity: 'info',
    summary: 'Notifications',
    detail: 'Enabled notifications for discounts',
    life: 3000,
  })

  setTimeout(() => {
    useAppStore().isNotificationVisible = true
  }, 6000)
}

// Add these new reactive variables
const isCartHovered = ref(false)
const store = useAppStore()
const isCartRoute = computed(() => route.name === 'shopping-cart')

// Add cart count computed property to show the actual number of items
const cartCount = computed(() => {
  if (!store.shoppingCart || !Array.isArray(store.shoppingCart)) {
    return 0
  }
  return store.shoppingCart.length
})

// Initialize cart data when component is mounted
onMounted(async () => {
  await store.getShoppingCart()
})

// Add this watch to the MenuBar component's script section
watch(selectedStores, (newStores) => {
  // Only update if we're already on the search page and have a search query
  if (route.name === 'search' && searchQuery.value.length >= 2) {
    const queryObject: Record<string, string> = {
      q: searchQuery.value,
    }

    if (newStores.length > 0) {
      queryObject.stores = newStores.join(',')
    }

    // Update the URL without navigating
    router.replace({
      query: queryObject,
    })
  }
})
</script>

<style scoped>
.menu-bar {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

:deep(.p-menubar) {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  max-width: 1400px;
  margin: 0 auto;
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
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #4caf50;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 80%;
}

.nav-link:hover {
  color: #4caf50;
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: #4caf50;
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
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  transition: all 0.3s ease;
  background: white;
  font-size: 0.95rem;
}

.search-container .p-inputtext:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  transform: translateY(-1px);
}

.search-container .p-input-icon-right i {
  color: #4caf50;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.75rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-container .p-inputtext:focus + i {
  transform: translateY(-50%) scale(1.1);
}

.store-selector {
  display: flex;
  align-items: center;
}

.store-button {
  height: 2.5rem;
}

.store-button:hover {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.cart-container {
  margin-left: 1rem;
  background: rgba(76, 175, 80, 0.1);
  padding: 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cart-container:hover {
  background: rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.cart-link {
  color: #2c2c2c;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.cart-link:hover {
  color: #4caf50;
}

.cart-link :deep(.p-button) {
  width: 5rem;
  height: 3rem;
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.cart-link :deep(.p-button:hover) {
  background: white;
  transform: scale(1.05);
}

.cart-link :deep(.p-button .p-button-icon) {
  font-size: 1.4rem;
  color: #4caf50;
  transition: all 0.3s ease;
}

:deep(.p-badge) {
  min-width: 1.4rem;
  height: 1.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: #ff6b6b;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  transform: scale(1);
  transition: all 0.3s ease;
}

.cart-container:hover :deep(.p-badge) {
  transform: scale(1.1);
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

  .search-container {
    margin-right: 0;
  }

  .nav-logo {
    height: 38px;
    margin-right: 1rem;
  }
}

.logo-link {
  padding: 0;
  display: flex;
  align-items: center;
}

.logo-link::after {
  display: none;
}

.nav-logo {
  height: 45px;
  width: auto;
  margin-right: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-link:hover .nav-logo {
  transform: scale(1.05);
}
</style>
