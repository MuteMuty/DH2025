import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Discounts } from '@/types'
import { searchProductsApi, getCartItemsApi, addToCartApi } from '@/api'

export const useAppStore = defineStore('appStore', () => {
  const userId = ref<string>('')
  const shoppingCart = ref<Discounts[]>([])
  const searchResults = ref<Discounts[]>([])
  const trendingItems = ref<Discounts[]>([])

  async function addToCart(discountItem: Discounts) {
    try {
      await addToCartApi(userId.value, discountItem.id)
      shoppingCart.value.push(discountItem)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  async function getShoppingCart() {
    try {
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
  return { shoppingCart, addToCart, getShoppingCart, searchProducts, getTrendingItems }
})
