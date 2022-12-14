import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index.js'

import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import toast from '@/components/common/toast'

Vue.config.productionTip = false

// 添加事件总线事件
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

// 解决移动端300ms的延迟
FastClick.attach(document.body)

// 使用图片懒加载的插件
Vue.use(VueLazyload)
// Vue.use(VueLazyload, {
//   loading:import('./assets/img/common/.png')
// })
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
