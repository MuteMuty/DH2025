<template>
  <Dialog
    v-model:visible="localVisible"
    :modal="true"
    :style="{ width: '90%', maxWidth: '800px' }"
    :header="product?.item_description || 'Product Details'"
    :dismissableMask="true"
  >
    <div class="product-detail-popup" v-if="product">
      <div class="popup-content">
        <div class="product-image-container">
          <!-- Product image for specific products -->
          <img
            v-if="product.item_description === 'SARAJEVSKI ČEVAPČIČI'"
            src="/product1.png"
            alt="Product Image"
            class="product-image"
          />
          <img
            v-if="product.item_description === 'Merlot'"
            src="/product2.png"
            alt="Product Image"
            class="product-image"
          />
          <!-- Store logo watermark -->
          <img
            :src="`/stores-imgs/${product.store.toLowerCase()}-img.png`"
            alt="Store Logo"
            class="store-watermark"
          />

          <div class="discount-badge" v-if="product.discount_percentage">
            -{{ product.discount_percentage }}%
          </div>
        </div>

        <div class="product-info">
          <div class="store-badge">
            {{ product.store }}
          </div>

          <div class="price-section">
            <div class="price-container">
              <span class="original-price" v-if="product.discount_percentage">
                {{ getOriginalPrice(product) }}€
              </span>
              <span class="discount-price">{{ product.discount_price.toFixed(2) }}€</span>
            </div>
            <div class="quantity">{{ product.quantity }}</div>
          </div>

          <div class="validity-period">
            <i class="pi pi-calendar"></i>
            <span>Valid from {{ formatDate(product.offer_start_date) }} to {{ formatDate(product.offer_end_date) }}</span>
          </div>

          <div class="trending-info" v-if="product.trending_score">
            <i class="pi pi-chart-line"></i>
            <span>Trending Score: {{ product.trending_score }}</span>
          </div>

          <div class="action-buttons">
            <Button
              :icon="isInCart(product) ? 'pi pi-check' : 'pi pi-star'"
              :label="isInCart(product) ? 'In Your Wishlist' : 'Add to Wishlist'"
              :disabled="isInCart(product)"
              @click="addToCart"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useAppStore } from '@/stores/appStore'
import type { Discounts } from '@/types'

// Define a type for cart items
interface CartItem {
  cart_item_id?: string;
  added_date?: string;
  discount?: Discounts;
  _id?: string;
}

const props = defineProps<{
  visible: boolean,
  product: Discounts | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'add-to-cart': [product: Discounts]
}>()

// Create a local reactive reference for the dialog visibility
const localVisible = ref(props.visible)

// Watch for changes to props.visible and update localVisible
watch(() => props.visible, (newValue) => {
  localVisible.value = newValue
})

// Watch for changes to localVisible and emit update:visible event
watch(localVisible, (newValue) => {
  emit('update:visible', newValue)
})

const store = useAppStore()

// Add to cart handler
const addToCart = () => {
  if (props.product && !isInCart(props.product)) {
    store.addToCart(props.product)
    emit('add-to-cart', props.product)
  }
}

// Helper functions
const getOriginalPrice = (product: Discounts): string => {
  if (!product.discount_percentage) return product.discount_price.toFixed(2)
  return (product.discount_price / (1 - product.discount_percentage / 100)).toFixed(2)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isInCart = (product: Discounts): boolean => {
  if (!product || !store.shoppingCart) return false

  return store.shoppingCart.some((item: CartItem | Discounts) => {
    // Check if item is a CartItem (has discount property)
    if ('discount' in item && item.discount) {
      return item.discount._id === product._id
    }
    // Otherwise treat as a Discounts object directly
    return item._id === product._id
  })
}
</script>

<style scoped>
.product-detail-popup {
  padding: 1rem;
}

.popup-content {
  display: flex;
  gap: 2rem;
}

.product-image-container {
  position: relative;
  flex: 0 0 40%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f5f5;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.store-watermark {
  width: 100px;
  height: auto;
  opacity: 0.2;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff5252;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
  transform: rotate(12deg);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.store-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #333;
  font-weight: bold;
  background-color: #f0f0f0;
  align-self: flex-start;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-container {
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
  font-size: 2rem;
}

.quantity {
  background-color: rgba(76, 175, 80, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #4caf50;
  font-weight: 500;
}

.validity-period, .trending-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
}

.validity-period i, .trending-info i {
  color: #4caf50;
  font-size: 1.1rem;
}

.action-buttons {
  margin-top: auto;
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .popup-content {
    flex-direction: column;
  }

  .product-image-container {
    height: 200px;
  }
}
</style>
