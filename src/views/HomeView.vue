<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <img src="/SavingGrace-logo.png" alt="The Saving Grace" class="hero-logo" />
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
          <div v-show="animateDeals[index]" class="card product-card fade-in">
            <div class="discount-tag">-{{ discountItem.discount_percentage }}%</div>
            <div class="store-tag">
              <img
                :src="`/stores-imgs/${discountItem.store.toLowerCase()}-img.png`"
                :alt="discountItem.store"
                class="store-logo"
              />
              <span class="store-name">{{ discountItem.store }}</span>
            </div>
            <div class="product-details">
              <h3>{{ discountItem.item_description }}</h3>
              <div class="validity-period">
                <i class="pi pi-calendar"></i>
                <span
                  >{{ formatDate(discountItem.offer_start_date) }} -
                  {{ formatDate(discountItem.offer_end_date) }}</span
                >
              </div>
              <div class="price-container">
                <span class="original-price">{{ getOgPrice(discountItem) }}€</span>
                <span class="discount-price">{{ discountItem.discount_price.toFixed(2) }}€</span>
              </div>
            </div>
            <Button
              icon="pi pi-shopping-cart"
              :label="isInCart(discountItem) ? 'Already in Cart' : 'Add to Cart'"
              :disabled="isInCart(discountItem)"
              @click="store.addToCart(discountItem)"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { type Discounts } from '@/types'

function getOgPrice(discountItem: Discounts) {
  return (discountItem.discount_price / (1 - discountItem.discount_percentage / 100)).toFixed(2)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate()}.${date.getMonth() + 1}`
}

function isInCart(discountItem: Discounts) {
  console.log('store.shoppingCart', store.shoppingCart)
  // @ts-ignore
  return store.shoppingCart.some((item) => item.discount._id === discountItem._id)
}

const router = useRouter()
const store = useAppStore()

onMounted(async () => {
  store.loadTrendingItems()
  store.getShoppingCart()
})

// Animation state
const animateDeals = ref([false, false, false, false])

// Start animation sequence when component is mounted
onMounted(() => {
  // Animate deal cards with staggered delay
  setTimeout(() => {
    animateDeals.value[0] = true
  }, 200)
  setTimeout(() => {
    animateDeals.value[1] = true
  }, 400)
  setTimeout(() => {
    animateDeals.value[2] = true
  }, 600)
  setTimeout(() => {
    animateDeals.value[3] = true
  }, 800)
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.hero-section {
  padding: 1.5rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  margin: 1rem auto 2rem;
  max-width: 1400px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
  color: #2c2c2c;
  font-weight: 700;
  background: linear-gradient(120deg, #2c2c2c 0%, #4caf50 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.trending-section {
  margin-bottom: 2rem;
}

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

/* Remove the old store color classes since we're using images now */
.store-Lidl,
.store-Hofer,
.store-Spar,
.store-Mercator,
.store-Eurospin {
  background: transparent;
  color: transparent;
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

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}

/* Animation styles */
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

  .hero-logo {
    height: 80px;
  }
}

.hero-logo {
  height: 120px;
  width: auto;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}
</style>
