<template>
  <div class="trending-container">
    <div class="header">
      <h1>Trending Deals</h1>
      <p class="subtitle">Discover what other shoppers are excited about</p>
    </div>

    <div class="filters">
      <div class="sort-options">
        <span class="sort-label">Sort by:</span>
        <Button
          :class="{ active: sortBy === 'trending' }"
          label="Trending"
          text
          @click="setSortBy('trending')"
        />
        <Button
          :class="{ active: sortBy === 'discount' }"
          label="Biggest Discounts"
          text
          @click="setSortBy('discount')"
        />
        <Button
          :class="{ active: sortBy === 'price' }"
          label="Lowest Prices"
          text
          @click="setSortBy('price')"
        />
      </div>
    </div>

    <div class="grid">
      <div
        class="col-12 sm:col-6 lg:col-3"
        v-for="(discountItem) in sortedDiscounts"
        :key="discountItem._id"
      >
        <div class="card product-card fade-in">
          <div v-if="discountItem.discount_percentage > 0" class="discount-tag">
            -{{ discountItem.discount_percentage }}%
          </div>
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
              <span>{{ formatDate(discountItem.offer_start_date) }} - {{ formatDate(discountItem.offer_end_date) }}</span>
            </div>
            <div class="price-container">
              <span class="original-price">{{ getOgPrice(discountItem) }}€</span>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { type Discounts } from '@/types'

const store = useAppStore()
const sortBy = ref('trending')

function getOgPrice(discountItem: Discounts) {
  return (discountItem.discount_price / (1 - discountItem.discount_percentage / 100)).toFixed(2)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getDate()}.${date.getMonth() + 1}`
}

function isInCart(discountItem: Discounts) {
  return store.shoppingCart.some((item) => item._id === discountItem._id)
}

function setSortBy(type: string) {
  sortBy.value = type
}

const sortedDiscounts = computed(() => {
  const items = [...store.trendingDiscounts]
  switch (sortBy.value) {
    case 'discount':
      return items.sort((a, b) => b.discount_percentage - a.discount_percentage)
    case 'price':
      return items.sort((a, b) => a.discount_price - b.discount_price)
    default: // trending
      return items // already sorted by trending score
  }
})

onMounted(() => {
  store.loadTrendingItems()
  store.getShoppingCart()
})
</script>

<style scoped>
.trending-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--primary-color, #4caf50);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #6c757d;
}

.filters {
  margin-bottom: 2rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-label {
  color: #6c757d;
  font-weight: 500;
}

.sort-options .p-button.active {
  background-color: var(--primary-color, #4caf50);
  color: white;
}

/* Reuse existing product card styles */
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
  .header h1 {
    font-size: 2rem;
  }

  .sort-options {
    flex-wrap: wrap;
  }
}
</style>
