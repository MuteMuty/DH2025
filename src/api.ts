import axios from 'axios'
import type { Discounts } from '@/types'

type QueryObject = {
  sortBy?: string
  sortOrder?: string
  limit?: number
  name?: string
}

// API base URL
const API_BASE_URL = 'https://goldfish-app-w3ydc.ondigitalocean.app/api'

// Search products
export const searchProductsApi = async (query: QueryObject): Promise<Discounts[]> => {
  try {
    const queryParams = new URLSearchParams()
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: queryParams },
    })
    return response.data
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

export const getTrendingItemsApi = async (): Promise<Discounts[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trending`)
    return response.data
  } catch (error) {
    console.error('Error getting trending items:', error)
    throw error
  }
}
// Shopping Cart operations
export const getCartItemsApi = async (userId: string): Promise<Discounts[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shoppingCart`, {
      params: { userId },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

export const addToCartApi = async (userId: string, discountId: Discounts['_id']): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/shoppingCart`, {
      userId,
      discountId,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

export const notificationsSignUpApi = async (
  userId: string,
  firebaseToken: string,
): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/notifications`, {
      userId,
      firebaseToken,
    })
    return response.data
  } catch (error) {
    console.error('Error sending notifications:', error)
    throw error
  }
}
