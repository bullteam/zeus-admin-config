import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getDomainHost } from '@/utils'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断是否拉取了菜单
      if (!store.getters.loadedMenus) {
        // 拉取菜单
        store
          .dispatch('GetMenu')
          .then(res => {
            // 权限菜单
            const powerMenus = res.data.result
            // 生成可访问菜单
            store.dispatch('GenerateRoutes', powerMenus).then(() => {
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({
                ...to,
                replace: true
              })
            })
          })
          .catch(error => {
            // 拉取失败，返回登录
            store.dispatch('FedLogOut').then(() => {
              Message.error(error || 'Verification failed, please login again')
              next({
                path: '/'
              })
            })
          })
          .finally(res => {})
      } else {
        next()
      }
    }
  } else {
    /* has no token*/

    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      const domainHost = getDomainHost()
      const currURL = encodeURIComponent(location.href)
      if (process.env.NODE_ENV === 'production') {
        if (location.host.startsWith('stage.')) {
          location.href = `//stage.auth.${domainHost.domain}/login?redirectURL=${currURL}`
        } else {
          location.href = `//auth.${domainHost.domain}/login?redirectURL=${currURL}`
        }
      } else {
        location.href = `//auth.bullteam.cn/login?redirectURL=${currURL}`
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
