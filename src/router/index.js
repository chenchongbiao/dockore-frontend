import Vue from 'vue'
import VueRouter from 'vue-router'
import text from "@/utils/text";
import event from "@/utils/event";

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
        path: '',
        component: () => import('@/views/Index'),
      },
      {
        path: 'admin/system/config',
        component: () => import('@/views/admin/system/Config'),
        meta: {title: text.global.route_title.ADMIN_SYSTEM_CONFIG},
      },
      {
        path: 'admin/user',
        component: () => import('@/views/admin/user/Index'),
        meta: {title: text.global.route_title.ADMIN_USER},
      },
      {
        path: 'admin/user/add',
        component: () => import('@/views/admin/user/Item'),
        meta: {title: text.global.route_title.ADMIN_USER_ADD},
      },
      {
        path: 'admin/user/edit/:id',
        component: () => import('@/views/admin/user/Item'),
        meta: {title: text.global.route_title.ADMIN_USER_EDIT},
      },
      {
        path: 'system/version',
        component: () => import('@/views/system/Version'),
        meta: {title: text.global.route_title.SYSTEM_VERSION},
      },
      {
        path: 'image',
        component: () => import('@/views/image/Index'),
        meta: {title: text.global.route_title.IMAGE},
      },
      {
        path: 'image/:id',
        component: () => import('@/views/image/Item'),
        meta: {title: text.global.route_title.IMAGE_INFO},
      },
      {
        path: 'container',
        component: () => import('@/views/container/Index'),
        meta: {title: text.global.route_title.CONTAINER},
      },
      {
        path: 'container/:id',
        component: () => import('@/views/container/Item'),
        meta: {title: text.global.route_title.CONTAINER_INFO},
      },
      {
        path: 'container/terminal/:token',
        component: () => import('@/views/container/Terminal'),
        meta: {title: text.global.route_title.CONTAINER_TERMINAL},
      },
      {
        path: 'network',
        component: () => import('@/views/network/Index'),
        meta: {title: text.global.route_title.NETWORK},
      },
      {
        path: 'network/:id',
        component: () => import('@/views/network/Item'),
        meta: {title: text.global.route_title.NETWORK_INFO},
      },
      {
        path: 'volume',
        component: () => import('@/views/volume/Index'),
        meta: {title: text.global.route_title.VOLUME},
      },
      {
        path: 'volume/:id',
        component: () => import('@/views/volume/Item'),
        meta: {title: text.global.route_title.VOLUME_INFO},
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login'),
    meta: {title: '用户登录'},
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = text.global.project.name;
  if (to.meta.title)
    document.title = `${document.title}-${to.meta.title}`;
  Vue.prototype.$bus.$emit(event.update_active_menu, to.path);
  next();
})

export default router
