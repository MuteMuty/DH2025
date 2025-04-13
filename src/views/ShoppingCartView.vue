<template>
  <div class="cart-container">
    <h1>Wishlist Cart</h1>

    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #4a90e2"></i>
      <p>Loading your cart...</p>
    </div>

    <div v-else-if="!cartItems.length" class="empty-cart">
      <i class="pi pi-shopping-cart" style="font-size: 3rem; color: #ccc"></i>
      <h3>Your wishlist is empty</h3>
      <p>Discover amazing deals and add them to your cart!</p>
      <Button label="Browse Deals" @click="$router.push('/trending')" />
    </div>

    <div v-else class="cart-content">
      <!-- Cart summary at the top -->

      <!-- Products displayed in grid layout, same as other pages -->
      <div class="grid">
        <div
          class="col-12 sm:col-6 lg:col-3"
          v-for="(cartItem, index) in cartItems"
          :key="cartItem.cart_item_id"
        >
          <div v-show="animateItems[index]" class="card product-card fade-in">
            <div class="discount-tag" v-if="cartItem.discount.discount_percentage">
              -{{ cartItem.discount.discount_percentage }}%
            </div>
            <div class="store-tag" :class="`store-${cartItem.discount.store.toLowerCase()}`">
              {{ cartItem.discount.store }}
            </div>
            <div class="product-details">
              <h3>{{ cartItem.discount.item_description }}</h3>
              <div class="price-container">
                <span class="original-price" v-if="cartItem.discount.discount_percentage">
                  {{ getOriginalPrice(cartItem.discount) }}€
                </span>
                <span class="discount-price"
                  >{{ cartItem.discount.discount_price.toFixed(2) }}€</span
                >
              </div>
              <div class="quantity-tag">{{ cartItem.discount.quantity }}</div>
              <div class="date-added">Added: {{ formatDate(cartItem.added_date) }}</div>
            </div>
            <Button
              icon="pi pi-trash"
              label="Remove from Cart"
              severity="danger"
              @click="removeItemFromCart(cartItem)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal ({{ cartItems.length }} items)</span>
        <span>{{ getTotalPrice() }}€</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span class="total-price">{{ getTotalPrice() }}€</span>
      </div>
      <div class="summary-savings" v-if="parseFloat(getTotalSavings()) > 0">
        <span>You saved</span>
        <span class="savings-amount">{{ getTotalSavings() }}€</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import Button from 'primevue/button'

interface CartItem {
  cart_item_id: string
  added_date: string
  discount: {
    _id: string
    item_description: string
    discount_price: number
    discount_percentage: number
    store: string
    quantity: string
    offer_start_date: string
    offer_end_date: string
    trending_score: number
    bounding_box: {
      x: number
      y: number
      width: number
      height: number
    }
  }
}

const store = useAppStore()
const loading = ref(true)
const cartItems = ref<CartItem[]>([])
// Add animation state array
const animateItems = ref<boolean[]>([])

// Format the date to be more user friendly
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Calculate original price from discount price and percentage
const getOriginalPrice = (discount: CartItem['discount']): string => {
  if (!discount.discount_percentage) return discount.discount_price.toFixed(2)
  return (discount.discount_price / (1 - discount.discount_percentage / 100)).toFixed(2)
}

// Load cart data when component is mounted
onMounted(async () => {
  try {
    await store.getShoppingCart()

    // Convert the store's shopping cart to the proper format
    if (Array.isArray(store.shoppingCart)) {
      if (store.shoppingCart.length > 0 && 'cart_item_id' in store.shoppingCart[0]) {
        // If the API already returns the correct format, use it directly
        cartItems.value = store.shoppingCart as unknown as CartItem[]
      } else {
        // Otherwise, format the item to match the expected cart item structure
        cartItems.value = store.shoppingCart.map(
          (item) =>
            ({
              cart_item_id: item._id,
              added_date: new Date().toISOString(),
              discount: item,
            }) as unknown as CartItem,
        )
      }

      // Setup animation for cart items
      setupAnimation(cartItems.value)
    }
  } finally {
    loading.value = false
  }
})

// Calculate total price
const getTotalPrice = (): string => {
  return cartItems.value.reduce((total, item) => total + item.discount.discount_price, 0).toFixed(2)
}

// Calculate total savings
const getTotalSavings = (): string => {
  return cartItems.value
    .reduce((total, item) => {
      if (!item.discount.discount_percentage) return total
      const originalPrice =
        item.discount.discount_price / (1 - item.discount.discount_percentage / 100)
      return total + (originalPrice - item.discount.discount_price)
    }, 0)
    .toFixed(2)
}

// Remove item from cart
const removeItemFromCart = async (item: CartItem) => {
  // Show loading state if desired
  loading.value = true

  try {
    // Call the API through the store
    const success = await store.removeFromCart(item.discount._id)

    if (success) {
      // Remove from local array only if API call succeeds
      const index = cartItems.value.findIndex(
        (cartItem) => cartItem.cart_item_id === item.cart_item_id,
      )
      if (index !== -1) {
        cartItems.value.splice(index, 1)

        // Reset animation states for remaining items
        animateItems.value = animateItems.value.filter((_, idx) => idx !== index)
      }
    }
  } catch (error) {
    console.error('Failed to remove item from cart:', error)
    // Optional: show error message
  } finally {
    loading.value = false
  }
}

// Add this function to handle animation setup
const setupAnimation = (items: CartItem[]) => {
  // Reset animation states
  animateItems.value = new Array(items.length).fill(false)

  // Stagger the animations
  for (let i = 0; i < items.length; i++) {
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
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c2c2c;
  font-weight: 600;
}

.loading-container,
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
  color: #666666;
}

.loading-container p {
  margin-top: 1rem;
}

.empty-cart h3 {
  margin-top: 1rem;
  color: #2c2c2c;
}

.empty-cart p {
  margin: 1rem 0 2rem;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Cart summary */
.cart-summary {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.summary-row.total {
  border-top: 1px solid #e0e0e0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.total-price {
  color: #4a90e2;
}

.summary-savings {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #f3fbf4;
  border-radius: 8px;
  color: #4caf50;
  font-weight: 500;
}

.savings-amount {
  font-weight: bold;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cart-actions button {
  flex: 1;
}

/* Grid layout - same as in HomeView and SearchView */
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

/* Product card styles - same as in HomeView and SearchView */
.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.product-card {
  position: relative;
  padding: 1.5rem;
  height: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  justify-content: flex-end;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.discount-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff6b6b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0 12px 0 12px;
  font-weight: bold;
}

.store-tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px 0 12px 0;
  color: white;
  font-weight: bold;
}

.store-lidl {
  background: #0050aa;
}
.store-hofer {
  background: #e30613;
}
.store-spar {
  background: #008c45;
}
.store-mercator {
  background: #ce1126;
}
.store-eurospin {
  background: #0066cc;
}

.product-details {
  margin: 1.5rem 0;
}

.product-details h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #2c2c2c;
  font-weight: 600;
  line-height: 1.4;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
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

.quantity-tag {
  color: #666666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.date-added {
  color: #666666;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .cart-actions {
    flex-direction: column;
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
