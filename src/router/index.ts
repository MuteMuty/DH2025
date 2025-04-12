import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ShoppingCartView from '../views/ShoppingCartView.vue'
import TrendingView from '../views/TrendingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: ShoppingCartView,
    },
    {
      path: '/trending',
      name: 'trending',
      component: TrendingView,
    },
  ],
})

export default router
