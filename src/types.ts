type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
}

export type Discounts = {
  _id: string
  item_description: string
  discount_price: number
  discount_percentage: number
  store: Store
  offer_start_date: string
  offer_end_date: string
  trending_score: number
  quantity: string
  bounding_box: BoundingBox
}

export enum Store {
  Lidl = 'Lidl',
  Hofer = 'Hofer',
  Spar = 'Spar',
  Mercator = 'Mercator',
  Eurospin = 'Eurospin',
}
