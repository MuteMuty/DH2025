<template>
  <div class="search-container">
    <h1>Search Results</h1>



    <!-- Add bundle options when multiple search terms exist -->
    <div v-if="searchTerms.length > 1" class="bundle-options">
      <div class="bundle-header">
        <h3>Bundle Options</h3>
        <p>Find the best deals for your shopping list</p>
      </div>

      <div class="bundle-buttons">
        <Button
          :class="{ 'bundle-button-active': bundleView === 'cheapest-items' }"
          @click="setBundleView('cheapest-items')"
          class="bundle-button"
          style="background-color: #4caf50; border-color: #4caf50; color: white;"
        >
          <div class="bundle-button-content">
            <div class="bundle-icon">
              <i class="pi pi-tag"></i>
            </div>
            <span class="bundle-title">Cheapest Items</span>
          </div>
        </Button>

        <Button
          :class="{ 'bundle-button-active': bundleView === 'cheapest-store' }"
          @click="setBundleView('cheapest-store')"
          class="bundle-button"
          style="background-color: #4caf50; border-color: #4caf50; color: white;"
        >
          <div class="bundle-button-content">
            <div class="bundle-icon">
              <i class="pi pi-shopping-bag"></i>
            </div>
            <span class="bundle-title">Cheapest Store</span>
          </div>
        </Button>
      </div>

      <!-- Description section that appears below the selected button -->
      <div v-if="bundleView === 'cheapest-items'" class="bundle-description">
        <div class="description-content">
          <p>Show the lowest priced option for each item</p>
          <div class="savings" v-if="cheapestItemsSavings > 0">
            Save up to <span class="savings-amount">{{ cheapestItemsSavings.toFixed(2) }}€</span>
          </div>
        </div>
      </div>

      <div v-if="bundleView === 'cheapest-store'" class="bundle-description">
        <div class="description-content">
          <p>Get all items from a single store at the lowest price</p>
          <div class="savings" v-if="cheapestStore">
            Best store: <span class="store-name-highlight">{{ cheapestStore }}</span>
          </div>
        </div>
      </div>

      <!-- Show this when a bundle view is active -->
      <div v-if="bundleView !== 'all'" class="bundle-active-bar">
        <Button icon="pi pi-times" label="Clear bundle view" text @click="clearBundleView" />
      </div>
    </div>

    <div class="search-header">
      <div class="filter-section" v-if="displayResults.length > 0">
        <span class="results-count">{{ displayResults.length }} results found for {{ searchTerms.length }} search terms</span>

        <!-- Add this sorting dropdown -->
        <div class="sort-options">
          <span class="sort-label">Sort by:</span>
          <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort by"
            class="sort-dropdown"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #4a90e2"></i>
      <p>Searching for deals...</p>
    </div>

    <div v-else-if="displayResults.length === 0 && route.query.q" class="empty-results">
      <i class="pi pi-info-circle" style="font-size: 2rem; color: #4a90e2"></i>
      <h3>No results found</h3>
      <p>Try different keywords or filters</p>
    </div>

    <div v-else-if="displayResults.length > 0" class="search-results">
      <div class="filter-section"></div>

      <div class="grid">
        <div
          class="col-12 sm:col-6 lg:col-3"
          v-for="(discountItem, index) in displayResults"
          :key="discountItem._id"
        >
          <div
            v-show="animateItems[index]"
            class="card product-card fade-in"
            @dblclick="showProductDetail(discountItem)"
            :class="{ 'best-deal': isCheapestItem(discountItem) && bundleView === 'cheapest-items' }"
          >
            <!-- Circular discount tag like in HomeView -->
            <div class="discount-tag" v-if="discountItem.discount_percentage">
              -{{ discountItem.discount_percentage }}%
            </div>

            <!-- Best deal badge for cheapest items -->
            <div class="best-deal-badge" v-if="isCheapestItem(discountItem) && bundleView === 'cheapest-items'">
              Best Deal
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
              <h3>
                {{
                  typeof discountItem.item_description === 'string'
                    ? discountItem.item_description
                    : 'Product'
                }}
              </h3>

              <!-- Add validity period if available -->
              <div
                class="validity-period"
                v-if="discountItem.offer_start_date && discountItem.offer_end_date"
              >
                <i class="pi pi-calendar"></i>
                <span
                  >{{ formatDate(discountItem.offer_start_date) }} -
                  {{ formatDate(discountItem.offer_end_date) }}</span
                >
              </div>

              <!-- Add this inside the price-container div in your template -->
              <div class="price-container">
                <div class="discount-price-wrapper">
                  <span class="original-price" v-if="discountItem.discount_percentage">
                    {{ getOriginalPrice(discountItem) }}€
                  </span>
                  <span class="discount-price">{{ discountItem.discount_price.toFixed(2) }}€</span>
                </div>
                <span class="unit-price" v-if="getUnitPrice(discountItem)">
                  {{ getUnitPrice(discountItem) }}
                </span>
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

    <!-- Add the ProductDetailPopup component -->
    <ProductDetailPopup v-model:visible="showPopup" :product="selectedProduct" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown' // Add this import
import { useAppStore } from '@/stores/appStore'
import type { Discounts } from '@/types'
import ProductDetailPopup from '@/components/ProductDetailPopup.vue'

const route = useRoute()
const store = useAppStore()
const loading = ref(false)
const searchTerms = ref<string[]>([])
const activeSearches = ref<string[]>([])
const filteredResults = ref<Discounts[]>([])
const animateItems = ref<boolean[]>([])

// Add bundle view state and related data
const bundleView = ref<'all' | 'cheapest-items' | 'cheapest-store'>('all')
const cheapestItemsByTerm = ref<Map<string, Discounts>>(new Map())
const storeItems = ref<Map<string, Discounts[]>>(new Map())
const cheapestStore = ref<string | null>(null)
const cheapestItemsSavings = ref(0)

// Add sorting options
const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Lowest Price', value: 'price_asc' },
  { label: 'Highest Price', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount' },
]
const sortBy = ref(sortOptions[0])

// Function to set bundle view
const setBundleView = (view: 'all' | 'cheapest-items' | 'cheapest-store') => {
  bundleView.value = view
  // Reset animation to show the transition
  setupAnimation(displayResults.value.length)
}

// Calculate which items are the cheapest for each search term
const calculateCheapestItems = () => {
  cheapestItemsByTerm.value.clear()

  // For each search term, find the cheapest matching item
  for (const term of searchTerms.value) {
    // Find items matching this term
    const matchingItems = filteredResults.value.filter(item =>
      item.item_description.toLowerCase().includes(term.toLowerCase())
    )

    if (matchingItems.length > 0) {
      // Find the cheapest item
      const cheapestItem = matchingItems.reduce((cheapest, current) =>
        current.discount_price < cheapest.discount_price ? current : cheapest,
        matchingItems[0]
      )

      cheapestItemsByTerm.value.set(term, cheapestItem)
    }
  }

  // Calculate potential savings
  const savings = calculatePotentialSavings()
  cheapestItemsSavings.value = savings
}

// Calculate which store has the lowest total price for all items
const calculateCheapestStore = () => {
  storeItems.value.clear()
  const storePrices = new Map<string, number>()

  // Get unique stores from results
  const stores = new Set(filteredResults.value.map(item => item.store))

  // For each store, calculate the total price if all items were bought there
  for (const storeName of stores) {
    const itemsBySearchTerm = new Map<string, Discounts[]>()

    // Group items by search term for this store
    for (const term of searchTerms.value) {
      const matchingItems = filteredResults.value.filter(item =>
        item.store === storeName &&
        item.item_description.toLowerCase().includes(term.toLowerCase())
      )

      if (matchingItems.length > 0) {
        itemsBySearchTerm.set(term, matchingItems)
      }
    }

    // Only consider stores that have at least one item for each search term
    if (itemsBySearchTerm.size === searchTerms.value.length) {
      const storeItemsList: Discounts[] = []
      let totalPrice = 0

      // For each search term, add the cheapest matching item to the total
      for (const [term, items] of itemsBySearchTerm.entries()) {
        const cheapestItem = items.reduce((cheapest, current) =>
          current.discount_price < cheapest.discount_price ? current : cheapest,
          items[0]
        )

        totalPrice += cheapestItem.discount_price
        storeItemsList.push(cheapestItem)
      }

      storePrices.set(storeName, totalPrice)
      storeItems.value.set(storeName, storeItemsList)
    }
  }

  // Find the store with the lowest total price
  let lowestPrice = Infinity
  cheapestStore.value = null

  for (const [storeName, price] of storePrices.entries()) {
    if (price < lowestPrice) {
      lowestPrice = price
      cheapestStore.value = storeName
    }
  }
}

// Calculate potential savings from using cheapest items bundle
const calculatePotentialSavings = (): number => {
  // If we don't have cheapest items for all terms, return 0
  if (cheapestItemsByTerm.value.size !== searchTerms.value.length) {
    return 0
  }

  // Calculate average price per search term
  const avgPriceByTerm = new Map<string, number>()

  for (const term of searchTerms.value) {
    const matchingItems = filteredResults.value.filter(item =>
      item.item_description.toLowerCase().includes(term.toLowerCase())
    )

    if (matchingItems.length > 0) {
      const avgPrice = matchingItems.reduce((sum, item) => sum + item.discount_price, 0) / matchingItems.length
      avgPriceByTerm.set(term, avgPrice)
    }
  }

  // Calculate total savings (average price minus cheapest price)
  let totalSavings = 0

  for (const term of searchTerms.value) {
    const cheapestItem = cheapestItemsByTerm.value.get(term)
    const avgPrice = avgPriceByTerm.get(term)

    if (cheapestItem && avgPrice) {
      totalSavings += (avgPrice - cheapestItem.discount_price)
    }
  }

  return totalSavings
}

// Check if an item is the cheapest for its search term
const isCheapestItem = (item: Discounts): boolean => {
  for (const [_, cheapestItem] of cheapestItemsByTerm.value.entries()) {
    if (item._id === cheapestItem._id) {
      return true
    }
  }
  return false
}

// Computed property to determine which results to display based on bundle view
const displayResults = computed(() => {
  if (bundleView.value === 'all') {
    return sortedResults.value
  } else if (bundleView.value === 'cheapest-items') {
    return Array.from(cheapestItemsByTerm.value.values())
  } else if (bundleView.value === 'cheapest-store') {
    return cheapestStore.value ? storeItems.value.get(cheapestStore.value) || [] : []
  }
  return sortedResults.value
})

// Sort the filtered results based on selected sort option
const sortedResults = computed(() => {
  if (!filteredResults.value.length) return []

  const results = [...filteredResults.value]

  switch (sortBy.value.value) {
    case 'price_asc':
      return results.sort((a, b) => a.discount_price - b.discount_price)
    case 'price_desc':
      return results.sort((a, b) => b.discount_price - a.discount_price)
    case 'discount':
      return results.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
    default:
      return results // Keep original order for relevance
  }
})

// Watch for changes in the sort option to animate items
watch(sortBy, () => {
  setupAnimation(displayResults.value.length)
})

// Calculate original price from discount price and percentage
const getOriginalPrice = (discountItem: Discounts): string => {
  if (!discountItem.discount_percentage) return discountItem.discount_price.toFixed(2)
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
      : item._id === discountItem._id,
  )
}

// Add this function to handle animation when results change
const setupAnimation = (count: number) => {
  // Reset animation states
  animateItems.value = new Array(count).fill(false)

  // Stagger the animations
  for (let i = 0; i < count; i++) {
    setTimeout(
      () => {
        if (i < animateItems.value.length) {
          animateItems.value[i] = true
        }
      },
      100 + i * 100,
    ) // 100ms delay between each item
  }
}

// Add new variables for popup
const showPopup = ref(false)
const selectedProduct = ref<Discounts | null>(null)

// Function to show product detail popup
function showProductDetail(product: Discounts) {
  selectedProduct.value = product
  showPopup.value = true
}

// Watch for URL query changes to trigger search
watch(
  () => route.query,
  async (newQuery) => {
    const queryString = newQuery.q as string

    if (queryString) {
      loading.value = true

      // Split the query string into individual search terms
      searchTerms.value = queryString.split(',').filter(term => term.trim().length >= 2)
      activeSearches.value = [...searchTerms.value]

      // Get selected stores if any
      const selectedStoresParam = newQuery.stores as string
      const selectedStores = selectedStoresParam ? selectedStoresParam.split(',') : []

      // Search for all terms and combine results
      const allResults: Discounts[] = []

      // Search for each term separately
      for (const term of searchTerms.value) {
        try {
          await store.searchProducts({
            name: term.trim(),
            orderBy: 'discount_percentage',
            sortOrder: 'desc',
          })

          // Add results to our combined results array, avoiding duplicates
          for (const result of store.searchResults) {
            if (!allResults.some(item => item._id === result._id)) {
              allResults.push(result)
            }
          }
        } catch (error) {
          console.error(`Error searching for term "${term}":`, error)
        }
      }

      // Filter by selected stores if needed
      if (selectedStores.length > 0) {
        filteredResults.value = allResults.filter((item) =>
          selectedStores.includes(item.store),
        )
      } else {
        filteredResults.value = allResults
      }

      // Setup animation for the combined results
      setupAnimation(filteredResults.value.length)
      loading.value = false

      // Calculate bundle options
      calculateCheapestItems()
      calculateCheapestStore()

      // IMPORTANT: Keep the current bundle view even when search changes
      // Only set bundleView to 'all' if there's only one search term now
      if (searchTerms.value.length < 2) {
        bundleView.value = 'all'
      }
    } else {
      // Clear results if there's no query
      searchTerms.value = []
      store.searchResults = []
      filteredResults.value = []
      loading.value = false
      bundleView.value = 'all'
    }
  },
  { immediate: true, deep: true }
)

// Add this function to your script section
const getUnitPrice = (discountItem: Discounts): string | null => {
  if (!discountItem.quantity) return null;

  const quantity = discountItem.quantity.toLowerCase();
  let match;

  // Extract numeric value and unit from quantity string
  // Look for common patterns like "500g", "1kg", "1.5L", "750ml", etc.
  if (match = quantity.match(/(\d+(?:\.\d+)?)\s*([kgml]+)/i)) {
    const [_, value, unit] = match;
    let numericValue = parseFloat(value);
    let normalized = '';

    // Normalize to kg or L for consistent comparison
    if (unit.toLowerCase() === 'g') {
      numericValue = numericValue / 1000; // Convert g to kg
      normalized = 'kg';
    } else if (unit.toLowerCase() === 'kg') {
      normalized = 'kg';
    } else if (unit.toLowerCase() === 'ml') {
      numericValue = numericValue / 1000; // Convert ml to L
      normalized = 'L';
    } else if (unit.toLowerCase() === 'l') {
      normalized = 'L';
    } else {
      return null; // Unrecognized unit
    }

    // Calculate price per unit
    const unitPrice = discountItem.discount_price / numericValue;

    // Format with appropriate unit
    return `${unitPrice.toFixed(2)}€/${normalized}`;
  }

  return null;
}

// Add this function to clear the bundle view
const clearBundleView = () => {
  // Set bundle view back to showing all results
  bundleView.value = 'all'

  // Animate the transition when switching views
  setupAnimation(filteredResults.value.length)
}
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c2c2c;
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
  color: #4a90e2;
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
  color: #2c2c2c;
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

.grid [class*='col-'] {
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

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  justify-content: flex-end;
  cursor: pointer;
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

/* Update the price container to accommodate unit price */
.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 12px;
}

/* Keep the original price and discount price on same line */
.price-container .discount-price-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* Add this to your style section */
.unit-price {
  font-size: 0.9rem;
  color: #666;
  display: block;
  text-align: right;
  margin-top: 0.25rem;
  font-weight: 500;
  background: rgba(76, 175, 80, 0.06);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Add these styles */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.9rem;
  color: #666;
}

.sort-dropdown {
  width: 180px;
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

/* Add these styles */
.active-search-terms {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 8px;
}

.search-term-badge {
  background: #4a90e2;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Update the bundle-buttons class to center the buttons */
.bundle-buttons {
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  gap: 2rem; /* Increase the space between buttons */
  margin: 1.5rem 0; /* Add margin above and below */
}

.bundle-button {
  flex: 0 1 auto; /* Change from flex: 1 to prevent stretching */
  min-width: 180px; /* Set a minimum width */
  max-width: 250px; /* Set a maximum width */
  padding: 0.75rem 1rem !important;
  min-height: 60px;
}

/* Keep your existing button styles */
.bundle-button-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.bundle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.1rem;
}

.bundle-title {
  font-size: 1.2rem !important;
  font-weight: 600;
}

/* Add responsive adjustments */
@media (max-width: 768px) {
  .bundle-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .bundle-button {
    width: 100%;
    max-width: 300px;
  }
}

/* Add these styles for the bundle description section */
.bundle-description {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.description-content {
  position: relative;
  padding-left: 1.25rem;
  border-left: 4px solid #4a90e2;
}

.description-content p {
  color: #4a90e2;
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
}

.savings {
  color: #4a90e2;
  font-size: 1.2rem;
}

.savings-amount, .store-name-highlight {
  font-weight: 700;
  font-size: 1.4rem;
  color: #4a90e2;
}

.bundle-active-bar {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(74, 144, 226, 0.2);
  display: flex;
  justify-content: flex-end;
}
</style>
