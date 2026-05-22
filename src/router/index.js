import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

function adminGuard(to, _from, next) {
  const token = localStorage.getItem('dp_admin_token')
  if (!token) return next('/admin/login')
  next()
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/',                       name: 'home',           component: HomeView },
    { path: '/checkout',               name: 'checkout',       component: () => import('../views/CheckoutView.vue') },
    { path: '/pedido/:id',             name: 'pedido',         component: () => import('../views/OrderSuccessView.vue') },
    { path: '/politica-privacidade',   name: 'privacy',        component: () => import('../views/PrivacyView.vue') },
    { path: '/termos-de-uso',          name: 'terms',          component: () => import('../views/TermsView.vue') },

    // Admin
    { path: '/admin/login',            name: 'admin-login',    component: () => import('../views/admin/AdminLoginView.vue') },
    { path: '/admin',                  name: 'admin',          component: () => import('../views/admin/AdminDashboardView.vue'), beforeEnter: adminGuard },
  ],
})

export default router
