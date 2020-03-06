import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'assets/css/global.css'
import 'assets/fonts/iconfont.css'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles 导入富文本编辑器得到样式


// 导入NProgress对应的JS和CSS
import NProgress from 'nprogress'


import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'


axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
//在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})




Vue.prototype.$http = axios
Vue.config.productionTip = false
//将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)


Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
