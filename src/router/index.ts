import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/home.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/Other/Page404.vue')
  },
  {
    path: '/403',
    name: 'NotAuth',
    component: () => import('@/pages/Other/Page403.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start()
  }

  //切换页面取消请求
  //   if (store.state.cancelTokenArr.length> 0){
  //     store.dispatch('clearCancelTokenArr')
  //   }

  //   const userInfo = window.localStorage.getItem('userInfo')

  /**
   * userInfo：localStorage中的用户信息
   * 用户信息存在 若跳转login 则重定向到dashboard
   * 用户信息存在 但没该路由权限 则跳转403
   * 用户信息不存在 且去的页面不是login 则跳转login
   */
  //   if (userInfo && to.path === '/login') {
  //     return next('/dashboard')
  //   } else if (userInfo && !isAuth(userInfo, to)) {
  //     return next({ path: '/403' })
  //   } else if (!userInfo && to.path !== '/login') {
  //     return next({ path: '/login' })
  //   }

  return next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

// function isAuth(userInfo: string | null, to: RouteLocationNormalized): boolean {
//   let role = -1
//   if (userInfo) {
//     role = JSON.parse(userInfo as string).role as number
//   }
//   const auth = (to.meta.auth as number[]) || []
//   return auth.includes(role)
// }

export default router
