import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Parent from '../views/Parent.vue'
import Pricing from '../views/Pricing.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import PaymentCancel from '../views/PaymentCancel.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/game', component: Game },
  { path: '/parent', component: Parent },
  { path: '/pricing', component: Pricing },
  { path: '/payment-success', component: PaymentSuccess },
  { path: '/payment-cancel', component: PaymentCancel },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
