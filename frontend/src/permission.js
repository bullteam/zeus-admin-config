// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
// import { getDomainHost } from '@/utils'
// import {console} from "vuedraggable/src/util/helper";
// // import ro from "element-ui/src/locale/lang/ro";
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
//
// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//
//   // set page title
//   document.title = getPageTitle(to.meta.title)
//
//   // determine whether the user has logged in
//   const hasToken = getToken()
//
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // 判断是否拉取了菜单
//       // if (!store.getters.loadedMenus) {
//       //   // 拉取菜单
//       //   store
//       //     .dispatch('user/GetMenu')
//       //     .then(res => {
//       //       // 权限菜单
//       //       const powerMenus = res.data.result
//       //       // 生成可访问菜单
//       //       store.dispatch('permission/generateRoutes', powerMenus).then(() => {
//       //         // 动态添加可访问路由表
//       //         // router.addRoutes(store.getters.addRouters)
//       //         router.addRoutes(accessRoutes)
//       //         next({ ...to, replace: true })
//       //
//       //       })
//       //     })
//       //     .catch(error => {
//       //       // 拉取失败，返回登录
//       //       store.dispatch('FedLogOut').then(() => {
//       //         Message.error(error || 'Verification failed, please login again')
//       //         next({
//       //           path: '/'
//       //         })
//       //       })
//       //     })
//       //     .finally(res => {})
//       // } else {
//       //   next()
//       // }
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           // get user info
//           // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//           const result = await store.dispatch('user/GetMenu')
//           const roles = result.data.result
//           // console.log(roles)
//           // generate accessible routes map based on roles
//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
//           console.log(accessRoutes)
//           // dynamically add accessible routes
//           router.addRoutes(accessRoutes)
//           console.log('ssssss')
//           // hack method to ensure that addRoutes is complete
//           // set the replace: true, so the navigation will not leave a history record
//           // next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           // await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           // next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 在免登录白名单，直接进入
//       next()
//     } else {
//       // const domainHost = getDomainHost()
//       // const currURL = encodeURIComponent(location.href)
//       // if (process.env.NODE_ENV === 'production') {
//       //   if (location.host.startsWith('stage.')) {
//       //     location.href = `//stage.auth.${domainHost.domain}/login?redirectURL=${currURL}`
//       //   } else {
//       //     location.href = `//auth.${domainHost.domain}/login?redirectURL=${currURL}`
//       //   }
//       // } else {
//       //   // location.href = `//localhost:9527/login?redirectURL=${currURL}`
//       //   next(`/login?redirect=${to.path}`)
//       // }
//       NProgress.done()
//     }
//   }
// })
//
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

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
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const result = await store.dispatch('user/GetMenu')
          const roles = result.data.result
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log(accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      console.log('sssssssssssssssssssssssssssssss')
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
