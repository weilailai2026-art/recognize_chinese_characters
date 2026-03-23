import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Parent from '../views/Parent.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/game', component: Game },
  { path: '/parent', component: Parent },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
