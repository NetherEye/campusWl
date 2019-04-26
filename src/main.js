import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import '@/assets/css/public.css'
import router from './router'
import BaiduMap from 'vue-baidu-map'
import fetch from '@/assets/tools/fetch'
import allApi from "@/assets/api/login"
import '@/assets/tools/global'

Vue.use(BaiduMap, {
  ak: '5yTMLIZEcKHYuPFV4ME03XGBlqH1h2DT'
})

import {
  Message
} from 'element-ui'

// Vue.prototype.$baseUrl = '/proxy'

Vue.use(ElementUI);
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.name === '下线') {
    next()
    return
  }
  // 权限判断，级别页面禁止跳转
  let _level = to.matched[0].meta.level
  let _userName = sessionStorage.getItem('userName')
  if (_userName && _level === _userName) {
    next()
    return
  }
  // 路由权限
  fetch.get(allApi.isLogin, '', res => {
    if (res.code == 201) {
      window.location.href = res.data
    } else if (res.code === 403) { // 该角色没登录该系统的权限
      Message({
        type: 'error',
        message: res.message
      })
      setTimeout(() => {
        fetch.get(allApi.logout, '', res => {
          localStorage.clear()
          sessionStorage.clear()
          window.location.href = res.data
        })
      }, 1500)
      return
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(res.data))
      if (res.data.roleId == 2) {
        sessionStorage.setItem('userName', '学校')
        next('/s_shouye')
      } else if (res.data.roleId == 3) {
        sessionStorage.setItem('userName', '教师')
        next('/t_shouye')
      } else if (res.data.roleId == 5) {
        sessionStorage.setItem('userName', '家长')
        next('/p_shouye')
      }
    }
  })
  next()
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
