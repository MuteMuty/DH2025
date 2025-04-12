export type Discounts = {
  id: string
  name: string
  discount: number
  originalPrice: number
  discountPrice: number
  store: Store
  trendingScore: number
}

export type Store = {
  name: 'Lidl' | 'Hofer' | 'Spar' | 'Mercator'
}
