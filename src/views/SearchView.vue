<template>
  <div class="search-container">
    <h1>Search Results</h1>

    <div class="search-header">
      <div class="filter-section" v-if="store.searchResults.length > 0">
        <span class="results-count">{{ store.searchResults.length }} results found</span>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #4A90E2;"></i>
      <p>Searching for deals...</p>
    </div>

    <div v-else-if="store.searchResults.length === 0 && route.query.q" class="empty-results">
      <i class="pi pi-info-circle" style="font-size: 2rem; color: #4A90E2;"></i>
      <h3>No results found</h3>
      <p>Try different keywords or filters</p>
    </div>

    <div v-else-if="store.searchResults.length > 0" class="search-results">
      <div class="grid">
        <div
          class="col-12 sm:col-6 lg:col-3"
          v-for="discountItem in store.searchResults"
          :key="discountItem._id"
        >
          <div class="card product-card">
            <div class="discount-tag" v-if="discountItem.discount_percentage">
              -{{ discountItem.discount_percentage }}%
            </div>
            <div class="store-tag" :class="`store-${discountItem.store.toLowerCase()}`">
              {{ discountItem.store }}
            </div>
            <div class="product-details">
              <h3>{{ typeof discountItem.item_description === 'string' ?
                discountItem.item_description : 'Product' }}</h3>
              <div class="price-container">
                <span class="original-price" v-if="discountItem.discount_percentage">
                  {{ getOriginalPrice(discountItem) }}€
                </span>
                <span class="discount-price">{{ discountItem.discount_price.toFixed(2) }}€</span>
              </div>
            </div>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              @click="store.addToCart(discountItem)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import { useAppStore } from '@/stores/appStore'
import type { Discounts } from '@/types'

const route = useRoute()
const store = useAppStore()
const loading = ref(false)

// Calculate original price from discount price and percentage
const getOriginalPrice = (discountItem: Discounts): string => {
  if (!discountItem.discount_percentage) return discountItem.discount_price.toFixed(2);
  return (discountItem.discount_price / (1 - discountItem.discount_percentage / 100)).toFixed(2)
}

// Watch for URL query changes to trigger search
watch(
  () => route.query,
  (newQuery) => {
    const queryString = newQuery.q as string
    if (queryString) {
      loading.value = true
      console.log('Searching for:', queryString)

      // Use the store's existing searchProducts function with its expected parameters
      store.searchProducts({
        name: queryString,
        orderBy: 'discount_percentage',
        sortOrder: 'desc'
      })
      .then(results => {
        console.log('Got search results:', results)
      })
      .catch(error => {
        console.error('Search error:', error)
      })
      .finally(() => {
        loading.value = false
        console.log('Search completed, results:', store.searchResults)
      })
    } else {
      // Clear results if there's no query
      store.searchResults = []
    }
  },
  { immediate: true }
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

.grid {
  display: flex;
  flex-wrap: wrap;
  margin: -0.75rem;
}

.grid [class*="col-"] {
  padding: 0.75rem;
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

.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #E0E0E0;
}

.product-card {
  position: relative;
  padding: 1.75rem;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.discount-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #FF6B6B;
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 0 12px 0 12px;
  font-weight: bold;
}

.store-tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.35rem 0.75rem;
  border-radius: 12px 0 12px 0;
  color: white;
  font-weight: bold;
}

.store-lidl {
  background: #0050AA;
}

.store-hofer {
  background: #E30613;
}

.store-spar {
  background: #008C45;
}

.store-mercator {
  background: #CE1126;
}

.store-eurospin {
  background: #0066CC;
}

.product-details {
  margin: 2rem 0 1.5rem;
}

.product-details h3 {
  color: #2C2C2C;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  margin-bottom: 1.25rem;
}

.original-price {
  text-decoration: line-through;
  color: #666666;
  font-size: 0.9rem;
}

.discount-price {
  font-weight: bold;
  color: #77D28C;
  font-size: 1.3rem;
}

.p-button {
  background-color: #4A90E2;
  border-color: #4A90E2;
  border-radius: 8px;
  width: 100%;
}

.p-button:hover {
  background-color: #3A80D2;
  border-color: #3A80D2;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
