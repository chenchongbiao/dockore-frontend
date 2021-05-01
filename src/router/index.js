import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: 'system/version',
        component: () => import('@/views/system/Version'),
      },
      {
        path: 'system/config',
        component: () => import('@/views/system/Config'),
      },
      {
        path: 'image',
        component: () => import('@/views/image/Index'),
      },
      {
        path: 'image/:id',
        component: () => import('@/views/image/Item'),
      },
      {
        path: 'container',
        component: () => import('@/views/container/Index'),
      },
      {
        path: 'container/:id',
        component: () => import('@/views/container/Item'),
      },
      {
        path: 'container/terminal/:token',
        component: () => import('@/views/container/Terminal'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
