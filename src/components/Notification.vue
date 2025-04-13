<template>
  <Dialog
    v-model:visible="useAppStore().isNotificationVisible"
    :style="{ width: '25rem' }"
    position="bottom"
    :modal="true"
    :draggable="false"
    header="New discount found!"
  >
    <template v-if="discountItem">
      <div class="notification-container">
        <p class="notification-message">An item from your wishlist is on sale now!</p>

        <div class="product-info">
          <div class="product-header">
            <p class="item-name">🍺 {{ discountItem.item_description }}</p>
            <p class="store-name">{{ discountItem.store }}</p>
          </div>

          <div class="price-container">
            <div class="discount-info">
              <span class="discount-price">€{{ discountItem.discount_price.toFixed(2) }}</span>
              <span class="discount-percentage">-{{ discountItem.discount_percentage }}%</span>
            </div>
            <span class="original-price">€{{ calculateOriginalPrice() }}</span>
          </div>
        </div>

        <Button @click="seeMore" label="See more!" class="see-more-btn" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import { Store, type Discounts } from '@/types'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const discountItem: Discounts = {
  _id: '1',
  item_description: 'Pivo Laško Zlatorog 0.5L',
  discount_price: 0.89,
  discount_percentage: 25,
  store: Store.Mercator,
  offer_start_date: '2025-04-10',
  offer_end_date: '2025-04-17',
  trending_score: 10,
  quantity: '0.5 L',
  bounding_box: {
    x: 10,
    y: 10,
    width: 10,
    height: 10,
  },
}

function seeMore() {
  useAppStore().isNotificationVisible = false
  router.push({
    path: '/shopping-cart',
  })
}

const calculateOriginalPrice = () => {
  const price = discountItem.discount_price
  const percentage = discountItem.discount_percentage
  return (price / (1 - percentage / 100)).toFixed(2)
}
</script>

<style scoped>
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-message {
  font-size: 1rem;
  color: #4d4d4d;
  margin: 0;
}

.product-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.item-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.store-name {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discount-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.discount-price {
  font-weight: bold;
  font-size: 1.3rem;
  color: #212121;
}

.discount-percentage {
  background-color: #ffeeee;
  color: #e53935;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
  font-size: 0.9rem;
}

.see-more-btn {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
