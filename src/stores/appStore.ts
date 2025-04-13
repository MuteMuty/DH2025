import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Discounts } from '@/types'
import {
  searchProductsApi,
  getCartItemsApi,
  addToCartApi,
  removeFromCartApi, // Add this import
  notificationsSignUpApi,
  getTrendingItemsApi,
} from '@/api'
import { initFirebase, initMessagingAndRequestNotificationPermission } from '@/firebase'
import { getOrCreateUserId } from '@/utils'

export const useAppStore = defineStore('appStore', () => {
  const shoppingCart = ref<Discounts[]>([])
  const searchResults = ref<Discounts[]>([])
  const trendingDiscounts = ref<Discounts[]>([])
  const biggestDiscounts = ref<Discounts[]>([])

  const firebaseToken = ref<string | null>(null)
  const userId = ref<string | null>(null)

  const isNotificationVisible = ref(false)

  async function addToCart(discountItem: Discounts) {
    try {
      console.log('Adding to cart:', discountItem)
      console.log('User ID:', userId.value)
      if (!userId.value) {
        throw new Error('User ID is not set')
      }
      await addToCartApi(userId.value, discountItem._id)
      shoppingCart.value.push(discountItem)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  async function removeFromCart(cartItemId: string) {
    try {

      if (!userId.value) {
        userId.value = getOrCreateUserId()
      }
      await removeFromCartApi(userId.value, cartItemId)

      // Remove the item from the local shopping cart array
      const index = shoppingCart.value.findIndex(item =>
        'cart_item_id' in item
          ? item.cart_item_id === cartItemId
          : item._id === cartItemId
      )

      if (index !== -1) {
        shoppingCart.value.splice(index, 1)
      }

      return true
    } catch (error) {
      console.error('Error removing from cart:', error)
      return false
    }
  }

  async function getShoppingCart() {
    try {
      if (!userId.value) {
        throw new Error('User ID is not set')
      }
      const fetchedShoppingCart = await getCartItemsApi(userId.value)
      shoppingCart.value = fetchedShoppingCart
    } catch (error) {
      console.error('Error getting shopping cart:', error)
    }
  }

  async function searchProducts({
    name,
    orderBy,
    sortOrder,
  }: {
    name?: string
    orderBy: string
    sortOrder: 'asc' | 'desc'
  }) {
    const query = { name, orderBy, sortOrder }
    try {
      const response = await searchProductsApi(query)
      // Handle both array response and object with items array
      const fetchedSearchResults = Array.isArray(response) ? response : response || []
      searchResults.value = fetchedSearchResults
      console.log('Search results:', fetchedSearchResults)
      return fetchedSearchResults
    } catch (error) {
      console.error('Error searching products:', error)
      searchResults.value = []
      return []
    }
  }

  async function loadTrendingItems() {
    console.log('Loading trending items')
    try {
      const fetchedTrendingItems = await getTrendingItemsApi()
      trendingDiscounts.value = fetchedTrendingItems
    } catch (error) {
      console.error('Error getting trending items:', error)
    }
  }

  async function notificationsSignUp() {
    try {
      if (!userId.value || !firebaseToken.value) {
        throw new Error('User ID or Firebase token is not set')
      }
      await notificationsSignUpApi(userId.value, firebaseToken.value)
    } catch (error) {
      console.error('Error signing up for notifications:', error)
    }
  }

  async function init() {
    userId.value = getOrCreateUserId()
    console.log('User ID:', userId.value)
    initFirebase()
    const token = await initMessagingAndRequestNotificationPermission()
    if (!token) {
      throw new Error('Failed to get firebase token')
    }
    firebaseToken.value = token
  }

  async function loadBiggestDiscounts() {
    console.log('Loading biggest discounts')
    try {
      // Sort trending items by discount percentage for now
      const items = [...trendingDiscounts.value]
      items.sort((a, b) => b.discount_percentage - a.discount_percentage)
      biggestDiscounts.value = items.slice(0, 4)
    } catch (error) {
      console.error('Error getting biggest discounts:', error)
    }
  }

  return {
    isNotificationVisible,
    trendingDiscounts,
    searchResults,
    shoppingCart,
    biggestDiscounts,
    addToCart,
    removeFromCart, // Add this
    getShoppingCart,
    searchProducts,
    loadTrendingItems,
    loadBiggestDiscounts,
    init,
  }
})
