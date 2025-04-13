<template>
  <div class="search-container">
    <h1>Search Results</h1>

    <div class="search-header">
      <div class="filter-section" v-if="filteredResults.length > 0">
        <span class="results-count">{{ filteredResults.length }} results found</span>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #4A90E2;"></i>
      <p>Searching for deals...</p>
    </div>

    <div v-else-if="filteredResults.length === 0 && route.query.q" class="empty-results">
      <i class="pi pi-info-circle" style="font-size: 2rem; color: #4A90E2;"></i>
      <h3>No results found</h3>
      <p>Try different keywords or filters</p>
    </div>

    <div v-else-if="filteredResults.length > 0" class="search-results">
      <div class="filter-section">
        <span class="results-count">{{ filteredResults.length }} results found</span>
      </div>

      <div class="grid">
        <div
          class="col-12 sm:col-6 lg:col-3"
          v-for="(discountItem, index) in filteredResults"
          :key="discountItem._id"
        >
          <div v-show="animateItems[index]" class="card product-card fade-in">
            <!-- Circular discount tag like in HomeView -->
            <div class="discount-tag" v-if="discountItem.discount_percentage">
              -{{ discountItem.discount_percentage }}%
            </div>

            <!-- Store tag with image and name -->
            <div class="store-tag">
              <img
                :src="`/stores-imgs/${discountItem.store.toLowerCase()}-img.png`"
                :alt="discountItem.store"
                class="store-logo"
              />
              <span class="store-name">{{ discountItem.store }}</span>
            </div>

            <div class="product-details">
              <h3>{{ typeof discountItem.item_description === 'string' ?
                discountItem.item_description : 'Product' }}</h3>

              <!-- Add validity period if available -->
              <div class="validity-period" v-if="discountItem.offer_start_date && discountItem.offer_end_date">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(discountItem.offer_start_date) }} - {{ formatDate(discountItem.offer_end_date) }}</span>
              </div>

              <div class="price-container">
                <span class="original-price" v-if="discountItem.discount_percentage">
                  {{ getOriginalPrice(discountItem) }}€
                </span>
                <span class="discount-price">{{ discountItem.discount_price.toFixed(2) }}€</span>
              </div>
            </div>
            <Button
              icon="pi pi-shopping-cart"
              :label="isInCart(discountItem) ? 'Already in Wishlist' : 'Add to Wishlist'"
              :disabled="isInCart(discountItem)"
              @click="store.addToCart(discountItem)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { useAppStore } from '@/stores/appStore'
import type { Discounts } from '@/types'

const route = useRoute()
const store = useAppStore()
const loading = ref(false)
const filteredResults = ref<Discounts[]>([])
// Add animation state array
const animateItems = ref<boolean[]>([])

// Calculate original price from discount price and percentage
const getOriginalPrice = (discountItem: Discounts): string => {
  if (!discountItem.discount_percentage) return discountItem.discount_price.toFixed(2);
  return (discountItem.discount_price / (1 - discountItem.discount_percentage / 100)).toFixed(2)
}

// Format date function to match HomeView
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate()}.${date.getMonth() + 1}`
}

// Check if item is in cart function to match HomeView
function isInCart(discountItem: Discounts) {
  return store.shoppingCart.some((item) =>
    'discount' in item && typeof item.discount === 'object' && item.discount !== null
      ? (item.discount as Discounts)._id === discountItem._id
      : item._id === discountItem._id)
}

// Add this function to handle animation when results change
const setupAnimation = (count: number) => {
  // Reset animation states
  animateItems.value = new Array(count).fill(false)

  // Stagger the animations
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (i < animateItems.value.length) {
        animateItems.value[i] = true
      }
    }, 100 + i * 100) // 100ms delay between each item
  }
}

// Watch for URL query changes to trigger search
watch(
  () => route.query,
  (newQuery) => {
    const queryString = newQuery.q as string
    if (queryString) {
      loading.value = true
      console.log('Searching for:', queryString)

      // Get selected stores if any
      const selectedStoresParam = newQuery.stores as string
      const selectedStores = selectedStoresParam ? selectedStoresParam.split(',') : []

      // Only make the API call if we don't already have results or the search query changed
      store.searchProducts({
        name: queryString,
        orderBy: 'discount_percentage',
        sortOrder: 'desc'
      })
      .then(results => {
        console.log('Got search results:', results)

        // Filter results by selected stores if any are selected
        if (selectedStores.length > 0) {
          console.log('Filtering by stores:', selectedStores)
          filteredResults.value = store.searchResults.filter(item =>
            selectedStores.includes(item.store)
          )
        } else {
          // If no stores selected, show all results
          filteredResults.value = store.searchResults
        }

        // Setup animation for the new results
        setupAnimation(filteredResults.value.length)
      })
      .catch(error => {
        console.error('Search error:', error)
        filteredResults.value = []
      })
      .finally(() => {
        loading.value = false
      })
    } else {
      // Clear results if there's no query
      store.searchResults = []
      filteredResults.value = []
    }
  },
  { immediate: true, deep: true } // Make sure we track deep changes to query objects
)
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2C2C2C;
  font-weight: 600;
}

.search-header {
  margin-bottom: 2rem;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  color: #666666;
  font-size: 0.9rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #4A90E2;
}

.loading-container p {
  margin-top: 1rem;
  color: #666666;
}

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
}

.empty-results h3 {
  margin-top: 1rem;
  color: #2C2C2C;
}

.empty-results p {
  color: #666666;
  margin-top: 0.5rem;
}

.search-results {
  margin-top: 1rem;
}

/* Grid layout - same as in HomeView */
.grid {
  display: flex;
  flex-wrap: wrap;
  margin: -0.5rem;
}

.grid [class*="col-"] {
  padding: 0.5rem;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 576px) {
  .sm\:col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .lg\:col-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

/* Product card styles - exactly as in HomeView */
.product-card {
  position: relative;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.discount-tag {
  position: absolute;
  top: -12px;
  right: -12px;
  background: #ff5252;
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
  z-index: 1;
  transform: rotate(12deg);
}

.store-tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.75rem;
  background: white;
  border-radius: 16px 0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.store-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.store-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c2c2c;
}

.product-details {
  margin: 1.5rem 0;
  color: black;
}

.product-details h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: #2c2c2c;
}

.validity-period {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
}

.validity-period i {
  color: #4caf50;
}

.price-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 12px;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 1.2rem;
  opacity: 0.7;
}

.discount-price {
  font-weight: 700;
  color: #4caf50;
  font-size: 1.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Add these animation styles */
.fade-in {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
