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
      <div class="flex justify-content-between align-items-center">
        <p class="m-0">An item from you wishlist is on sale now!</p>
        <div class="top-row">
          <p class="item-name">🍌 {{ discountItem.item_description }}</p>
          <p class="m-0">{{ discountItem.store }}</p>
        </div>
        <div class="bottom-row">
          <p class="m-0">
            <span class="discount-price">€{{ discountItem.discount_price.toFixed(2) }}</span>
            <span class="discount-percentage">-{{ discountItem.discount_percentage }}%</span>
          </p>
          <p class="m-0">
            <span class="original-price">€{{ calculateOriginalPrice() }}</span>
          </p>
        </div>
        <Button @click="seeMore" label="See more!" class="w-full" />
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
  item_description: 'Banane',
  discount_price: 1.15,
  discount_percentage: 40,
  store: Store.Lidl,
  offer_start_date: '2021-01-01',
  offer_end_date: '2021-01-01',
  trending_score: 10,
  quantity: '1 kg',
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
.discount-percentage {
  background-color: #f0f0f0;
  color: #ff0000;
  padding: 4px 8px;
  border-radius: 4px;
}

.discount-price {
  font-weight: bold;
  font-size: 1.2rem;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
}

.item-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 1.2rem;
}

.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
