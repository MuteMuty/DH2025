import axios from 'axios'
import type { Discounts } from '@/types'

// API base URL
const API_BASE_URL = 'https://goldfish-app-w3ydc.ondigitalocean.app/api'

// Search products
export const searchProductsApi = async (query: {
  name?: string;
  orderBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  q?: string;
}): Promise<Discounts[]> => {
  try {
    console.log('API search request with params:', query)
    // Make sure we're sending the right parameters
    const params: Record<string, string | number | undefined> = {};

    if (query.name) {
      params.query = query.name; // API expects 'q' parameter
    }
    if (query.q) {
      params.q = query.q;
    }
    if (query.orderBy) {
      params.orderBy = query.orderBy;
    }
    if (query.sortOrder) {
      params.sortOrder = query.sortOrder;
    }
    if (query.limit) {
      params.limit = query.limit;
    }

    const response = await axios.get(`${API_BASE_URL}/search`, {
      params
    });
    console.log('API search response:', response.data);

    // Process the response to handle both formats and ensure consistent output
    const items = response.data.items || response.data;

    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
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
    const response = await axios.get(`${API_BASE_URL}/shopping-cart/${userId}`);
    return response.data
  } catch (error) {
    console.error('Error fetching cart items:', error)
    throw error
  }
}

export const addToCartApi = async (userId: string, discountId: Discounts['_id']): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/shopping-cart`, {
      user_id: userId,
      discount_id: discountId,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
  console.log('UserID:', userId)
  console.log('DiscountID:', discountId)
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
