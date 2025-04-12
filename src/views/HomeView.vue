<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1>The Saving Grace</h1>
        <p class="subtitle">Find the best discounts from your favorite stores</p>
        <div class="search-box">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="Search for products..." @keyup.enter="searchProducts" />
          </span>
          <Button label="Search" icon="pi pi-search" @click="searchProducts" />
        </div>
      </div>
    </section>

    <section class="nav-cards-section">
      <div class="grid">
        <div class="col-12 md:col-4" v-for="item in navItems" :key="item.label">
          <div class="card nav-card" @click="$router.push(item.route)">
            <div class="card-header">
              <i :class="item.icon" />
            </div>
            <div class="card-body">
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="trending-section">
      <div class="section-header">
        <h2>Latest Deals</h2>
        <Button label="See All Deals" icon="pi pi-arrow-right" text @click="$router.push('/trending')" />
      </div>

      <div class="grid">
        <div class="col-12 sm:col-6 lg:col-3" v-for="product in latestDeals" :key="product.id">
          <div class="card product-card">
            <div class="discount-tag">-{{ product.discount }}%</div>
            <div class="store-tag" :class="`store-${product.store.name.toLowerCase()}`">
              {{ product.store.name }}
            </div>
            <div class="product-details">
              <h3>{{ product.name }}</h3>
              <div class="price-container">
                <span class="original-price">€{{ product.originalPrice.toFixed(2) }}</span>
                <span class="discount-price">€{{ product.discountPrice.toFixed(2) }}</span>
              </div>
            </div>
            <Button icon="pi pi-shopping-cart" label="Add to Cart" @click="addToCart(product)" />
          </div>
        </div>
      </div>
    </section>

    <section class="stores-section">
      <h2>Popular Stores</h2>
      <div class="stores-grid">
        <div class="store-item" v-for="store in stores" :key="store.name" @click="$router.push(`/search?store=${store.name}`)">
          <div class="store-logo" :class="`bg-${store.name.toLowerCase()}`">
            <span>{{ store.name[0] }}</span>
          </div>
          <span class="store-name">{{ store.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import { useAppStore } from '@/stores/counter'

// Define types based on your store structure
interface Store {
  name: 'Lidl' | 'Hofer' | 'Spar' | 'Mercator'
}

interface Product {
  id: string
  name: string
  discount: number
  originalPrice: number
  discountPrice: number
  store: Store
}

const router = useRouter()
const store = useAppStore()
const searchQuery = ref('')

// Navigation items for the cards section
const navItems = [
  {
    label: 'Shopping Cart',
    icon: 'pi pi-shopping-cart',
    route: '/shopping-cart',
    description: 'View and manage items in your cart'
  },
  {
    label: 'Trending Deals',
    icon: 'pi pi-trending-up',
    route: '/trending',
    description: 'See what products are trending now'
  },
  {
    label: 'Search Products',
    icon: 'pi pi-search',
    route: '/search',
    description: 'Find products across all stores'
  }
]

// Mock data for stores
const stores = [
  { name: 'Lidl' },
  { name: 'Hofer' },
  { name: 'Spar' },
  { name: 'Mercator' }
]

// Mock data for latest deals
const latestDeals = ref<Product[]>([
  {
    id: '1',
    name: 'Fresh Milk 1L',
    discount: 20,
    originalPrice: 1.29,
    discountPrice: 1.03,
    store: { name: 'Lidl' }
  },
  {
    id: '2',
    name: 'Whole Grain Bread',
    discount: 30,
    originalPrice: 2.49,
    discountPrice: 1.74,
    store: { name: 'Hofer' }
  },
  {
    id: '3',
    name: 'Free Range Eggs (10)',
    discount: 15,
    originalPrice: 3.45,
    discountPrice: 2.93,
    store: { name: 'Spar' }
  },
  {
    id: '4',
    name: 'Organic Apples (1kg)',
    discount: 25,
    originalPrice: 2.99,
    discountPrice: 2.24,
    store: { name: 'Mercator' }
  }
])

// Function to handle search
const searchProducts = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
  }
}

// Function to add product to cart
const addToCart = (product: Product) => {
  // In a real app, you would add the product to the cart in the store
  console.log('Added to cart:', product)
  // For now, just navigate to cart
  router.push('/shopping-cart')
}
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
  color: var(--primary-color, #4CAF50);
}

.subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card-header i {
  font-size: 2.5rem;
  color: var(--primary-color, #4CAF50);
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

.trending-section, .stores-section {
  margin-bottom: 2rem;
}

.product-card {
  position: relative;
  padding: 1.5rem;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.discount-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #FF5252;
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

.product-details {
  margin: 1.5rem 0;
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
  color: #4CAF50;
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
  background-color: #0050AA;
}

.bg-hofer {
  background-color: #E30613;
}

.bg-spar {
  background-color: #008C45;
}

.bg-mercator {
  background-color: #CE1126;
}

.store-name {
  font-weight: bold;
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
