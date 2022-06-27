import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Install from '@/views/Install.vue'
import Home from '@/views/Home.vue'
import AddInformation from '@/views/AddInformation.vue'

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
    path: '/addInfo',
    name: 'AddInformation',
    component: AddInformation
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
