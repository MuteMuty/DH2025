import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Discounts = {
  id: string
  name: string
  discount: number
  originalPrice: number
  discountPrice: number
  store: Store
}

type Store = {
  name: 'Lidl' | 'Hofer' | 'Spar' | 'Mercator'
}

export const useAppStore = defineStore('appStore', () => {
  const discounts = ref<Discounts[]>([])

  return { discounts }
})
