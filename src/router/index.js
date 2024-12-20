import { createRouter, createWebHistory } from 'vue-router'
import SplashPage from '@/pages/SplashPage.vue'
import LoginPage from '@/pages/Login.vue'
import Projects from '@/pages/Projects.vue'
import SingleProject from '@/pages/SingleProject.vue'
import Materials from '@/pages/Materials.vue'


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
  },
  {
    path: '/projects/:projectID',
    name: 'Project',
    component: SingleProject,
  },
  {
    path: '/users/:userID/materials',
    name: 'Materials',
    component: Materials,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
