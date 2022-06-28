import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Install from '@/views/Install.vue'
import Home from '@/views/Home.vue'
import OrderDetail from '@/views/OrderDetail.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/install',
    name: 'Install',
    component: Install
  },
  {
    path: '/',
    redirect: '/install'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/order-detail',
    name: 'Order Detail',
    component: OrderDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
