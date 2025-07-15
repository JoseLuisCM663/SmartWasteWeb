import { createRouter, createWebHistory } from 'vue-router';
import Landing from '@/views/Landing.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } // más adelante protegemos esta ruta
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
