<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1>The Saving Grace</h1>
        <p class="subtitle">Because buying full price is a sin</p>
      </div>
    </section>

    <section class="trending-section">
      <div class="section-header">
        <h2>Trending Deals</h2>
        <Button
          label="See All Deals"
          icon="pi pi-arrow-right"
          text
          @click="$router.push('/trending')"
        />
      </div>

      <div class="grid">
        <div
          class="col-12 sm:col-6 lg:col-3"
          v-for="(discountItem, index) in store.trendingDiscounts"
          :key="discountItem._id"
        >
          <!-- Add animation with staggered delay -->
          <div v-show="animateDeals[index]" class="card product-card fade-in">
            <div class="discount-tag">-{{ discountItem.discount_percentage }}%</div>
            <div class="store-tag" :class="`store-${discountItem.store}`">
              {{ discountItem.store }}
            </div>
            <div class="product-details">
              <h3>{{ discountItem.item_description }}</h3>
              <div class="price-container">
                <span class="original-price">{{ getOgPrice(discountItem) }}€</span>
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import { useAppStore } from '@/stores/appStore'
import { Store, type Discounts } from '@/types'

function getOgPrice(discountItem: Discounts) {
  return (discountItem.discount_price / (1 - discountItem.discount_percentage / 100)).toFixed(2)
}

const router = useRouter()
const store = useAppStore()

const searchQuery = ref('')

onMounted(async () => {
  store.loadTrendingItems()
})

// Animation state
const animateNav = ref([false, false, false])
const animateDeals = ref([false, false, false, false])
const animateStores = ref([false, false, false, false])

// Navigation items for the cards section

// Mock data for stores
const stores = ref<Store[]>([Store.Lidl, Store.Hofer, Store.Spar, Store.Mercator, Store.Eurospin])

// Start animation sequence when component is mounted
onMounted(() => {
  // Animate navigation cards with staggered delay
  setTimeout(() => {
    animateNav.value[0] = true
  }, 200)
  setTimeout(() => {
    animateNav.value[1] = true
  }, 400)
  setTimeout(() => {
    animateNav.value[2] = true
  }, 600)

  // Animate deal cards with staggered delay
  setTimeout(() => {
    animateDeals.value[0] = true
  }, 800)
  setTimeout(() => {
    animateDeals.value[1] = true
  }, 1000)
  setTimeout(() => {
    animateDeals.value[2] = true
  }, 1200)
  setTimeout(() => {
    animateDeals.value[3] = true
  }, 1400)

  // Animate stores with staggered delay
  setTimeout(() => {
    animateStores.value[0] = true
  }, 1600)
  setTimeout(() => {
    animateStores.value[1] = true
  }, 1700)
  setTimeout(() => {
    animateStores.value[2] = true
  }, 1800)
  setTimeout(() => {
    animateStores.value[3] = true
  }, 1900)
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.hero-section {
  padding: 3rem 1rem;
  text-align: center;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color, #4caf50);
}

.subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.search-box .p-inputtext {
  flex-grow: 1;
  margin-right: 0.5rem;
}

.nav-cards-section {
  margin-bottom: 2rem;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  cursor: pointer;
  height: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-header i {
  font-size: 2.5rem;
  color: var(--primary-color, #4caf50);
  margin-bottom: 1rem;
}

.card-body h3 {
  margin-bottom: 0.5rem;
}

.card-body p {
  color: #6c757d;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.trending-section,
.stores-section {
  margin-bottom: 2rem;
}

.product-card {
  position: relative;
  padding: 1.5rem;
  height: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.discount-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff5252;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0 4px 0 4px;
  font-weight: bold;
}

.store-tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px 0 4px 0;
  color: white;
  font-weight: bold;
}

.store-Lidl {
  background: #0050aa;
}

.store-Hofer {
  background: #e30613;
}

.store-Spar {
  background: #008c45;
}

.store-Mercator {
  background: #ce1126;
}

.store-Eurospin {
  background: #0050aa;
}

.product-details {
  margin: 1.5rem 0;
  color: black;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
}

.discount-price {
  font-weight: bold;
  color: #4caf50;
  font-size: 1.2rem;
}

.stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.store-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.store-item:hover {
  background-color: #f8f9fa;
}

.store-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.bg-lidl {
  background-color: #0050aa;
}

.bg-hofer {
  background-color: #e30613;
}

.bg-spar {
  background-color: #008c45;
}

.bg-mercator {
  background-color: #ce1126;
}

.store-name {
  font-weight: bold;
}

/* Animation styles */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
  transition:
    opacity 0.5s,
    transform 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .search-box {
    flex-direction: column;
  }

  .search-box .p-inputtext {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

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

  .md\:col-4 {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}
</style>
