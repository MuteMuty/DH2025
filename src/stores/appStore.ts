import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Discounts } from '@/types'
import { searchProductsApi, getCartItemsApi, addToCartApi, notificationsSignUpApi } from '@/api'
import { initFirebase, initMessagingAndRequestNotificationPermission } from '@/firebase'
import { getOrCreateUserId } from '@/utils'

export const useAppStore = defineStore('appStore', () => {
  const shoppingCart = ref<Discounts[]>([])
  const searchResults = ref<Discounts[]>([])
  const trendingItems = ref<Discounts[]>([])

  const firebaseToken = ref<string | null>(null)
  const userId = ref<string | null>(null)

  async function addToCart(discountItem: Discounts) {
    try {
      if (!userId.value) {
        throw new Error('User ID is not set')
      }
      await addToCartApi(userId.value, discountItem.id)
      shoppingCart.value.push(discountItem)
    } catch (error) {
      console.error('Error adding to cart:', error)
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
      const fetchedSearchResults = await searchProductsApi(query)
      searchResults.value = fetchedSearchResults
    } catch (error) {
      console.error('Error searching products:', error)
    }
  }

  async function getTrendingItems() {
    const query = { sortBy: 'tredingScore', sortOrder: 'desc' }
    try {
      const fetchedTrendingItems = await searchProductsApi(query)
      trendingItems.value = fetchedTrendingItems
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
    initFirebase()
    const token = await initMessagingAndRequestNotificationPermission()
    if (!token) {
      throw new Error('Failed to get firebase token')
    }
    firebaseToken.value = token
  }

  return {
    shoppingCart,
    addToCart,
    getShoppingCart,
    searchProducts,
    getTrendingItems,
    init,
  }
})
