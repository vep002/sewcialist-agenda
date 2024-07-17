import { createRouter, createWebHistory } from 'vue-router'
import SplashPage from '@/pages/SplashPage.vue'
import LoginPage from '@/pages/Login.vue'
import Projects from '@/pages/Projects.vue'


const routes = [
  {
    path: '/',
    name: 'SplashPage',
    component: SplashPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/users/:userID/projects',
    name: 'Projects',
    component: Projects,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
